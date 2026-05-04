import { Component, input } from '@angular/core';
import { WindowMiniIcon } from '../../models/window-mini-icon';

@Component({
  selector: 'app-window-icon',
  imports: [],
  templateUrl: './window-icon.html',
  styleUrl: './window-icon.scss',
})
export class WindowIcon {
  iconData = input.required<WindowMiniIcon>()
}
