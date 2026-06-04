import { Injectable, inject, signal, computed } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, map, catchError, of, switchMap } from 'rxjs';
import { environment } from '../../../environments/environment';

const { domain, storefrontToken, apiVersion } = environment.shopify;
const ENDPOINT = `https://${domain}/api/${apiVersion}/graphql.json`;
const HEADERS = new HttpHeaders({
  'Content-Type': 'application/json',
  'X-Shopify-Storefront-Access-Token': storefrontToken
});
const TOKEN_KEY = 'oe_customer_token';

export interface CustomerOrder {
  id: string;
  orderNumber: number;
  processedAt: string;
  financialStatus: string;
  fulfillmentStatus: string;
  totalPrice: { amount: string; currencyCode: string };
  lineItems: { title: string; quantity: number }[];
}

export interface Customer {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  phone?: string;
  orders: CustomerOrder[];
}

const LOGIN_MUTATION = `
  mutation customerAccessTokenCreate($input: CustomerAccessTokenCreateInput!) {
    customerAccessTokenCreate(input: $input) {
      customerAccessToken { accessToken expiresAt }
      customerUserErrors { code field message }
    }
  }
`;

const CUSTOMER_QUERY = `
  query GetCustomer($accessToken: String!) {
    customer(customerAccessToken: $accessToken) {
      id firstName lastName email phone
      orders(first: 10, sortKey: PROCESSED_AT, reverse: true) {
        edges {
          node {
            id orderNumber processedAt financialStatus fulfillmentStatus
            totalPrice { amount currencyCode }
            lineItems(first: 5) {
              edges { node { title quantity } }
            }
          }
        }
      }
    }
  }
`;

export interface LoginResult {
  success: boolean;
  error?: string;
}

@Injectable({ providedIn: 'root' })
export class CustomerService {
  private http = inject(HttpClient);

  private _customer = signal<Customer | null>(null);
  private _loading = signal(false);
  private _token = signal<string | null>(this.getSavedToken());

  customer = this._customer.asReadonly();
  loading = this._loading.asReadonly();
  isLoggedIn = computed(() => !!this._token() && !!this._customer());

  constructor() {
    const token = this.getSavedToken();
    if (token) {
      this._loading.set(true);
      this.fetchCustomer(token).subscribe(() => this._loading.set(false));
    }
  }

  login(email: string, password: string): Observable<LoginResult> {
    this._loading.set(true);
    return this.http.post<any>(ENDPOINT, {
      query: LOGIN_MUTATION,
      variables: { input: { email, password } }
    }, { headers: HEADERS }).pipe(
      switchMap(res => {
        const errors = res.data?.customerAccessTokenCreate?.customerUserErrors;
        if (errors?.length) {
          this._loading.set(false);
          return of<LoginResult>({ success: false, error: errors[0].message });
        }
        const token: string = res.data?.customerAccessTokenCreate?.customerAccessToken?.accessToken;
        if (!token) {
          this._loading.set(false);
          return of<LoginResult>({ success: false, error: 'Login failed. Please try again.' });
        }
        this._token.set(token);
        localStorage.setItem(TOKEN_KEY, token);
        return this.fetchCustomer(token).pipe(
          map(() => {
            this._loading.set(false);
            return { success: true } as LoginResult;
          })
        );
      }),
      catchError(() => {
        this._loading.set(false);
        return of<LoginResult>({ success: false, error: 'Network error. Please try again.' });
      })
    );
  }

  fetchCustomer(token: string): Observable<Customer | null> {
    return this.http.post<any>(ENDPOINT, {
      query: CUSTOMER_QUERY,
      variables: { accessToken: token }
    }, { headers: HEADERS }).pipe(
      map(res => {
        const c = res.data?.customer;
        if (!c) { this.clearToken(); return null; }
        const customer: Customer = {
          id: c.id,
          firstName: c.firstName || '',
          lastName: c.lastName || '',
          email: c.email,
          phone: c.phone,
          orders: (c.orders?.edges ?? []).map((e: any) => ({
            id: e.node.id,
            orderNumber: e.node.orderNumber,
            processedAt: e.node.processedAt,
            financialStatus: e.node.financialStatus,
            fulfillmentStatus: e.node.fulfillmentStatus,
            totalPrice: e.node.totalPrice,
            lineItems: (e.node.lineItems?.edges ?? []).map((li: any) => ({
              title: li.node.title,
              quantity: li.node.quantity
            }))
          }))
        };
        this._customer.set(customer);
        return customer;
      }),
      catchError(() => {
        this.clearToken();
        return of(null);
      })
    );
  }

  logout(): void {
    this.clearToken();
  }

  private clearToken(): void {
    this._token.set(null);
    this._customer.set(null);
    localStorage.removeItem(TOKEN_KEY);
  }

  private getSavedToken(): string | null {
    try { return localStorage.getItem(TOKEN_KEY); } catch { return null; }
  }
}
