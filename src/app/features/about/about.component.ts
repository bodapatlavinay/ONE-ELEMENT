import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-about',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './about.component.html',
  styleUrl: './about.component.scss'
})
export class AboutComponent {
  values = [
    { icon: '⚡', title: 'Performance First', desc: 'Every stitch, every fibre is engineered to help you outperform your last session.' },
    { icon: '🇮🇳', title: 'Made for India', desc: 'Designed for India\'s climate, athlete body types, and relentless training culture.' },
    { icon: '♻️', title: 'Sustainable Future', desc: 'We use 40% recycled materials across our range and are committed to net-zero by 2030.' },
    { icon: '🤝', title: 'Community Driven', desc: '50,000+ athletes. From crossfit boxes to marathon start lines, we\'re there with you.' }
  ];

  team = [
    { name: 'Vinay Reddy', role: 'Founder & CEO', img: 'assets/vinay.jpg' },
    { name: 'Vishnu Reddy', role: 'Co-Founder & Head of Product', img: 'assets/vishnu.jpg' },
    { name: 'Uday Reddy', role: 'Head of Design', img: 'assets/uday.jpg' }
  ];
}
