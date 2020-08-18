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
var __extends = (this && this.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
define(["require", "exports", "esri/core/Accessor", "./html2canvas/html2canvas", "esri/core/Handles", "esri/core/watchUtils", "esri/widgets/Legend", "esri/core/accessorSupport/decorators"], function (require, exports, Accessor, html2canvas, Handles, watchUtils, Legend, decorators_1) {
    "use strict";
    var ScreenshotViewModel = /** @class */ (function (_super) {
        __extends(ScreenshotViewModel, _super);
        function ScreenshotViewModel(value) {
            var _this = _super.call(this, value) || this;
            _this._area = null;
            _this._canvasElement = null;
            _this._handles = new Handles();
            _this._screenshotPromise = null;
            _this._highlightedFeature = null;
            _this._firstMapComponent = null;
            _this._secondMapComponent = null;
            _this._thirdMapComponent = null;
            _this._screenshotConfig = null;
            _this._mapComponentSelectors = [
                ".esri-screenshot__offscreen-legend-container",
                ".esri-screenshot__offscreen-pop-up-container"
            ];
            _this.view = null;
            _this.previewIsVisible = null;
            _this.screenshotModeIsActive = null;
            _this.includeLegendInScreenshot = null;
            _this.includePopupInScreenshot = null;
            _this.includeCustomInScreenshot = null;
            _this.enableLegendOption = null;
            _this.enablePopupOption = null;
            _this.dragHandler = null;
            _this.featureWidget = null;
            _this.legendWidget = null;
            _this.custom = null;
            _this.offset = {};
            return _this;
        }
        Object.defineProperty(ScreenshotViewModel.prototype, "state", {
            get: function () {
                var ready = this.get("view.ready");
                return ready
                    ? this.previewIsVisible
                        ? "ready"
                        : this._screenshotPromise
                            ? "takingScreenshot"
                            : "complete"
                    : "disabled";
            },
            enumerable: false,
            configurable: true
        });
        ScreenshotViewModel.prototype.initialize = function () {
            this._handles.add([
                this._removeHighlight(),
                this._watchScreenshotMode(),
                this._watchLegendWidgetAndView(),
                this._resetOffScreenPopup(),
                this._checkScreenshotModeFalse()
            ]);
        };
        ScreenshotViewModel.prototype.destroy = function () {
            this._handles.removeAll();
            this._handles = null;
        };
        ScreenshotViewModel.prototype.setScreenshotArea = function (event, maskDiv, screenshotImageElement, dragHandler, downloadBtnNode) {
            var _this = this;
            if (event.action !== "end") {
                event.stopPropagation();
                this._setXYValues(event);
                this._setMaskPosition(maskDiv, this._area);
            }
            else {
                var type = this.get("view.type");
                if (type === "2d") {
                    var view = this.view;
                    var _a = this._area, width = _a.width, height = _a.height, x = _a.x, y = _a.y;
                    if (width === 0 || height === 0) {
                        this._screenshotConfig = {
                            area: {
                                x: x,
                                y: y,
                                width: 1,
                                height: 1
                            }
                        };
                    }
                    else {
                        this._screenshotConfig = {
                            area: this._area
                        };
                    }
                    this._screenshotPromise = view
                        .takeScreenshot(this._screenshotConfig)
                        .catch(function (err) {
                        console.error("ERROR: ", err);
                    })
                        .then(function (viewScreenshot) {
                        _this._processScreenshot(viewScreenshot, screenshotImageElement, maskDiv, downloadBtnNode);
                        if (_this.dragHandler) {
                            _this.dragHandler.remove();
                            _this.dragHandler = null;
                        }
                    });
                }
                else if (type === "3d") {
                    var view = this.view;
                    var _b = this._area, width = _b.width, height = _b.height, x = _b.x, y = _b.y;
                    if (width === 0 || height === 0) {
                        this._screenshotConfig = {
                            area: {
                                x: x,
                                y: y,
                                width: 1,
                                height: 1
                            }
                        };
                    }
                    else {
                        this._screenshotConfig = {
                            area: this._area
                        };
                    }
                    this._screenshotPromise = view
                        .takeScreenshot(this._screenshotConfig)
                        .catch(function (err) {
                        console.error("ERROR: ", err);
                    })
                        .then(function (viewScreenshot) {
                        _this._processScreenshot(viewScreenshot, screenshotImageElement, maskDiv, downloadBtnNode);
                        _this._screenshotPromise = null;
                        if (_this.dragHandler) {
                            _this.dragHandler.remove();
                            _this.dragHandler = null;
                        }
                        _this.notifyChange("state");
                    });
                }
            }
        };
        ScreenshotViewModel.prototype.downloadImage = function () {
            var type = this.get("view.type");
            if (type === "2d") {
                var view = this.view;
                var map = view.map;
                this._downloadImage(map.portalItem.title + ".png", this._canvasElement.toDataURL());
            }
            else if (type === "3d") {
                var view = this.view;
                var map = view.map;
                this._downloadImage(map.portalItem.title + ".png", this._canvasElement.toDataURL());
            }
        };
        ScreenshotViewModel.prototype._onlyTakeScreenshotOfView = function (viewScreenshot, viewCanvas, img, screenshotImageElement, maskDiv, downloadBtnNode) {
            var _this = this;
            viewCanvas.height = viewScreenshot.data.height;
            viewCanvas.width = viewScreenshot.data.width;
            var context = viewCanvas.getContext("2d");
            img.src = viewScreenshot.dataUrl;
            img.onload = function () {
                context.drawImage(img, 0, 0);
                _this._showPreview(viewCanvas, screenshotImageElement, maskDiv, downloadBtnNode);
                _this._canvasElement = viewCanvas;
            };
        };
        ScreenshotViewModel.prototype._includeOneMapComponent = function (viewScreenshot, viewCanvas, img, screenshotImageElement, maskDiv, downloadBtnNode) {
            var _this = this;
            var _a;
            var context = viewCanvas.getContext("2d");
            var combinedCanvas = document.createElement("canvas");
            var firstComponent = document.querySelector(this._mapComponentSelectors[0]);
            var secondMapComponent = document.querySelector(this._mapComponentSelectors[1]);
            var thirdMapComponent = (_a = this.custom) === null || _a === void 0 ? void 0 : _a.element;
            var mapComponent = this.includeCustomInScreenshot
                ? thirdMapComponent
                : this.includeLegendInScreenshot
                    ? firstComponent
                    : secondMapComponent;
            this._screenshotPromise = html2canvas(mapComponent, {
                removeContainer: true,
                logging: false
            })
                .catch(function (err) {
                console.error("ERROR: ", err);
            })
                .then(function (mapComponent) {
                viewCanvas.height = viewScreenshot.data.height;
                viewCanvas.width = viewScreenshot.data.width;
                img.src = viewScreenshot.dataUrl;
                img.onload = function () {
                    context.drawImage(img, 0, 0);
                    _this._generateImageForOneComponent(viewCanvas, combinedCanvas, viewScreenshot, mapComponent);
                    _this._canvasElement = combinedCanvas;
                    _this._showPreview(combinedCanvas, screenshotImageElement, maskDiv, downloadBtnNode);
                    _this._screenshotPromise = null;
                    _this.notifyChange("state");
                };
            });
        };
        ScreenshotViewModel.prototype._includeTwoMapComponents = function (viewScreenshot, viewCanvas, img, screenshotImageElement, maskDiv, downloadBtnNode, firstNode, secondNode) {
            var _this = this;
            var screenshotKey = "screenshot-key";
            var viewCanvasContext = viewCanvas.getContext("2d");
            var combinedCanvasElements = document.createElement("canvas");
            this._screenshotPromise = html2canvas(firstNode, {
                removeContainer: true,
                logging: false
            })
                .catch(function (err) {
                console.error("ERROR: ", err);
            })
                .then(function (firstMapComponent) {
                _this._firstMapComponent = firstMapComponent;
                _this.notifyChange("state");
                html2canvas(secondNode, {
                    height: secondNode.offsetHeight,
                    removeContainer: true,
                    logging: false
                })
                    .catch(function (err) {
                    console.error("ERROR: ", err);
                })
                    .then(function (secondMapComponent) {
                    _this._secondMapComponent = secondMapComponent;
                    _this._screenshotPromise = null;
                    _this.notifyChange("state");
                });
            });
            this._handles.remove(screenshotKey);
            this._handles.add(this._watchMapComponents(viewCanvas, viewScreenshot, img, viewCanvasContext, combinedCanvasElements, screenshotImageElement, maskDiv, screenshotKey, downloadBtnNode), screenshotKey);
        };
        ScreenshotViewModel.prototype._watchMapComponents = function (viewCanvas, viewScreenshot, img, viewCanvasContext, combinedCanvasElements, screenshotImageElement, maskDiv, screenshotKey, downloadBtnNode) {
            var _this = this;
            return watchUtils.init(this, "state", function () {
                if (_this.state === "complete" &&
                    _this._firstMapComponent &&
                    _this._secondMapComponent) {
                    viewCanvas.height = viewScreenshot.data.height;
                    viewCanvas.width = viewScreenshot.data.width;
                    img.src = viewScreenshot.dataUrl;
                    img.onload = function () {
                        viewCanvasContext.drawImage(img, 0, 0);
                        _this._generateImageForTwoComponents(viewCanvas, combinedCanvasElements, viewScreenshot, _this._firstMapComponent, _this._secondMapComponent);
                        _this._canvasElement = combinedCanvasElements;
                        _this._showPreview(combinedCanvasElements, screenshotImageElement, maskDiv, downloadBtnNode);
                        _this._firstMapComponent = null;
                        _this._secondMapComponent = null;
                        _this._handles.remove(screenshotKey);
                        _this.notifyChange("state");
                    };
                }
            });
        };
        ScreenshotViewModel.prototype._watchThreeMapComponents = function (viewCanvas, viewScreenshot, img, viewCanvasContext, combinedCanvasElements, screenshotImageElement, maskDiv, screenshotKey, downloadBtnNode) {
            var _this = this;
            return watchUtils.init(this, "state", function () {
                if (_this.state === "complete" &&
                    _this._firstMapComponent &&
                    _this._secondMapComponent &&
                    _this._thirdMapComponent) {
                    viewCanvas.height = viewScreenshot.data.height;
                    viewCanvas.width = viewScreenshot.data.width;
                    img.src = viewScreenshot.dataUrl;
                    img.onload = function () {
                        viewCanvasContext.drawImage(img, 0, 0);
                        _this._generateImageForThreeComponents(viewCanvas, combinedCanvasElements, viewScreenshot, _this._firstMapComponent, _this._secondMapComponent, _this._thirdMapComponent);
                        _this._canvasElement = combinedCanvasElements;
                        _this._showPreview(combinedCanvasElements, screenshotImageElement, maskDiv, downloadBtnNode);
                        _this._firstMapComponent = null;
                        _this._secondMapComponent = null;
                        _this._thirdMapComponent = null;
                        _this._handles.remove(screenshotKey);
                        _this.notifyChange("state");
                    };
                }
            });
        };
        ScreenshotViewModel.prototype._generateImageForOneComponent = function (viewCanvas, combinedCanvas, viewScreenshot, mapComponent) {
            var viewScreenshotHeight = viewScreenshot.data.height;
            var viewLegendCanvasContext = combinedCanvas.getContext("2d");
            var mapComponentHeight = mapComponent.height;
            var height = mapComponentHeight > viewScreenshotHeight
                ? mapComponentHeight
                : viewScreenshotHeight;
            combinedCanvas.width = viewScreenshot.data.width + mapComponent.width;
            combinedCanvas.height = height;
            viewLegendCanvasContext.fillStyle = "#fff";
            viewLegendCanvasContext.fillRect(0, 0, combinedCanvas.width, combinedCanvas.height);
            viewLegendCanvasContext.drawImage(mapComponent, 0, 0);
            viewLegendCanvasContext.drawImage(viewCanvas, mapComponent.width, 0);
        };
        ScreenshotViewModel.prototype._generateImageForTwoComponents = function (viewCanvas, combinedCanvasElements, viewScreenshot, firstMapComponent, secondMapComponent) {
            var combinedCanvasContext = combinedCanvasElements.getContext("2d");
            var firstMapComponentHeight = firstMapComponent.height;
            var secondMapComponentHeight = secondMapComponent.height;
            var viewScreenshotHeight = viewScreenshot.data.height;
            combinedCanvasElements.width =
                viewScreenshot.data.width +
                    firstMapComponent.width +
                    secondMapComponent.width;
            combinedCanvasElements.height = this._setupCombinedScreenshotHeight(viewScreenshotHeight, firstMapComponentHeight, secondMapComponentHeight);
            combinedCanvasContext.fillStyle = "#fff";
            combinedCanvasContext.fillRect(0, 0, combinedCanvasElements.width, combinedCanvasElements.height);
            combinedCanvasContext.drawImage(firstMapComponent, 0, 0);
            combinedCanvasContext.drawImage(viewCanvas, firstMapComponent.width, 0);
            combinedCanvasContext.drawImage(secondMapComponent, viewScreenshot.data.width + firstMapComponent.width, 0);
        };
        ScreenshotViewModel.prototype._setupCombinedScreenshotHeight = function (viewScreenshotHeight, legendCanvasHeight, popUpCanvasHeight) {
            return viewScreenshotHeight > legendCanvasHeight &&
                viewScreenshotHeight > popUpCanvasHeight
                ? viewScreenshotHeight
                : legendCanvasHeight > viewScreenshotHeight &&
                    legendCanvasHeight > popUpCanvasHeight
                    ? legendCanvasHeight
                    : popUpCanvasHeight > legendCanvasHeight &&
                        popUpCanvasHeight > viewScreenshotHeight
                        ? popUpCanvasHeight
                        : null;
        };
        ScreenshotViewModel.prototype._setupCombinedScreenshotHeightForThree = function (viewScreenshotHeight, legendCanvasHeight, popUpCanvasHeight, customCanvasHeight) {
            return viewScreenshotHeight > legendCanvasHeight &&
                viewScreenshotHeight > popUpCanvasHeight &&
                viewScreenshotHeight > customCanvasHeight
                ? viewScreenshotHeight
                : legendCanvasHeight > viewScreenshotHeight &&
                    legendCanvasHeight > popUpCanvasHeight &&
                    legendCanvasHeight > customCanvasHeight
                    ? legendCanvasHeight
                    : popUpCanvasHeight > viewScreenshotHeight &&
                        popUpCanvasHeight > legendCanvasHeight &&
                        popUpCanvasHeight > customCanvasHeight
                        ? popUpCanvasHeight
                        : customCanvasHeight > viewScreenshotHeight &&
                            customCanvasHeight > legendCanvasHeight &&
                            customCanvasHeight > popUpCanvasHeight
                            ? customCanvasHeight
                            : null;
        };
        ScreenshotViewModel.prototype._generateImageForThreeComponents = function (viewCanvas, combinedCanvasElements, viewScreenshot, firstMapComponent, secondMapComponent, thirdMapComponent) {
            var combinedCanvasContext = combinedCanvasElements.getContext("2d");
            var firstMapComponentHeight = firstMapComponent.height;
            var secondMapComponentHeight = secondMapComponent.height;
            var thirdMapComponentHeight = thirdMapComponent.height;
            var viewScreenshotHeight = viewScreenshot.data.height;
            combinedCanvasElements.width =
                viewScreenshot.data.width +
                    firstMapComponent.width +
                    secondMapComponent.width +
                    thirdMapComponent.width;
            combinedCanvasElements.height = this._setupCombinedScreenshotHeightForThree(viewScreenshotHeight, firstMapComponentHeight, secondMapComponentHeight, thirdMapComponentHeight);
            combinedCanvasContext.fillStyle = "#fff";
            combinedCanvasContext.fillRect(0, 0, combinedCanvasElements.width, combinedCanvasElements.height);
            combinedCanvasContext.drawImage(firstMapComponent, 0, 0);
            combinedCanvasContext.drawImage(viewCanvas, firstMapComponent.width, 0);
            combinedCanvasContext.drawImage(secondMapComponent, viewScreenshot.data.width + firstMapComponent.width, 0);
            combinedCanvasContext.drawImage(thirdMapComponent, viewScreenshot.data.width +
                firstMapComponent.width +
                secondMapComponent.width, 0);
        };
        ScreenshotViewModel.prototype._showPreview = function (canvasElement, screenshotImageElement, maskDiv, downloadBtnNode) {
            screenshotImageElement.width = canvasElement.width;
            screenshotImageElement.src = canvasElement.toDataURL();
            this.view.container.classList.remove("esri-screenshot__cursor");
            this._area = null;
            this._setMaskPosition(maskDiv, null);
            this.previewIsVisible = true;
            if (this.enablePopupOption &&
                this.includePopupInScreenshot &&
                this.featureWidget) {
                this.featureWidget.graphic = null;
            }
            window.setTimeout(function () {
                downloadBtnNode.focus();
            }, 750);
            this.notifyChange("state");
        };
        ScreenshotViewModel.prototype._downloadImage = function (filename, dataUrl) {
            if (!window.navigator.msSaveOrOpenBlob) {
                var imgURL = document.createElement("a");
                imgURL.setAttribute("href", dataUrl);
                imgURL.setAttribute("download", filename);
                imgURL.style.display = "none";
                document.body.appendChild(imgURL);
                imgURL.click();
                document.body.removeChild(imgURL);
            }
            else {
                var byteString = atob(dataUrl.split(",")[1]);
                var mimeString = dataUrl.split(",")[0].split(":")[1].split(";")[0];
                var ab = new ArrayBuffer(byteString.length);
                var ia = new Uint8Array(ab);
                for (var i = 0; i < byteString.length; i++) {
                    ia[i] = byteString.charCodeAt(i);
                }
                var blob = new Blob([ab], { type: mimeString });
                window.navigator.msSaveOrOpenBlob(blob, filename);
            }
        };
        ScreenshotViewModel.prototype._clamp = function (value, from, to) {
            return value < from ? from : value > to ? to : value;
        };
        ScreenshotViewModel.prototype._setXYValues = function (event) {
            var xmin = this._clamp(Math.min(event.origin.x, event.x), 0, this.view.width);
            var xmax = this._clamp(Math.max(event.origin.x, event.x), 0, this.view.width);
            var ymin = this._clamp(Math.min(event.origin.y, event.y), 0, this.view.height);
            var ymax = this._clamp(Math.max(event.origin.y, event.y), 0, this.view.height);
            this._area = {
                x: xmin,
                y: ymin,
                width: xmax - xmin,
                height: ymax - ymin
            };
            this.notifyChange("state");
        };
        ScreenshotViewModel.prototype._processScreenshot = function (viewScreenshot, screenshotImageElement, maskDiv, downloadBtnNode) {
            var _a, _b, _c, _d;
            var viewCanvas = document.createElement("canvas");
            var img = document.createElement("img");
            var firstComponent = document.querySelector(this._mapComponentSelectors[0]);
            console.log(firstComponent);
            var secondMapComponent = document.querySelector(this._mapComponentSelectors[1]);
            if (!this.includeLegendInScreenshot &&
                !this.includePopupInScreenshot &&
                !this.includeCustomInScreenshot) {
                this._onlyTakeScreenshotOfView(viewScreenshot, viewCanvas, img, screenshotImageElement, maskDiv, downloadBtnNode);
            }
            else {
                if (this.includeLegendInScreenshot &&
                    !this.includePopupInScreenshot &&
                    !this.includeCustomInScreenshot) {
                    if (firstComponent.offsetWidth && firstComponent.offsetHeight) {
                        this._includeOneMapComponent(viewScreenshot, viewCanvas, img, screenshotImageElement, maskDiv, downloadBtnNode);
                    }
                    else {
                        this._onlyTakeScreenshotOfView(viewScreenshot, viewCanvas, img, screenshotImageElement, maskDiv, downloadBtnNode);
                    }
                }
                else if (this.includePopupInScreenshot &&
                    !this.includeLegendInScreenshot &&
                    !this.includeCustomInScreenshot) {
                    if (secondMapComponent.offsetWidth && secondMapComponent.offsetHeight) {
                        this._includeOneMapComponent(viewScreenshot, viewCanvas, img, screenshotImageElement, maskDiv, downloadBtnNode);
                    }
                    else {
                        this._onlyTakeScreenshotOfView(viewScreenshot, viewCanvas, img, screenshotImageElement, maskDiv, downloadBtnNode);
                    }
                }
                else if (!this.includePopupInScreenshot &&
                    !this.includeLegendInScreenshot &&
                    this.includeCustomInScreenshot) {
                    if (((_b = (_a = this.custom) === null || _a === void 0 ? void 0 : _a.element) === null || _b === void 0 ? void 0 : _b.offsetWidth) && ((_d = (_c = this.custom) === null || _c === void 0 ? void 0 : _c.element) === null || _d === void 0 ? void 0 : _d.offsetHeight)) {
                        this._includeOneMapComponent(viewScreenshot, viewCanvas, img, screenshotImageElement, maskDiv, downloadBtnNode);
                    }
                    else {
                        this._onlyTakeScreenshotOfView(viewScreenshot, viewCanvas, img, screenshotImageElement, maskDiv, downloadBtnNode);
                    }
                }
                else if (this.includeLegendInScreenshot &&
                    this.includePopupInScreenshot &&
                    !this.includeCustomInScreenshot) {
                    if (firstComponent.offsetWidth &&
                        firstComponent.offsetHeight &&
                        secondMapComponent.offsetWidth &&
                        secondMapComponent.offsetHeight) {
                        this._includeTwoMapComponents(viewScreenshot, viewCanvas, img, screenshotImageElement, maskDiv, downloadBtnNode, document.querySelector("" + this._mapComponentSelectors[0]), document.querySelector("" + this._mapComponentSelectors[1]));
                    }
                    else if (!firstComponent.offsetWidth ||
                        !firstComponent.offsetHeight ||
                        !secondMapComponent.offsetWidth ||
                        !secondMapComponent.offsetHeight) {
                        this._includeOneMapComponent(viewScreenshot, viewCanvas, img, screenshotImageElement, maskDiv, downloadBtnNode);
                    }
                    else {
                        this._onlyTakeScreenshotOfView(viewScreenshot, viewCanvas, img, screenshotImageElement, maskDiv, downloadBtnNode);
                    }
                }
                else if (this.includeLegendInScreenshot &&
                    this.includeCustomInScreenshot &&
                    !this.includePopupInScreenshot) {
                    if (firstComponent.offsetWidth &&
                        firstComponent.offsetHeight &&
                        this.custom.element.offsetWidth &&
                        this.custom.element.offsetHeight) {
                        this._includeTwoMapComponents(viewScreenshot, viewCanvas, img, screenshotImageElement, maskDiv, downloadBtnNode, document.querySelector("" + this._mapComponentSelectors[0]), this.custom.element);
                    }
                    else if (!firstComponent.offsetWidth ||
                        !firstComponent.offsetHeight ||
                        !secondMapComponent.offsetWidth ||
                        !secondMapComponent.offsetHeight) {
                        this._includeOneMapComponent(viewScreenshot, viewCanvas, img, screenshotImageElement, maskDiv, downloadBtnNode);
                    }
                    else {
                        this._onlyTakeScreenshotOfView(viewScreenshot, viewCanvas, img, screenshotImageElement, maskDiv, downloadBtnNode);
                    }
                }
                else if (!this.includeLegendInScreenshot &&
                    this.includeCustomInScreenshot &&
                    this.includePopupInScreenshot) {
                    if (secondMapComponent.offsetWidth &&
                        secondMapComponent.offsetHeight &&
                        this.custom.element.offsetWidth &&
                        this.custom.element.offsetHeight) {
                        this._includeTwoMapComponents(viewScreenshot, viewCanvas, img, screenshotImageElement, maskDiv, downloadBtnNode, document.querySelector("" + this._mapComponentSelectors[1]), this.custom.element);
                    }
                    else if (!firstComponent.offsetWidth ||
                        !firstComponent.offsetHeight ||
                        !secondMapComponent.offsetWidth ||
                        !secondMapComponent.offsetHeight) {
                        this._includeOneMapComponent(viewScreenshot, viewCanvas, img, screenshotImageElement, maskDiv, downloadBtnNode);
                    }
                    else {
                        this._onlyTakeScreenshotOfView(viewScreenshot, viewCanvas, img, screenshotImageElement, maskDiv, downloadBtnNode);
                    }
                }
                else if (this.includeLegendInScreenshot &&
                    this.includePopupInScreenshot &&
                    this.includeLegendInScreenshot) {
                    this._includeThreeMapComponents(viewScreenshot, viewCanvas, img, screenshotImageElement, maskDiv, downloadBtnNode, document.querySelector("" + this._mapComponentSelectors[0]), document.querySelector("" + this._mapComponentSelectors[1]), this.custom.element);
                }
            }
        };
        ScreenshotViewModel.prototype._includeThreeMapComponents = function (viewScreenshot, viewCanvas, img, screenshotImageElement, maskDiv, downloadBtnNode, firstNode, secondNode, thirdNode) {
            return __awaiter(this, void 0, void 0, function () {
                var screenshotKey, viewCanvasContext, combinedCanvasElements, firstMapComponent, secondMapComponent, thirdMapComponent;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0:
                            screenshotKey = "screenshot-key";
                            viewCanvasContext = viewCanvas.getContext("2d");
                            combinedCanvasElements = document.createElement("canvas");
                            this._screenshotPromise = true;
                            return [4 /*yield*/, html2canvas(firstNode, {
                                    removeContainer: true,
                                    logging: false
                                })];
                        case 1:
                            firstMapComponent = _a.sent();
                            this._firstMapComponent = firstMapComponent;
                            return [4 /*yield*/, html2canvas(secondNode, {
                                    height: secondNode.offsetHeight,
                                    removeContainer: true,
                                    logging: false
                                })];
                        case 2:
                            secondMapComponent = _a.sent();
                            this._secondMapComponent = secondMapComponent;
                            return [4 /*yield*/, html2canvas(thirdNode, {
                                    height: thirdNode.offsetHeight,
                                    removeContainer: true,
                                    logging: false
                                })];
                        case 3:
                            thirdMapComponent = _a.sent();
                            this._thirdMapComponent = thirdMapComponent;
                            this._screenshotPromise = null;
                            this.notifyChange("state");
                            this._handles.remove(screenshotKey);
                            this._handles.add(this._watchThreeMapComponents(viewCanvas, viewScreenshot, img, viewCanvasContext, combinedCanvasElements, screenshotImageElement, maskDiv, screenshotKey, downloadBtnNode), screenshotKey);
                            return [2 /*return*/];
                    }
                });
            });
        };
        ScreenshotViewModel.prototype._setMaskPosition = function (maskDiv, area) {
            if (!maskDiv) {
                return;
            }
            var calibratedMaskTop = (window.innerHeight - this.view.height);
            if (area) {
                var parsedLeft = this.offset.hasOwnProperty("left")
                    ? parseFloat(this.offset.left)
                    : null;
                var left = !isNaN(parsedLeft) && parsedLeft !== null
                    ? area.x + this.offset.left
                    : area.x;
                var parsedTop = this.offset.hasOwnProperty("top")
                    ? parseFloat(this.offset.top)
                    : null;
                var top_1 = !isNaN(parsedTop) && parsedTop !== null
                    ? area.y + calibratedMaskTop + this.offset.top
                    : area.y + calibratedMaskTop;
                maskDiv.style.left = left + "px";
                maskDiv.style.top = top_1 + "px";
                maskDiv.style.width = area.width + "px";
                maskDiv.style.height = area.height + "px";
                this.screenshotModeIsActive = true;
            }
            else {
                maskDiv.style.left = 0 + "px";
                maskDiv.style.top = 0 + "px";
                maskDiv.style.width = 0 + "px";
                maskDiv.style.height = 0 + "px";
                this.screenshotModeIsActive = false;
            }
            this.notifyChange("state");
        };
        ScreenshotViewModel.prototype._removeHighlight = function () {
            var _this = this;
            return watchUtils.watch(this, "view.popup.visible", function () {
                if (!_this.view) {
                    return;
                }
                if (!_this.view.popup.visible &&
                    _this.screenshotModeIsActive &&
                    _this.enablePopupOption &&
                    _this.view.popup.selectedFeature) {
                    var layerView = _this.view.layerViews.find(function (layerView) {
                        return layerView.layer.id === _this.view.popup.selectedFeature.layer.id;
                    });
                    _this._highlightedFeature = layerView.highlight(_this.view.popup.selectedFeature);
                }
                var watchHighlight = "watch-highlight";
                _this._handles.add(watchUtils.whenFalse(_this, "screenshotModeIsActive", function () {
                    if (!_this.screenshotModeIsActive) {
                        if (_this.featureWidget) {
                            _this._set("featureWidget", null);
                        }
                        if (_this._highlightedFeature) {
                            _this._highlightedFeature.remove();
                            _this._highlightedFeature = null;
                        }
                    }
                    _this.notifyChange("state");
                    _this._handles.remove(watchHighlight);
                }), watchHighlight);
            });
        };
        ScreenshotViewModel.prototype._watchScreenshotMode = function () {
            var _this = this;
            return watchUtils.watch(this, "screenshotModeIsActive", function () {
                if (!_this.view) {
                    return;
                }
                if (_this.view.popup) {
                    _this.view.popup.visible = false;
                }
            });
        };
        ScreenshotViewModel.prototype._watchLegendWidgetAndView = function () {
            var _this = this;
            return watchUtils.init(this, ["legendWidget", "view.ready"], function () {
                var _a;
                if (((_a = _this.view) === null || _a === void 0 ? void 0 : _a.ready) && !_this.legendWidget) {
                    _this._set("legendWidget", new Legend({
                        view: _this.view
                    }));
                }
            });
        };
        ScreenshotViewModel.prototype._resetOffScreenPopup = function () {
            var _this = this;
            return watchUtils.whenFalse(this, "viewModel.screenshotModeIsActive", function () {
                if (_this.featureWidget) {
                    _this.featureWidget.graphic = null;
                    _this._set("featureWidget", null);
                    _this.notifyChange("state");
                }
            });
        };
        ScreenshotViewModel.prototype._checkScreenshotModeFalse = function () {
            var _this = this;
            return watchUtils.whenFalse(this, "screenshotModeIsActive", function () {
                _this.screenshotModeIsActive = false;
                _this.view.container.classList.remove("esri-screenshot__cursor");
                if (_this.featureWidget && _this.featureWidget.graphic) {
                    _this.featureWidget.graphic = null;
                }
                if (_this.dragHandler) {
                    _this.dragHandler.remove();
                    _this.dragHandler = null;
                }
                _this.notifyChange("state");
            });
        };
        __decorate([
            decorators_1.property({
                dependsOn: ["view.ready"],
                readOnly: true
            })
        ], ScreenshotViewModel.prototype, "state", null);
        __decorate([
            decorators_1.property()
        ], ScreenshotViewModel.prototype, "view", void 0);
        __decorate([
            decorators_1.property()
        ], ScreenshotViewModel.prototype, "previewIsVisible", void 0);
        __decorate([
            decorators_1.property()
        ], ScreenshotViewModel.prototype, "screenshotModeIsActive", void 0);
        __decorate([
            decorators_1.property()
        ], ScreenshotViewModel.prototype, "includeLegendInScreenshot", void 0);
        __decorate([
            decorators_1.property()
        ], ScreenshotViewModel.prototype, "includePopupInScreenshot", void 0);
        __decorate([
            decorators_1.property()
        ], ScreenshotViewModel.prototype, "includeCustomInScreenshot", void 0);
        __decorate([
            decorators_1.property()
        ], ScreenshotViewModel.prototype, "enableLegendOption", void 0);
        __decorate([
            decorators_1.property()
        ], ScreenshotViewModel.prototype, "enablePopupOption", void 0);
        __decorate([
            decorators_1.property()
        ], ScreenshotViewModel.prototype, "dragHandler", void 0);
        __decorate([
            decorators_1.property({
                readOnly: true
            })
        ], ScreenshotViewModel.prototype, "featureWidget", void 0);
        __decorate([
            decorators_1.property({
                readOnly: true
            })
        ], ScreenshotViewModel.prototype, "legendWidget", void 0);
        __decorate([
            decorators_1.property()
        ], ScreenshotViewModel.prototype, "custom", void 0);
        __decorate([
            decorators_1.property()
        ], ScreenshotViewModel.prototype, "offset", void 0);
        ScreenshotViewModel = __decorate([
            decorators_1.subclass("ScreenshotViewModel")
        ], ScreenshotViewModel);
        return ScreenshotViewModel;
    }(Accessor));
    return ScreenshotViewModel;
});
//# sourceMappingURL=ScreenshotViewModel.js.map