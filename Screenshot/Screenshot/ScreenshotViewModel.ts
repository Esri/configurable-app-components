// Copyright 2020 Esri
// Licensed under the Apache License, Version 2.0 (the "License");
// you may not use this file except in compliance with the License.
// You may obtain a copy of the License at
//     http://www.apache.org/licenses/LICENSE-2.0
// Unless required by applicable law or agreed to in writing, software
// distributed under the License is distributed on an "AS IS" BASIS,
// WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
// See the License for the specific language governing permissions and
// limitations under the License.​

import Accessor = require("esri/core/Accessor");
import MapView = require("esri/views/MapView");
import SceneView = require("esri/views/SceneView");
import WebMap = require("esri/WebMap");
import WebScene = require("esri/WebScene");
import html2canvas = require("./html2canvas/html2canvas");
import Handles = require("esri/core/Handles");
import watchUtils = require("esri/core/watchUtils");
import FeatureWidget = require("esri/widgets/Feature");
import Legend = require("esri/widgets/Legend");
import { subclass, property } from "esri/core/accessorSupport/decorators";
import { Area, Screenshot, ScreenshotConfig } from "./interfaces/interfaces";

type State = "ready" | "takingScreenshot" | "complete" | "disabled";

@subclass("ScreenshotViewModel")
class ScreenshotViewModel extends Accessor {
  constructor(value?: any) {
    super(value);
  }

  private _area: Area = null;
  private _canvasElement: HTMLCanvasElement = null;
  private _handles: Handles = new Handles();
  private _screenshotPromise: any = null;
  private _highlightedFeature: any = null;
  private _firstMapComponent: HTMLCanvasElement = null;
  private _secondMapComponent: HTMLCanvasElement = null;
  private _thirdMapComponent: HTMLCanvasElement = null;
  private _screenshotConfig: ScreenshotConfig = null;
  private _mapComponentSelectors = [
    ".esri-screenshot__offscreen-legend-container",
    ".esri-screenshot__offscreen-pop-up-container"
  ];

  @property({
    dependsOn: ["view.ready"],
    readOnly: true
  })
  get state(): State {
    const ready = this.get("view.ready");
    return ready
      ? this.previewIsVisible
        ? "ready"
        : this._screenshotPromise
        ? "takingScreenshot"
        : "complete"
      : "disabled";
  }

  @property()
  outputLayout: "row" | "column" = "row";

  @property()
  custom: { label: string; element: HTMLElement } = null;

  @property()
  dragHandler: any = null;

  @property()
  enableLegendOption: boolean = null;

  @property()
  enablePopupOption: boolean = null;

  @property({
    readOnly: true
  })
  featureWidget: FeatureWidget = null;

  @property()
  includeCustomInScreenshot: boolean = null;

  @property()
  includeLegendInScreenshot: boolean = null;

  @property()
  includePopupInScreenshot: boolean = null;

  @property({
    readOnly: true
  })
  legendWidget: Legend = null;

  @property()
  previewTitleInputNode: HTMLInputElement = null;

  @property()
  previewIsVisible: boolean = null;

  @property()
  screenshotModeIsActive: boolean = null;

  @property()
  view: MapView | SceneView = null;

  initialize() {
    this._handles.add([
      this._removeHighlight(),
      this._watchScreenshotMode(),
      this._watchLegendWidgetAndView(),
      this._resetOffScreenPopup(),
      this._checkScreenshotModeFalse()
    ]);
  }

  destroy() {
    this._handles.removeAll();
    this._handles = null;
  }

