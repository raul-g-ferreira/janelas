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
    this.windows.update(wins => wins.map(w => {
      if(w.id === id ) {
        return {...w, zIndex: ++this.zIndexCounter, onFocus: true}
      }
      if (w.onFocus) {
        return { ...w, onFocus: false}
      }
      return w
    }
    ))
  }

  closeWindow(id: string) {
    this.windows.update(wins => wins.filter(w => w.id !== id))
  }

  updateWindow(id: string, newX: number, newY: number, newWidth: number, newHeight: number) {
    this.windows.update(wins => wins.map(w =>
      w.id === id ? {
        ...w,
        x: newX,
        y: newY,
        width: newWidth,
        height: newHeight,
      } : w
    ))
  }

  maximizeWindow(id: string) {
    this.windows.update(wins => wins.map(w =>
      w.id === id ? {
        ...w,
        isMaximized: true
      } : w
    ))
  }

  restoreWindow(id: string) {
    this.windows.update(wins => wins.map(w =>
      w.id === id ? {
        ...w,
        isVisible: true
      } : w
    ))
    this.removeIcon(id)
    this.focusWindow(id)
  }

  restoreMaximizedWindow(id: string) {
    this.windows.update(wins => wins.map(w =>
      w.id === id ? {
        ...w,
        isMaximized: false,
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

    this.icons.update(ico => [...ico, newIcon])
  }

  removeIcon(id: string) {
    this.icons.update(ico => ico.filter(i => i.id !== id))
  }
}
