import { Component, inject } from '@angular/core';
import { WindowService } from '../../services/window-service';
import { OsWindow } from '../os-window/os-window';

@Component({
  selector: 'app-desktop',
  imports: [OsWindow],
  templateUrl: './desktop.html',
  styleUrl: './desktop.scss',
})
export class Desktop {
  windowService = inject(WindowService)
}
