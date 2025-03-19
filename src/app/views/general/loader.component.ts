// src/app/shared/components/loader/loader.component.ts

import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-loader',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="flex justify-center items-center" [ngClass]="containerClass">
      <div class="animate-spin rounded-full h-{{ size }} w-{{ size }} border-t-2 border-b-2 border-purple-800"></div>
      <span *ngIf="text" class="ml-2 text-purple-800">{{ text }}</span>
    </div>
  `,
  styles: []
})
export class LoaderComponent {
  @Input() size: string = '6'; // Default size, can be overridden (tailwind sizes)
  @Input() text: string = '';  // Optional text to display alongside the spinner
  @Input() containerClass: string = ''; // Additional classes for the container
}