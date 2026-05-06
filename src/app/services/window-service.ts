import { Injectable, signal } from '@angular/core';
import { WebWindow } from '../models/web-window';
import { WindowMiniIcon } from '../models/window-mini-icon';

@Injectable({
  providedIn: 'root',
})
export class WindowService {
  windows = signal<WebWindow[]>([])
  icons = signal<WindowMiniIcon[]>([])

  private zIndexCounter = 1000

  openWindow(title: string, isUnique: boolean) {

    if (isUnique) {
      const uniqueWindow = this.windows().filter(w => w.isUnique)[0]
      if (uniqueWindow) {
        this.restoreWindow(uniqueWindow.id)
        return
      }
    }
    const newWindow = {
      id: crypto.randomUUID(),
      title: title,
      x: 5 + Math.random() * 50,
      y: 10 + Math.random() * 50,
      width: 300,
      height: 150,
      previousX: 0,
      previousY: 0,
      previousWidth: 0,
      previousHeight: 0,
      zIndex: 0,
      isUnique: isUnique,
      isVisible: true,
      isMaximized: false,
      onFocus: false
    }
    this.windows.update(w => [...w, newWindow])
    this.focusWindow(newWindow.id)
  }

  focusWindow(id: string) {
    this.windows.update(wins => wins.map(w =>
      w.id === id ? {
        ...w,
        zIndex: ++this.zIndexCounter,
        onFocus: true
      } : {...w, onFocus: false}
    ))
  }

  closeWindow(id: string) {
    this.windows.update(wins => wins.filter(w => w.id !== id))
  }

  updateWindowPosition(id: string, newX: number, newY: number) {
    this.windows.update(wins => wins.map(w =>
      w.id === id ? { ...w, x: newX, y: newY } : w
    ))
    this.setPreviousStats(id)
  }

  updateWindowSize(id: string, newWidth: number, newHeight: number) {
    this.windows.update(wins => wins.map(w =>
      w.id === id ? {
        ...w,
        width: newWidth,
        height: newHeight,
      } : w
    ))
    this.setPreviousStats(id)
  }

  maximizeWindow(id: string) {
    this.setPreviousStats(id)
    this.windows.update(wins => wins.map(w =>
      w.id === id ? {
        ...w,
        x: 0,
        y: 0,
        width: window.innerWidth - (window.innerWidth * 0.1),
        height: window.innerHeight,
        isMaximized: true
      } : w
    ))
  }

  restoreWindow(id: string) {
    this.windows.update(wins => wins.map(w =>
      w.id === id ? {
        ...w,
        x: w.previousX,
        y: w.previousY,
        width: w.previousWidth,
        height: w.previousHeight,
        isMaximized: false,
        isVisible: true
      } : w
    ))
    this.removeIcon(id)
    this.focusWindow(id)
  }

  minimizeWindow(id: string) {
    this.setPreviousStats(id)
    const newIcon = {
      id: id
    }

    this.windows.update(wins => wins.map(w =>
      w.id === id ? {
        ...w,
        isVisible: false
      } : w
    ))

    this.icons.update(ico => [...ico, newIcon])
  }

  removeIcon(id: string) {
    this.icons.update(ico => ico.filter(i => i.id !== id))
  }

  setPreviousStats(id: string) {
    this.windows.update(wins => wins.map(w =>
      w.id === id ? {
        ...w,
        previousX: w.x,
        previousY: w.y,
        previousWidth: w.width,
        previousHeight: w.height,
      } : w
    ))
  }
}
