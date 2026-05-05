export interface WebWindow {
  id: string,
  title: string,
  x: number,
  y: number,
  width: number,
  height: number,
  previousX: number,
  previousY: number,
  previousWidth: number,
  previousHeight: number,
  zIndex: number,
  isUnique: boolean,
  isVisible: boolean,
  isMaximized: boolean,
  onFocus: boolean
}
