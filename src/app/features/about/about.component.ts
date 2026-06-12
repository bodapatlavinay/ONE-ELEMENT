import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Title, Meta } from '@angular/platform-browser';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-about',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './about.component.html',
  styleUrl: './about.component.scss'
})
export class AboutComponent implements OnInit {
  private titleService = inject(Title);
  private metaService = inject(Meta);

  ngOnInit(): void {
    this.titleService.setTitle('About Us | ONE ELEMENT Activewear');
    this.metaService.updateTag({ name: 'description', content: 'Learn about ONE ELEMENT — premium Indian activewear brand built for performance. Our story, mission, and the team behind the brand.' });
  }
  values = [
    { icon: '⚡', title: 'Performance First', desc: 'Every stitch, every fibre is engineered to help you outperform your last session.' },
    { icon: '🇮🇳', title: 'Made for India', desc: 'Designed for India\'s climate, athlete body types, and relentless training culture.' },
    { icon: '♻️', title: 'Sustainable Future', desc: 'We use 40% recycled materials across our range and are committed to net-zero by 2030.' },
    { icon: '🤝', title: 'Community Driven', desc: '50,000+ athletes. From crossfit boxes to marathon start lines, we\'re there with you.' }
  ];

  team = [
    { name: 'Vinay Reddy', role: 'Founder & CEO', img: 'assets/vinay.jpeg' },
    { name: 'Vishnu Reddy', role: 'Co-Founder & Head of Product', img: 'assets/vishnu.jpeg' }
  ];
}
