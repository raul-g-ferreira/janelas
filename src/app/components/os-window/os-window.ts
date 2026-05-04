import { Desktop } from './../desktop/desktop';
import { Component, HostListener, inject, input } from '@angular/core';
import { WebWindow } from '../../models/web-window';
import { WindowService } from './../../services/window-service';

@Component({
  selector: 'app-os-window',
  imports: [],
  templateUrl: './os-window.html',
  styleUrl: './os-window.scss',
})
export class OsWindow {
  winData = input.required<WebWindow>()
  windowService = inject(WindowService)

  private isDragging = false
  private dragOffsetX = 0
  private dragOffsetY = 0

  private previousX = 0
  private previousY = 0

  bringToFront() {
    this.windowService.focusWindow(this.winData().id)
  }

  close() {
    this.windowService.closeWindow(this.winData().id)
  }

  maximize() {
    this.windowService.maximizeWindow(this.winData().id)
  }

  restore() {
    this.windowService.restoreWindow(this.winData().id)
  }

  startDrag(event: MouseEvent) {
    this.bringToFront()
    this.isDragging = true

    this.dragOffsetX = event.clientX - this.winData().x
    this.dragOffsetY = event.clientY - this.winData().y

    event.preventDefault()
  }

  @HostListener('document:mousemove', ['$event'])
  onMouseMove(event: MouseEvent) {
    if(!this.isDragging) return

    let newX = event.clientX - this.dragOffsetX
    let newY = event.clientY - this.dragOffsetY

    // const desktop = document.querySelector<HTMLElement>('.desktop')

    const minX = 100
    const maxX = window.innerWidth - this.winData().width - 6
    const minY = 0
    const maxY = window.innerHeight - this.winData().height - 6

    newX = Math.max(minX, Math.min(maxX, newX))
    newY = Math.max(minY, Math.min(maxY, newY))

    this.windowService.updateWindowPostion(this.winData().id, newX, newY)
  }

  @HostListener('document:mouseup')
  onMouseUp() {
    this.isDragging = false
  }
}
