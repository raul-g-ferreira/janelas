import { ChangeDetectionStrategy, Component } from '@angular/core';
import { WindowService } from '../../services/window-service';
import { OsWindow } from '../os-window/os-window';

@Component({
  selector: 'app-desktop',
  imports: [OsWindow],
  templateUrl: './desktop.html',
  styleUrl: './desktop.scss',
  changeDetection: ChangeDetectionStrategy.OnPush

})
export class Desktop {
  constructor (
    public windowService: WindowService
  ) {}
}
