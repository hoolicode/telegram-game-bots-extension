import { Component } from '@angular/core';
import { SwitchComponent } from '../ui/switch/switch.component';

@Component({
  selector: 'app-popup',
  standalone: true,
  imports: [SwitchComponent],
  templateUrl: './popup.component.html',
  styleUrl: './popup.component.scss',
})
export class PopupComponent {}
