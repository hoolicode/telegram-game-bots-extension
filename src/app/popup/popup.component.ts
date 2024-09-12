import { Component, inject } from '@angular/core';
import { SwitchComponent } from '../ui/switch/switch.component';
import { ConfigService } from '../services/configs/configs.service';
import { FormsModule } from '@angular/forms';
import { AsyncPipe } from '@angular/common';
import { toSignal } from '@angular/core/rxjs-interop';

@Component({
  selector: 'app-popup',
  standalone: true,
  imports: [SwitchComponent, FormsModule, AsyncPipe],
  templateUrl: './popup.component.html',
  styleUrl: './popup.component.scss',
})
export class PopupComponent {
  protected readonly configService = inject(ConfigService);
  protected config = toSignal(this.configService.config$);
}
