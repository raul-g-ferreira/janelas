import { ChangeDetectionStrategy, Component, computed, ElementRef, input, NgZone, OnDestroy, OnInit } from '@angular/core';
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

  private isDragging = false
  private dragOffsetX = 0
  private dragOffsetY = 0

  private ticking = false

  constructor(
    private elementRef: ElementRef,
    private ngZone: NgZone,
    public windowService: WindowService
  ) {}

  private resizeObserver!: ResizeObserver;

  ngOnInit(): void {
    this.resizeObserver = new ResizeObserver(entries => {
        const entry = entries[0]
        this.resize(entry.contentRect.width, entry.contentRect.height)
    })
    this.ngZone.runOutsideAngular(() => {
      this.resizeObserver.observe(this.elementRef.nativeElement.querySelector('.window-container'))
    })
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
    if(this.winData().isMaximized) {
      this.windowService.restoreMaximizedWindow(this.winData().id)
    } else {
      this.windowService.restoreWindow(this.winData().id)
    }
  }

  startDrag(event: MouseEvent) {
    this.isDragging = true

    this.dragOffsetX = event.clientX - this.winData().x
    this.dragOffsetY = event.clientY - this.winData().y

    event.preventDefault()

    this.ngZone.runOutsideAngular(() => {
      document.addEventListener('mousemove', this.onMouseMove)
      document.addEventListener('mouseup', this.onMouseUp)
    })
  }

  public onMouseMove = (event: MouseEvent) => {
    if(!this.isDragging) return

    if(!this.ticking) {
      window.requestAnimationFrame(() => {

        let newX = event.clientX - this.dragOffsetX
        let newY = event.clientY - this.dragOffsetY

        const minX = 0
        const maxX = window.innerWidth - this.winData().width - (0.1 * window.innerWidth) // 10vw
        const minY = 0
        const maxY = window.innerHeight - this.winData().height

        newX = Math.max(minX, Math.min(maxX, newX))
        newY = Math.max(minY, Math.min(maxY, newY))

        this.ngZone.run(() => this.windowService.updateWindow(this.winData().id, newX, newY, this.winData().width, this.winData().height))

        this.ticking = false
      })
      this.ticking = true
    }
  }

  public onMouseUp = () => {
    this.isDragging = false
    document.removeEventListener('mousemove', this.onMouseMove)
    document.removeEventListener('mouseup', this.onMouseUp)
  }

  resize(newWidth: number, newHeight: number) {
    if (!this.winData().isMaximized) {
      this.ngZone.run(() => {
        this.windowService.updateWindow(this.winData().id, this.winData().x, this.winData().y, newWidth, newHeight)
      })
    }
  }

  public transformStyle = computed(() => {
    const data = this.winData()
    if (data.isMaximized) {
      return 'translate3d(0px, 0px, 0)'
    }
    return `translate3d(${data.x}px , ${data.y}px, 0)`
  })

  windowWidth = computed(() => { return this.winData().isMaximized ? '100%' : `${this.winData().width}px`})
  windowHeight = computed(() => { return this.winData().isMaximized ? '100%' : `${this.winData().height}px`})

  windowMaxWidth = computed(() => { return `calc(100% - ${(this.winData().isMaximized ? '0' : this.winData().x)}px - 10vw)`})
  windowMaxHeight = computed(() => { return `calc(100% - ${(this.winData().isMaximized ? '0' : this.winData().y)}px)`})

  windowZIndex = computed(() => { return this.winData().zIndex })

  windowResize = computed(() => { return this.winData().isMaximized ? 'none' : 'both'})
}