  async setScreenshotArea(
    event: any,
    maskDiv: HTMLElement,
    screenshotImageElement: HTMLImageElement,
    dragHandler: any,
    downloadBtnNode: HTMLButtonElement
  ): Promise<void> {
    if (event.action !== "end") {
      event.stopPropagation();
      this._setXYValues(event);
      this._setMaskPosition(maskDiv, this._area);
    } else {
      const type = this.get("view.type");
      if (type === "2d") {
        const view = this.view as MapView;
        const { width, height, x, y } = this._area;
        if (width === 0 || height === 0) {
          this._screenshotConfig = {
            area: {
              x,
              y,
              width: 1,
              height: 1
            }
          };
        } else {
          this._screenshotConfig = {
            area: this._area
          };
        }
        this._screenshotPromise = true;
        this.notifyChange("state");
        const viewScreenshot = await view.takeScreenshot(
          this._screenshotConfig
        );

        this._processScreenshot(
          viewScreenshot,
          screenshotImageElement,
          maskDiv,
          downloadBtnNode
        );
        this._screenshotPromise = false;
        this.notifyChange("state");
        if (this.dragHandler) {
          this.dragHandler.remove();
          this.dragHandler = null;
        }
      } else if (type === "3d") {
        const view = this.view as SceneView;
        const { width, height, x, y } = this._area;
        if (width === 0 || height === 0) {
          this._screenshotConfig = {
            area: {
              x,
              y,
              width: 1,
              height: 1
            }
          };
        } else {
          this._screenshotConfig = {
            area: this._area
          };
        }
        this._screenshotPromise = true;
        this.notifyChange("state");
        const viewScreenshot = await view.takeScreenshot(
          this._screenshotConfig
        );
        this._processScreenshot(
          viewScreenshot,
          screenshotImageElement,
          maskDiv,
          downloadBtnNode
        );
        this._screenshotPromise = false;
        this.notifyChange("state");
        if (this.dragHandler) {
          this.dragHandler.remove();
          this.dragHandler = null;
        }
      }
    }
  }

  downloadImage(): void {
    const type = this.get("view.type");
    if (type === "2d") {
      const view = this.view as MapView;
      const map = view.map as WebMap;
      let imageToDownload = null;
      if (this.previewTitleInputNode.value) {
        imageToDownload = this._getImageWithText(
          this._canvasElement,
          this.previewTitleInputNode.value
        );
      } else {
        imageToDownload = this._canvasElement.toDataURL();
      }
      this._downloadImage(`${map.portalItem.title}.png`, imageToDownload);
    } else if (type === "3d") {
      const view = this.view as SceneView;
      const map = view.map as WebScene;
      let imageToDownload = null;
      if (this.previewTitleInputNode.value) {
        imageToDownload = this._getImageWithText(
          this._canvasElement,
          this.previewTitleInputNode.value
        );
      } else {
        imageToDownload = this._canvasElement.toDataURL();
      }
      this._downloadImage(`${map.portalItem.title}.png`, imageToDownload);
    }
  }

  private _getImageWithText(
    screenshotCanvas: HTMLCanvasElement,
    text: string
  ): string {
    const screenshotCanvasContext = screenshotCanvas.getContext("2d");
    const screenshotImageData = screenshotCanvasContext.getImageData(
      0,
      0,
      screenshotCanvas.width,
      screenshotCanvas.height
    );
    const canvas = document.createElement("canvas");
    const context = canvas.getContext("2d");

    canvas.height = screenshotImageData.height + 40;
    canvas.width = screenshotImageData.width + 40;

    context.fillStyle = "#fff";
    context.fillRect(20, 0, screenshotImageData.width, 40);

    context.putImageData(screenshotImageData, 20, 40);

    context.font = "20px Arial";
    context.fillStyle = "#000";
    context.fillText(text, 40, 30);

    return canvas.toDataURL();
  }

  private _onlyTakeScreenshotOfView(
    viewScreenshot: Screenshot,
    viewCanvas: HTMLCanvasElement,
    img: HTMLImageElement,
    screenshotImageElement: HTMLImageElement,
    maskDiv: HTMLElement,
    downloadBtnNode: HTMLButtonElement
  ): void {
    viewCanvas.height = viewScreenshot.data.height;
    viewCanvas.width = viewScreenshot.data.width;
    const context = viewCanvas.getContext("2d") as CanvasRenderingContext2D;
    img.src = viewScreenshot.dataUrl;
    img.onload = () => {
      context.drawImage(img, 0, 0);
      this._showPreview(
        viewCanvas,
        screenshotImageElement,
        maskDiv,
        downloadBtnNode
      );
      this._canvasElement = viewCanvas;
    };
  }

