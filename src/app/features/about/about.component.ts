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
    this.metaService.updateTag({ name: 'description', content: 'ONE ELEMENT makes performance activewear that holds up through real training. Learn our story and what we stand for.' });
  }
  values = [
    { title: 'Made to Be Used', desc: 'This is not display gear. It is made to train in, sweat in, and wash fifty times without falling apart.' },
    { title: 'Real Materials', desc: '4-way stretch. Anti-odour. Moisture-wicking. The kind of fabric that matters when you are mid-session and have no interest in stopping.' },
    { title: 'No Fast Fashion', desc: 'We do not drop fifty products a season. We make fewer things and make them properly.' },
    { title: 'Open to Everyone', desc: 'Professional or beginner, morning run or evening lift. If you show up and put in the work, this gear is for you.' }
  ];

  team = [
    { name: 'Vinay Reddy', role: 'Founder & CEO', img: 'assets/vinay.jpeg' },
    { name: 'Vishnu Reddy', role: 'Co-Founder & Head of Product', img: 'assets/vishnu.jpeg' }
  ];
}
