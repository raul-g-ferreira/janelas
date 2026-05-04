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
    const newWindow = {
      id: crypto.randomUUID(),
      title: title,
      x: 500 + Math.random() * 100,
      y: 300 + Math.random() * 100,
      width: 800,
      height: 400,
      previousX: 0,
      previousY: 0,
      previousWidth: 0,
      previousHeight: 0,
      zIndex: ++this.zIndexCounter,
      isUnique: isUnique,
      isVisible: true,
      isMaximized: false
    }

    if (isUnique) {
      const uniqueWindow = this.windows().filter(w => w.isUnique)[0]
      if (uniqueWindow) {
        this.focusWindow(uniqueWindow.id)
        return
      }
    }

    this.windows.update(w => [...w, newWindow])
  }

  focusWindow(id: string) {
    this.windows.update(wins => wins.map(w =>
      w.id === id ? { ...w, zIndex: ++this.zIndexCounter} : w
    ))
  }

  closeWindow(id: string) {
    this.windows.update(wins => wins.filter(w => w.id !== id))
  }

  updateWindowPostion(id: string, newX: number, newY: number) {
    this.windows.update(wins => wins.map(w =>
      w.id === id ? {...w, x: newX, y: newY} : w
    ))
  }

  maximizeWindow(id: string) {
    this.windows.update(wins => wins.map(w =>
      w.id === id ? {
        ...w,
        previousX: w.x,
        previousY: w.y,
        previousWidth: w.width,
        previousHeight:w.height,
        x: 100,
        y: 0,
        width: window.innerWidth - 100,
        height: window.innerHeight,
        isMaximized: true
       } : w
    ))
  }

  restoreWindow(id:string) {
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
    this.focusWindow(id)
  }

  minimizeWindow(id: string) {

    const newIcon = {
      id: id
    }

    this.windows.update(wins => wins.map(w =>
      w.id === id ? {
        ...w,
        isVisible: false
      } : w
    ))

    this.icons.update(ico => [...ico, newIcon] )
  }
}
