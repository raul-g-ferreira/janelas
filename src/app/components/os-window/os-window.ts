import { Desktop } from './../desktop/desktop';
import { ChangeDetectionStrategy, Component, ElementRef, HostListener, inject, input, NgZone, OnDestroy, OnInit } from '@angular/core';
import { WebWindow } from '../../models/web-window';
import { WindowService } from './../../services/window-service';

@Component({
  selector: 'app-os-window',
  imports: [],
  templateUrl: './os-window.html',
  styleUrl: './os-window.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class OsWindow implements OnInit, OnDestroy{
  winData = input.required<WebWindow>()
  windowService = inject(WindowService)

  private isDragging = false
  private dragOffsetX = 0
  private dragOffsetY = 0


  constructor(
    private elementRef: ElementRef,
    private ngZone: NgZone,
  ) {}

  private resizeObserver!: ResizeObserver;

  ngOnInit(): void {
    this.resizeObserver = new ResizeObserver(entries => {
      this.ngZone.run(() => {
        const entry = entries[0]
        this.resize(entry.contentRect.width, entry.contentRect.height)
      })
    })

    this.resizeObserver.observe(this.elementRef.nativeElement.querySelector('.window-container'))
  }

  ngOnDestroy(): void {
    this.resizeObserver.disconnect()
  }

  bringToFront() {
    this.windowService.focusWindow(this.winData().id)
  }

  close() {
    this.windowService.closeWindow(this.winData().id)
  }

  maximize() {
    this.windowService.maximizeWindow(this.winData().id)
  }

  minimize() {
    this.windowService.minimizeWindow(this.winData().id)
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
    document.addEventListener('mousemove', this.onMouseMove)
    document.addEventListener('mouseup', this.onMouseUp)
  }

  public onMouseMove = (event: MouseEvent) => {
    if(!this.isDragging) return

    let newX = event.clientX - this.dragOffsetX
    let newY = event.clientY - this.dragOffsetY

    const minX = 0
    const maxX = window.innerWidth - this.winData().width - 100
    const minY = 0
    const maxY = window.innerHeight - this.winData().height

    newX = Math.max(minX, Math.min(maxX, newX))
    newY = Math.max(minY, Math.min(maxY, newY))

    this.windowService.updateWindowPosition(this.winData().id, newX, newY)
  }

  public onMouseUp = () => {
    this.isDragging = false

    document.removeEventListener('mousemove', this.onMouseMove)
    document.removeEventListener('mouseup', this.onMouseUp)
  }

  resize(newWidth: number, newHeight: number) {
    if (!this.winData().isMaximized) {
      this.windowService.updateWindowSize(this.winData().id, newWidth, newHeight)
    }
  }
}