  private async _includeOneMapComponent(
    viewScreenshot: Screenshot,
    viewCanvas: HTMLCanvasElement,
    img: HTMLImageElement,
    screenshotImageElement: HTMLImageElement,
    maskDiv: HTMLElement,
    downloadBtnNode: HTMLButtonElement
  ): Promise<void> {
    const context = viewCanvas.getContext("2d") as CanvasRenderingContext2D;
    const combinedCanvas = document.createElement(
      "canvas"
    ) as HTMLCanvasElement;

    const firstComponent = document.querySelector(
      this._mapComponentSelectors[0]
    ) as HTMLElement;
    const secondMapComponent = document.querySelector(
      this._mapComponentSelectors[1]
    ) as HTMLElement;
    const thirdMapComponent = this.custom?.element;

    const mapComponent = this.includeCustomInScreenshot
      ? thirdMapComponent
      : this.includeLegendInScreenshot
      ? firstComponent
      : secondMapComponent;
    this._screenshotPromise = true;
    this.notifyChange("state");

    const mapComponentCanvas = await html2canvas(mapComponent, {
      removeContainer: true,
      logging: false
    });

    viewCanvas.height = viewScreenshot.data.height;
    viewCanvas.width = viewScreenshot.data.width;
    img.src = viewScreenshot.dataUrl;
    img.onload = () => {
      context.drawImage(img, 0, 0);
      this._generateImageForOneComponent(
        viewCanvas,
        combinedCanvas,
        viewScreenshot,
        mapComponentCanvas
      );
      this._canvasElement = combinedCanvas;
      this._showPreview(
        combinedCanvas,
        screenshotImageElement,
        maskDiv,
        downloadBtnNode
      );
      this._screenshotPromise = false;
      this.notifyChange("state");
    };
  }

  private async _includeTwoMapComponents(
    viewScreenshot: Screenshot,
    viewCanvas: HTMLCanvasElement,
    img: HTMLImageElement,
    screenshotImageElement: HTMLImageElement,
    maskDiv: HTMLElement,
    downloadBtnNode: HTMLButtonElement,
    firstNode: HTMLElement,
    secondNode: HTMLElement
  ): Promise<void> {
    const screenshotKey = "screenshot-key";
    const viewCanvasContext = viewCanvas.getContext(
      "2d"
    ) as CanvasRenderingContext2D;
    const combinedCanvasElements = document.createElement(
      "canvas"
    ) as HTMLCanvasElement;
    this._screenshotPromise = true;
    this.notifyChange("state");

    const html2CanvasConfig = {
      removeContainer: true,
      logging: false
    };

    const firstMapComponent = await html2canvas(firstNode, html2CanvasConfig);

    this._firstMapComponent = firstMapComponent;

    const secondMapComponent = await html2canvas(secondNode, {
      height: secondNode.offsetHeight,
      ...html2CanvasConfig
    });

    this._secondMapComponent = secondMapComponent;
    this._screenshotPromise = null;
    this.notifyChange("state");
    this._handles.remove(screenshotKey);
    this._handles.add(
      this._watchTwoMapComponents(
        viewCanvas,
        viewScreenshot,
        img,
        viewCanvasContext,
        combinedCanvasElements,
        screenshotImageElement,
        maskDiv,
        screenshotKey,
        downloadBtnNode
      ),
      screenshotKey
    );
  }

  private async _includeThreeMapComponents(
    viewScreenshot: Screenshot,
    viewCanvas: HTMLCanvasElement,
    img: HTMLImageElement,
    screenshotImageElement: HTMLImageElement,
    maskDiv: HTMLElement,
    downloadBtnNode: HTMLButtonElement,
    firstNode: HTMLElement,
    secondNode: HTMLElement,
    thirdNode: HTMLElement
  ) {
    const screenshotKey = "screenshot-key";
    const viewCanvasContext = viewCanvas.getContext(
      "2d"
    ) as CanvasRenderingContext2D;
    const combinedCanvasElements = document.createElement(
      "canvas"
    ) as HTMLCanvasElement;

    this._screenshotPromise = true;

    const html2CanvasConfig = {
      removeContainer: true,
      logging: false
    };

    const firstMapComponent = await html2canvas(firstNode, html2CanvasConfig);
    this._firstMapComponent = firstMapComponent;

    const secondMapComponent = await html2canvas(secondNode, {
      height: secondNode.offsetHeight,
      ...html2CanvasConfig
    });
    this._secondMapComponent = secondMapComponent;

    const thirdMapComponent = await html2canvas(thirdNode, {
      height: thirdNode.offsetHeight,
      ...html2CanvasConfig
    });
    this._thirdMapComponent = thirdMapComponent;
    this._screenshotPromise = null;

    this.notifyChange("state");

    this._handles.remove(screenshotKey);
    this._handles.add(
      this._watchThreeMapComponents(
        viewCanvas,
        viewScreenshot,
        img,
        viewCanvasContext,
        combinedCanvasElements,
        screenshotImageElement,
        maskDiv,
        screenshotKey,
        downloadBtnNode
      ),
      screenshotKey
    );
  }

