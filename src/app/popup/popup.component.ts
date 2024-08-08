import { Component, inject } from '@angular/core';
import { WINDOW } from "../providers/window";
import { SwitchComponent } from "../ui/switch/switch.component";

@Component({
  selector: 'app-popup',
  standalone: true,
  imports: [
    SwitchComponent
  ],
  templateUrl: './popup.component.html',
  styleUrl: './popup.component.scss'
})
export class PopupComponent {
  private readonly window = inject(WINDOW);
  protected readonly lang = this.window.navigator.language;
}
