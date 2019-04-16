export interface Screenshot {
  dataUrl: string;
  data: ImageData;
}

export interface Area {
  x: number;
  y: number;
  width: number;
  height: number;
}

interface ScreenshotConfig {
  format?: string;
  quality?: number;
  width?: number;
  height?: number;
  area?: Area;
}