  private _watchTwoMapComponents(
    viewCanvas: HTMLCanvasElement,
    viewScreenshot: Screenshot,
    img: HTMLImageElement,
    viewCanvasContext: CanvasRenderingContext2D,
    combinedCanvasElements: HTMLCanvasElement,
    screenshotImageElement: HTMLImageElement,
    maskDiv: HTMLElement,
    screenshotKey: string,
    downloadBtnNode: HTMLButtonElement
  ) {
    return watchUtils.init(this, "state", () => {
      if (
        this.state === "complete" &&
        this._firstMapComponent &&
        this._secondMapComponent
      ) {
        viewCanvas.height = viewScreenshot.data.height;
        viewCanvas.width = viewScreenshot.data.width;
        img.src = viewScreenshot.dataUrl;
        img.onload = () => {
          viewCanvasContext.drawImage(img, 0, 0);
          this._generateImageForTwoComponents(
            viewCanvas,
            combinedCanvasElements,
            viewScreenshot,
            this._firstMapComponent,
            this._secondMapComponent
          );
          this._canvasElement = combinedCanvasElements;
          this._showPreview(
            combinedCanvasElements,
            screenshotImageElement,
            maskDiv,
            downloadBtnNode
          );
          this._firstMapComponent = null;
          this._secondMapComponent = null;
          this._handles.remove(screenshotKey);
          this.notifyChange("state");
        };
      }
    });
  }

  private _watchThreeMapComponents(
    viewCanvas: HTMLCanvasElement,
    viewScreenshot: Screenshot,
    img: HTMLImageElement,
    viewCanvasContext: CanvasRenderingContext2D,
    combinedCanvasElements: HTMLCanvasElement,
    screenshotImageElement: HTMLImageElement,
    maskDiv: HTMLElement,
    screenshotKey: string,
    downloadBtnNode: HTMLButtonElement
  ) {
    return watchUtils.init(this, "state", () => {
      if (
        this.state === "complete" &&
        this._firstMapComponent &&
        this._secondMapComponent &&
        this._thirdMapComponent
      ) {
        viewCanvas.height = viewScreenshot.data.height;
        viewCanvas.width = viewScreenshot.data.width;
        img.src = viewScreenshot.dataUrl;
        img.onload = () => {
          viewCanvasContext.drawImage(img, 0, 0);
          this._generateImageForThreeComponents(
            viewCanvas,
            combinedCanvasElements,
            viewScreenshot,
            this._firstMapComponent,
            this._secondMapComponent,
            this._thirdMapComponent
          );
          this._canvasElement = combinedCanvasElements;
          this._showPreview(
            combinedCanvasElements,
            screenshotImageElement,
            maskDiv,
            downloadBtnNode
          );
          this._firstMapComponent = null;
          this._secondMapComponent = null;
          this._thirdMapComponent = null;
          this._handles.remove(screenshotKey);
          this.notifyChange("state");
        };
      }
    });
  }

  private _generateImageForOneComponent(
    viewCanvas: HTMLCanvasElement,
    combinedCanvas: HTMLCanvasElement,
    viewScreenshot: Screenshot,
    mapComponent: HTMLCanvasElement
  ): void {
    const viewScreenshotHeight = viewScreenshot.data.height as number;
    const viewLegendCanvasContext = combinedCanvas.getContext(
      "2d"
    ) as CanvasRenderingContext2D;
    const mapComponentHeight = mapComponent.height as number;
    const height =
      this.outputLayout === "row"
        ? Math.max(mapComponentHeight, viewScreenshotHeight)
        : this.outputLayout === "column"
        ? mapComponentHeight + viewScreenshotHeight
        : null;
    const width =
      this.outputLayout === "row"
        ? viewScreenshot.data.width + mapComponent.width
        : this.outputLayout === "column"
        ? Math.max(viewScreenshot.data.width, mapComponent.width)
        : null;
    combinedCanvas.width = width;
    combinedCanvas.height = height;
    viewLegendCanvasContext.fillStyle = "#fff";
    viewLegendCanvasContext.fillRect(
      0,
      0,
      combinedCanvas.width,
      combinedCanvas.height
    );
    if (this.outputLayout === "row") {
      viewLegendCanvasContext.drawImage(mapComponent, 0, 0);
      viewLegendCanvasContext.drawImage(viewCanvas, mapComponent.width, 0);
    } else if (this.outputLayout === "column") {
      viewLegendCanvasContext.drawImage(viewCanvas, 0, 0);
      viewLegendCanvasContext.drawImage(mapComponent, 0, viewScreenshotHeight);
    }
  }

