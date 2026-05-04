import { Component } from '@angular/core';
import { Desktop } from '../desktop/desktop';
import { TaskBar } from '../task-bar/task-bar';

@Component({
  selector: 'app-screen',
  imports: [Desktop, TaskBar],
  templateUrl: './screen.html',
  styleUrl: './screen.scss',
})
export class Screen {}
