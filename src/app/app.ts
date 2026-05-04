import { Component } from '@angular/core';
import { Screen } from './components/screen/screen';

@Component({
  selector: 'app-root',
  imports: [Screen],
  templateUrl: './app.html',
  styleUrl: './app.scss'
})
export class App {}