  private _generateImageForTwoComponents(
    viewCanvas: HTMLCanvasElement,
    combinedCanvasElements: HTMLCanvasElement,
    viewScreenshot: Screenshot,
    firstMapComponent: HTMLCanvasElement,
    secondMapComponent: HTMLCanvasElement
  ): void {
    const combinedCanvasContext = combinedCanvasElements.getContext(
      "2d"
    ) as CanvasRenderingContext2D;
    const firstMapComponentHeight = firstMapComponent.height as number;
    const secondMapComponentHeight = secondMapComponent.height as number;
    const viewScreenshotHeight = viewScreenshot.data.height as number;
    if (this.outputLayout === "row") {
      combinedCanvasElements.width =
        viewScreenshot.data.width +
        firstMapComponent.width +
        secondMapComponent.width;
      combinedCanvasElements.height = Math.max(
        viewScreenshotHeight,
        firstMapComponentHeight,
        secondMapComponentHeight
      );
    } else if (this.outputLayout === "column") {
      combinedCanvasElements.width = Math.max(
        viewScreenshot.data.width,
        firstMapComponent.width,
        secondMapComponent.width
      );
      combinedCanvasElements.height =
        viewScreenshot.data.height +
        firstMapComponent.height +
        secondMapComponent.height;
    }

    combinedCanvasContext.fillStyle = "#fff";
    combinedCanvasContext.fillRect(
      0,
      0,
      combinedCanvasElements.width,
      combinedCanvasElements.height
    );
    if (this.outputLayout === "row") {
      combinedCanvasContext.drawImage(firstMapComponent, 0, 0);
      combinedCanvasContext.drawImage(viewCanvas, firstMapComponent.width, 0);
      combinedCanvasContext.drawImage(
        secondMapComponent,
        viewScreenshot.data.width + firstMapComponent.width,
        0
      );
    } else if (this.outputLayout === "column") {
      combinedCanvasContext.drawImage(viewCanvas, 0, 0);
      combinedCanvasContext.drawImage(
        firstMapComponent,
        0,
        viewScreenshotHeight
      );
      combinedCanvasContext.drawImage(
        secondMapComponent,
        0,
        viewScreenshotHeight + firstMapComponentHeight
      );
    }
  }

  private _generateImageForThreeComponents(
    viewCanvas: HTMLCanvasElement,
    combinedCanvasElements: HTMLCanvasElement,
    viewScreenshot: Screenshot,
    firstMapComponent: HTMLCanvasElement,
    secondMapComponent: HTMLCanvasElement,
    thirdMapComponent: HTMLCanvasElement
  ) {
    const combinedCanvasContext = combinedCanvasElements.getContext(
      "2d"
    ) as CanvasRenderingContext2D;
    const firstMapComponentHeight = firstMapComponent.height as number;
    const secondMapComponentHeight = secondMapComponent.height as number;
    const thirdMapComponentHeight = thirdMapComponent.height as number;
    const viewScreenshotHeight = viewScreenshot.data.height as number;
    if (this.outputLayout === "row") {
      combinedCanvasElements.width =
        viewScreenshot.data.width +
        firstMapComponent.width +
        secondMapComponent.width +
        thirdMapComponent.width;
      combinedCanvasElements.height = Math.max(
        viewScreenshotHeight,
        firstMapComponentHeight,
        secondMapComponentHeight,
        thirdMapComponentHeight
      );
    } else if (this.outputLayout === "column") {
      combinedCanvasElements.width = Math.max(
        viewScreenshot.data.width,
        firstMapComponent.width,
        secondMapComponent.width,
        thirdMapComponent.width
      );
      combinedCanvasElements.height =
        viewScreenshot.data.height +
        firstMapComponent.height +
        secondMapComponent.height +
        thirdMapComponent.height;
    }
    combinedCanvasContext.fillStyle = "#fff";
    combinedCanvasContext.fillRect(
      0,
      0,
      combinedCanvasElements.width,
      combinedCanvasElements.height
    );
    if (this.outputLayout === "row") {
      combinedCanvasContext.drawImage(firstMapComponent, 0, 0);
      combinedCanvasContext.drawImage(viewCanvas, firstMapComponent.width, 0);
      combinedCanvasContext.drawImage(
        secondMapComponent,
        viewScreenshot.data.width + firstMapComponent.width,
        0
      );
      combinedCanvasContext.drawImage(
        thirdMapComponent,
        viewScreenshot.data.width +
          firstMapComponent.width +
          secondMapComponent.width,
        0
      );
    } else if (this.outputLayout === "column") {
      combinedCanvasContext.drawImage(viewCanvas, 0, 0);
      combinedCanvasContext.drawImage(
        firstMapComponent,
        0,
        viewScreenshotHeight
      );
      combinedCanvasContext.drawImage(
        secondMapComponent,
        0,
        viewScreenshot.data.height + firstMapComponent.height
      );
      combinedCanvasContext.drawImage(
        thirdMapComponent,
        0,
        viewScreenshot.data.height +
          firstMapComponent.height +
          secondMapComponent.height
      );
    }
  }

