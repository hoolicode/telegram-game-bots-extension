import { Component, ElementRef, forwardRef, Input, OnInit, Renderer2, ViewChild } from '@angular/core';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';
import { NgClass } from '@angular/common';

type SwitchSize = 'mini' | 'default';

@Component({
  selector: 'app-switch',
  templateUrl: './switch.component.html',
  styleUrls: ['./switch.component.scss'],
  standalone: true,
  imports: [NgClass],
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => SwitchComponent),
      multi: true,
    },
  ],
})
export class SwitchComponent implements ControlValueAccessor {
  onChange = (_: any) => {};
  onTouched = () => {};
  @ViewChild('el', { static: true }) el!: ElementRef;

  @Input() size: SwitchSize = 'default';

  constructor(private _renderer: Renderer2) {}

  registerOnChange(fn: (_: any) => {}): void {
    this.onChange = fn;
  }

  registerOnTouched(fn: () => {}): void {
    this.onTouched = fn;
  }

  setDisabledState(isDisabled: boolean): void {
    this._renderer.setProperty(this.el.nativeElement, 'disabled', isDisabled);
  }

  writeValue(value: boolean): void {
    this._renderer.setProperty(this.el.nativeElement, 'checked', value);
  }
}
