import { Injectable, signal, computed } from '@angular/core';
import { initializeApp, getApps, FirebaseApp } from 'firebase/app';
import {
  getAuth, Auth,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signInWithPopup,
  GoogleAuthProvider,
  signOut,
  onAuthStateChanged,
  sendPasswordResetEmail,
  User
} from 'firebase/auth';
import { environment } from '../../../environments/environment';

@Injectable({ providedIn: 'root' })
export class AuthService {
  private app: FirebaseApp = getApps().length
    ? getApps()[0]
    : initializeApp(environment.firebase);
  private auth: Auth = getAuth(this.app);
  private googleProvider = new GoogleAuthProvider();

  user = signal<User | null>(null);
  loading = signal(true);
  isLoggedIn = computed(() => !!this.user());

  constructor() {
    onAuthStateChanged(this.auth, (user) => {
      this.user.set(user);
      this.loading.set(false);
    });
  }

  loginWithGoogle(): Promise<void> {
    return signInWithPopup(this.auth, this.googleProvider).then(() => {});
  }

  loginWithEmail(email: string, password: string): Promise<void> {
    return signInWithEmailAndPassword(this.auth, email, password).then(() => {});
  }

  registerWithEmail(email: string, password: string): Promise<void> {
    return createUserWithEmailAndPassword(this.auth, email, password).then(() => {});
  }

  resetPassword(email: string): Promise<void> {
    return sendPasswordResetEmail(this.auth, email);
  }

  logout(): Promise<void> {
    return signOut(this.auth);
  }
}