  private _showPreview(
    canvasElement: HTMLCanvasElement,
    screenshotImageElement: HTMLImageElement,
    maskDiv: HTMLElement,
    downloadBtnNode: HTMLButtonElement
  ): void {
    screenshotImageElement.width = canvasElement.width;
    screenshotImageElement.src = canvasElement.toDataURL();
    this.view.container.classList.remove("esri-screenshot__cursor");
    this._area = null;
    this._setMaskPosition(maskDiv, null);
    this.previewIsVisible = true;
    if (
      this.enablePopupOption &&
      this.includePopupInScreenshot &&
      this.featureWidget
    ) {
      this.featureWidget.graphic = null;
    }
    window.setTimeout(() => {
      downloadBtnNode.focus();
    }, 750);
    this.notifyChange("state");
  }

  private _downloadImage(filename: any, dataUrl: string): void {
    if (!window.navigator.msSaveOrOpenBlob) {
      const imgURL = document.createElement("a") as HTMLAnchorElement;
      imgURL.setAttribute("href", dataUrl);
      imgURL.setAttribute("download", filename);
      imgURL.style.display = "none";
      document.body.appendChild(imgURL);
      imgURL.click();
      document.body.removeChild(imgURL);
    } else {
      const byteString = atob(dataUrl.split(",")[1]);
      const mimeString = dataUrl.split(",")[0].split(":")[1].split(";")[0];
      const ab = new ArrayBuffer(byteString.length);
      const ia = new Uint8Array(ab);
      for (let i = 0; i < byteString.length; i++) {
        ia[i] = byteString.charCodeAt(i);
      }
      const blob = new Blob([ab], { type: mimeString });
      window.navigator.msSaveOrOpenBlob(blob, filename);
    }
  }

  private _clamp(value: number, from: number, to: number): number {
    return value < from ? from : value > to ? to : value;
  }

  private _setXYValues(event: any): void {
    const xmin = this._clamp(
      Math.min(event.origin.x, event.x),
      0,
      this.view.width
    ) as number;
    const xmax = this._clamp(
      Math.max(event.origin.x, event.x),
      0,
      this.view.width
    ) as number;
    const ymin = this._clamp(
      Math.min(event.origin.y, event.y),
      0,
      this.view.height
    ) as number;
    const ymax = this._clamp(
      Math.max(event.origin.y, event.y),
      0,
      this.view.height
    ) as number;
    this._area = {
      x: xmin,
      y: ymin,
      width: xmax - xmin,
      height: ymax - ymin
    };
    this.notifyChange("state");
  }

