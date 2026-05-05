import { Component, inject } from '@angular/core';
import { WindowService } from '../../services/window-service';
import { WindowIcon } from '../window-icon/window-icon';

@Component({
  selector: 'app-task-bar',
  imports: [WindowIcon],
  templateUrl: './task-bar.html',
  styleUrl: './task-bar.scss',
})
export class TaskBar {
  windowService = inject(WindowService)
}
