import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';
@Component({
  selector: 'app-size-guide',
  standalone: true,
  imports: [RouterLink],
  template: `
    <div class="size-page">
      <div class="size-inner">
        <a routerLink="/shop" class="back-link">← Back to Shop</a>
        <p class="eyebrow">FIT GUIDE</p>
        <h1>Find Your Size</h1>
        <p class="sub">All measurements are in centimetres. When between sizes, size up for a relaxed fit or size down for a compression fit.</p>

        <h2>Men's</h2>
        <div class="table-wrap">
          <table>
            <thead><tr><th>Size</th><th>Chest</th><th>Waist</th><th>Hip</th><th>Height</th></tr></thead>
            <tbody>
              <tr><td>XS</td><td>84–88</td><td>70–74</td><td>88–92</td><td>163–168</td></tr>
              <tr><td>S</td><td>88–92</td><td>74–78</td><td>92–96</td><td>168–173</td></tr>
              <tr><td>M</td><td>92–96</td><td>78–82</td><td>96–100</td><td>173–178</td></tr>
              <tr><td>L</td><td>96–100</td><td>82–86</td><td>100–104</td><td>178–183</td></tr>
              <tr><td>XL</td><td>100–106</td><td>86–92</td><td>104–110</td><td>183–188</td></tr>
              <tr><td>XXL</td><td>106–112</td><td>92–98</td><td>110–116</td><td>188+</td></tr>
            </tbody>
          </table>
        </div>

        <h2>Women's</h2>
        <div class="table-wrap">
          <table>
            <thead><tr><th>Size</th><th>Bust</th><th>Waist</th><th>Hip</th><th>Height</th></tr></thead>
            <tbody>
              <tr><td>XS</td><td>78–82</td><td>60–64</td><td>84–88</td><td>155–160</td></tr>
              <tr><td>S</td><td>82–86</td><td>64–68</td><td>88–92</td><td>160–165</td></tr>
              <tr><td>M</td><td>86–90</td><td>68–72</td><td>92–96</td><td>165–170</td></tr>
              <tr><td>L</td><td>90–94</td><td>72–76</td><td>96–100</td><td>170–175</td></tr>
              <tr><td>XL</td><td>94–100</td><td>76–82</td><td>100–106</td><td>175–180</td></tr>
            </tbody>
          </table>
        </div>

        <div class="tip-box">
          <p><strong>How to measure:</strong> Use a soft measuring tape. For chest/bust — measure around the fullest part. For waist — measure around the narrowest point. For hip — measure around the fullest part of your hips.</p>
          <p style="margin-top:12px">Still unsure? <a routerLink="/contact">Contact us</a> and we'll help you pick the right size.</p>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .size-page { min-height: 100vh; background: var(--bg-primary); padding: 120px 80px 80px; }
    .size-inner { max-width: 800px; margin: 0 auto; }
    @media (max-width: 768px) { .size-page { padding: 100px 24px 60px; } }
    .back-link { color: var(--accent); text-decoration: none; font-size: 14px; font-weight: 500; display: inline-block; margin-bottom: 32px; }
    .eyebrow { font-size: 11px; font-weight: 700; letter-spacing: 0.2em; color: var(--accent); margin-bottom: 12px; }
    h1 { font-family: var(--font-display); font-size: 56px; font-weight: 900; color: #fff; margin-bottom: 16px; }
    .sub { font-size: 16px; color: rgba(255,255,255,0.5); line-height: 1.7; margin-bottom: 48px; max-width: 560px; }
    h2 { font-size: 22px; font-weight: 700; color: #fff; margin: 40px 0 16px; }
    .table-wrap { overflow-x: auto; border-radius: 10px; border: 1px solid rgba(255,255,255,0.08); margin-bottom: 8px; }
    table { width: 100%; border-collapse: collapse; }
    th { background: rgba(255,255,255,0.05); color: rgba(255,255,255,0.5); font-size: 12px; font-weight: 700; letter-spacing: 0.1em; text-transform: uppercase; padding: 14px 20px; text-align: left; }
    td { padding: 14px 20px; font-size: 15px; color: rgba(255,255,255,0.75); border-top: 1px solid rgba(255,255,255,0.05); }
    tr:hover td { background: rgba(255,255,255,0.03); }
    td:first-child { font-weight: 700; color: var(--accent); }
    .tip-box { background: rgba(226,88,34,0.08); border: 1px solid rgba(226,88,34,0.2); border-radius: 10px; padding: 24px; margin-top: 40px; }
    .tip-box p { font-size: 14px; color: rgba(255,255,255,0.6); line-height: 1.7; }
    .tip-box a { color: var(--accent); }
    .tip-box strong { color: rgba(255,255,255,0.85); }
  `]
})
export class SizeGuideComponent {}