  private _processScreenshot(
    viewScreenshot: Screenshot,
    screenshotImageElement: HTMLImageElement,
    maskDiv: HTMLElement,
    downloadBtnNode: HTMLButtonElement
  ): void {
    const viewCanvas = document.createElement("canvas") as HTMLCanvasElement;
    const img = document.createElement("img") as HTMLImageElement;
    const firstComponent = document.querySelector(
      this._mapComponentSelectors[0]
    ) as HTMLElement;
    const secondMapComponent = document.querySelector(
      this._mapComponentSelectors[1]
    ) as HTMLElement;

    if (
      !this.includeLegendInScreenshot &&
      !this.includePopupInScreenshot &&
      !this.includeCustomInScreenshot
    ) {
      this._onlyTakeScreenshotOfView(
        viewScreenshot,
        viewCanvas,
        img,
        screenshotImageElement,
        maskDiv,
        downloadBtnNode
      );
    } else {
      if (
        this.includeLegendInScreenshot &&
        !this.includePopupInScreenshot &&
        !this.includeCustomInScreenshot
      ) {
        if (firstComponent.offsetWidth && firstComponent.offsetHeight) {
          this._includeOneMapComponent(
            viewScreenshot,
            viewCanvas,
            img,
            screenshotImageElement,
            maskDiv,
            downloadBtnNode
          );
        } else {
          this._onlyTakeScreenshotOfView(
            viewScreenshot,
            viewCanvas,
            img,
            screenshotImageElement,
            maskDiv,
            downloadBtnNode
          );
        }
      } else if (
        this.includePopupInScreenshot &&
        !this.includeLegendInScreenshot &&
        !this.includeCustomInScreenshot
      ) {
        if (secondMapComponent.offsetWidth && secondMapComponent.offsetHeight) {
          this._includeOneMapComponent(
            viewScreenshot,
            viewCanvas,
            img,
            screenshotImageElement,
            maskDiv,
            downloadBtnNode
          );
        } else {
          this._onlyTakeScreenshotOfView(
            viewScreenshot,
            viewCanvas,
            img,
            screenshotImageElement,
            maskDiv,
            downloadBtnNode
          );
        }
      } else if (
        !this.includePopupInScreenshot &&
        !this.includeLegendInScreenshot &&
        this.includeCustomInScreenshot
      ) {
        if (
          this.custom?.element?.offsetWidth &&
          this.custom?.element?.offsetHeight
        ) {
          this._includeOneMapComponent(
            viewScreenshot,
            viewCanvas,
            img,
            screenshotImageElement,
            maskDiv,
            downloadBtnNode
          );
        } else {
          this._onlyTakeScreenshotOfView(
            viewScreenshot,
            viewCanvas,
            img,
            screenshotImageElement,
            maskDiv,
            downloadBtnNode
          );
        }
      } else if (
        this.includeLegendInScreenshot &&
        this.includePopupInScreenshot &&
        !this.includeCustomInScreenshot
      ) {
        if (
          firstComponent.offsetWidth &&
          firstComponent.offsetHeight &&
          secondMapComponent.offsetWidth &&
          secondMapComponent.offsetHeight
        ) {
          this._includeTwoMapComponents(
            viewScreenshot,
            viewCanvas,
            img,
            screenshotImageElement,
            maskDiv,
            downloadBtnNode,
            document.querySelector(`${this._mapComponentSelectors[0]}`),
            document.querySelector(`${this._mapComponentSelectors[1]}`)
          );
        } else if (
          !firstComponent.offsetWidth ||
          !firstComponent.offsetHeight ||
          !secondMapComponent.offsetWidth ||
          !secondMapComponent.offsetHeight
        ) {
          this._includeOneMapComponent(
            viewScreenshot,
            viewCanvas,
            img,
            screenshotImageElement,
            maskDiv,
            downloadBtnNode
          );
        } else {
          this._onlyTakeScreenshotOfView(
            viewScreenshot,
            viewCanvas,
            img,
            screenshotImageElement,
            maskDiv,
            downloadBtnNode
          );
        }
      } else if (
        this.includeLegendInScreenshot &&
        this.includeCustomInScreenshot &&
        !this.includePopupInScreenshot
      ) {
        if (
          firstComponent.offsetWidth &&
          firstComponent.offsetHeight &&
          this.custom.element.offsetWidth &&
          this.custom.element.offsetHeight
        ) {
          this._includeTwoMapComponents(
            viewScreenshot,
            viewCanvas,
            img,
            screenshotImageElement,
            maskDiv,
            downloadBtnNode,
            document.querySelector(`${this._mapComponentSelectors[0]}`),
            this.custom.element
          );
        } else if (
          !firstComponent.offsetWidth ||
          !firstComponent.offsetHeight ||
          !secondMapComponent.offsetWidth ||
          !secondMapComponent.offsetHeight
        ) {
          this._includeOneMapComponent(
            viewScreenshot,
            viewCanvas,
            img,
            screenshotImageElement,
            maskDiv,
            downloadBtnNode
          );
        } else {
          this._onlyTakeScreenshotOfView(
            viewScreenshot,
            viewCanvas,
            img,
            screenshotImageElement,
            maskDiv,
            downloadBtnNode
          );
        }
      } else if (
        !this.includeLegendInScreenshot &&
        this.includeCustomInScreenshot &&
        this.includePopupInScreenshot
      ) {
        if (
          secondMapComponent.offsetWidth &&
          secondMapComponent.offsetHeight &&
          this.custom.element.offsetWidth &&
          this.custom.element.offsetHeight
        ) {
          this._includeTwoMapComponents(
            viewScreenshot,
            viewCanvas,
            img,
            screenshotImageElement,
            maskDiv,
            downloadBtnNode,
            document.querySelector(`${this._mapComponentSelectors[1]}`),
            this.custom.element
          );
        } else if (
          !firstComponent.offsetWidth ||
          !firstComponent.offsetHeight ||
          !secondMapComponent.offsetWidth ||
          !secondMapComponent.offsetHeight
        ) {
          this._includeOneMapComponent(
            viewScreenshot,
            viewCanvas,
            img,
            screenshotImageElement,
            maskDiv,
            downloadBtnNode
          );
        } else {
          this._onlyTakeScreenshotOfView(
            viewScreenshot,
            viewCanvas,
            img,
            screenshotImageElement,
            maskDiv,
            downloadBtnNode
          );
        }
      } else if (
        this.includeLegendInScreenshot &&
        this.includePopupInScreenshot &&
        this.includeLegendInScreenshot
      ) {
        this._includeThreeMapComponents(
          viewScreenshot,
          viewCanvas,
          img,
          screenshotImageElement,
          maskDiv,
          downloadBtnNode,
          document.querySelector(`${this._mapComponentSelectors[0]}`),
          document.querySelector(`${this._mapComponentSelectors[1]}`),
          this.custom.element
        );
      }
    }
  }

