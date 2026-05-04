import { Component, inject } from '@angular/core';
import { WindowService } from '../../services/window-service';

@Component({
  selector: 'app-task-bar',
  imports: [],
  templateUrl: './task-bar.html',
  styleUrl: './task-bar.scss',
})
export class TaskBar {
  windowService = inject(WindowService)
}