  private _setMaskPosition(maskDiv: HTMLElement, area?: any): void {
    if (!maskDiv) {
      return;
    }
    const boundClientRect = this.view.container.getBoundingClientRect();
    const calibratedMaskTop = (window.innerHeight - this.view.height) as number;
    if (area) {
      maskDiv.style.top = `${area.y + boundClientRect.top}px`;
      maskDiv.style.left = `${area.x + boundClientRect.left}px`;
      maskDiv.style.bottom = `${area.y + boundClientRect.bottom}px`;
      maskDiv.style.right = `${area.x + boundClientRect.right}px`;
      maskDiv.style.width = `${area.width}px`;
      maskDiv.style.height = `${area.height}px`;
      this.screenshotModeIsActive = true;
    } else {
      maskDiv.style.left = `${0}px`;
      maskDiv.style.top = `${0}px`;
      maskDiv.style.width = `${0}px`;
      maskDiv.style.height = `${0}px`;
      this.screenshotModeIsActive = false;
    }
    this.notifyChange("state");
  }

  private _removeHighlight(): __esri.WatchHandle {
    return watchUtils.watch(this, "view.popup.visible", () => {
      if (!this.view) {
        return;
      }
      if (
        !this.view.popup.visible &&
        this.screenshotModeIsActive &&
        this.enablePopupOption &&
        this.view.popup.selectedFeature
      ) {
        const layerView = this.view.layerViews.find(
          layerView =>
            layerView.layer.id === this.view.popup.selectedFeature.layer.id
        ) as __esri.FeatureLayerView;
        this._highlightedFeature = layerView.highlight(
          this.view.popup.selectedFeature
        );
      }
      const watchHighlight = "watch-highlight";
      this._handles.add(
        watchUtils.whenFalse(this, "screenshotModeIsActive", () => {
          if (!this.screenshotModeIsActive) {
            if (this.featureWidget) {
              this._set("featureWidget", null);
            }
            if (this._highlightedFeature) {
              this._highlightedFeature.remove();
              this._highlightedFeature = null;
            }
          }
          this.notifyChange("state");
          this._handles.remove(watchHighlight);
        }),
        watchHighlight
      );
    });
  }

  private _watchScreenshotMode(): __esri.WatchHandle {
    return watchUtils.watch(this, "screenshotModeIsActive", () => {
      if (!this.view) {
        return;
      }
      if (this.view.popup) {
        this.view.popup.visible = false;
      }
    });
  }

  private _watchLegendWidgetAndView(): __esri.WatchHandle {
    return watchUtils.init(this, ["legendWidget", "view.ready"], () => {
      if (this.view?.ready && !this.legendWidget) {
        this._set(
          "legendWidget",
          new Legend({
            view: this.view
          })
        );
      }
    });
  }

  private _resetOffScreenPopup(): __esri.WatchHandle {
    return watchUtils.whenFalse(
      this,
      "viewModel.screenshotModeIsActive",
      () => {
        if (this.featureWidget) {
          this.featureWidget.graphic = null;
          this._set("featureWidget", null);
          this.notifyChange("state");
        }
      }
    );
  }

  private _checkScreenshotModeFalse(): __esri.WatchHandle {
    return watchUtils.whenFalse(this, "screenshotModeIsActive", () => {
      this.screenshotModeIsActive = false;
      this.view.container.classList.remove("esri-screenshot__cursor");
      if (this.featureWidget && this.featureWidget.graphic) {
        this.featureWidget.graphic = null;
      }
      if (this.dragHandler) {
        this.dragHandler.remove();
        this.dragHandler = null;
      }

      this.notifyChange("state");
    });
  }
}

export = ScreenshotViewModel;
