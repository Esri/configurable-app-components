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
define(["require", "exports", "tslib", "esri/core/Accessor", "./html2canvas/html2canvas", "esri/core/Handles", "esri/core/watchUtils", "esri/widgets/Legend", "esri/core/accessorSupport/decorators"], function (require, exports, tslib_1, Accessor, html2canvas, Handles, watchUtils, Legend, decorators_1) {
    "use strict";
    var ScreenshotViewModel = /** @class */ (function (_super) {
        tslib_1.__extends(ScreenshotViewModel, _super);
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
            _this.outputLayout = "horizontal";
            _this.custom = null;
            _this.dragHandler = null;
            _this.enableLegendOption = null;
            _this.enablePopupOption = null;
            _this.featureWidget = null;
            _this.includeCustomInScreenshot = null;
            _this.includeLegendInScreenshot = null;
            _this.includePopupInScreenshot = null;
            _this.legendWidget = null;
            _this.previewTitleInputNode = null;
            _this.previewIsVisible = null;
            _this.screenshotModeIsActive = null;
            _this.view = null;
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
        ScreenshotViewModel.prototype.setScreenshotArea = function (event, maskDiv, screenshotImageElement, dragHandler) {
            return tslib_1.__awaiter(this, void 0, void 0, function () {
                var type, view, _a, width, height, x, y, viewScreenshot, view, _b, width, height, x, y, viewScreenshot;
                return tslib_1.__generator(this, function (_c) {
                    switch (_c.label) {
                        case 0:
                            if (!(event.action !== "end")) return [3 /*break*/, 1];
                            event.stopPropagation();
                            this._setXYValues(event);
                            this._setMaskPosition(maskDiv, this._area);
                            return [3 /*break*/, 5];
                        case 1:
                            type = this.get("view.type");
                            if (!(type === "2d")) return [3 /*break*/, 3];
                            view = this.view;
                            _a = this._area, width = _a.width, height = _a.height, x = _a.x, y = _a.y;
                            if (width === 0 || height === 0) {
                                this._screenshotConfig = {
                                    area: {
                                        x: x,
                                        y: y,
                                        width: 1,
                                        height: 1
                                    },
                                    ignorePadding: true
                                };
                            }
                            else {
                                this._screenshotConfig = {
                                    area: this._area,
                                    ignorePadding: true
                                };
                            }
                            this._screenshotPromise = true;
                            this.notifyChange("state");
                            return [4 /*yield*/, view.takeScreenshot(this._screenshotConfig)];
                        case 2:
                            viewScreenshot = _c.sent();
                            this._processScreenshot(viewScreenshot, screenshotImageElement, maskDiv);
                            this._screenshotPromise = false;
                            this.notifyChange("state");
                            if (this.dragHandler) {
                                this.dragHandler.remove();
                                this.dragHandler = null;
                            }
                            return [3 /*break*/, 5];
                        case 3:
                            if (!(type === "3d")) return [3 /*break*/, 5];
                            view = this.view;
                            _b = this._area, width = _b.width, height = _b.height, x = _b.x, y = _b.y;
                            if (width === 0 || height === 0) {
                                this._screenshotConfig = {
                                    area: {
                                        x: x,
                                        y: y,
                                        width: 1,
                                        height: 1
                                    },
                                    ignorePadding: true
                                };
                            }
                            else {
                                this._screenshotConfig = {
                                    area: this._area,
                                    ignorePadding: true
                                };
                            }
                            this._screenshotPromise = true;
                            this.notifyChange("state");
                            return [4 /*yield*/, view.takeScreenshot(this._screenshotConfig)];
                        case 4:
                            viewScreenshot = _c.sent();
                            this._processScreenshot(viewScreenshot, screenshotImageElement, maskDiv);
                            this._screenshotPromise = false;
                            this.notifyChange("state");
                            if (this.dragHandler) {
                                this.dragHandler.remove();
                                this.dragHandler = null;
                            }
                            _c.label = 5;
                        case 5: return [2 /*return*/];
                    }
                });
            });
        };
        ScreenshotViewModel.prototype.downloadImage = function () {
            var type = this.get("view.type");
            if (type === "2d") {
                var view = this.view;
                var map = view.map;
                var imageToDownload = null;
                if (this.previewTitleInputNode.value) {
                    imageToDownload = this._getImageWithText(this._canvasElement, this.previewTitleInputNode.value);
                }
                else {
                    imageToDownload = this._canvasElement.toDataURL();
                }
                this._downloadImage(map.portalItem.title + ".png", imageToDownload);
            }
            else if (type === "3d") {
                var view = this.view;
                var map = view.map;
                var imageToDownload = null;
                if (this.previewTitleInputNode.value) {
                    imageToDownload = this._getImageWithText(this._canvasElement, this.previewTitleInputNode.value);
                }
                else {
                    imageToDownload = this._canvasElement.toDataURL();
                }
                this._downloadImage(map.portalItem.title + ".png", imageToDownload);
            }
        };
        ScreenshotViewModel.prototype._getImageWithText = function (screenshotCanvas, text) {
            var screenshotCanvasContext = screenshotCanvas.getContext("2d");
            var screenshotImageData = screenshotCanvasContext.getImageData(0, 0, screenshotCanvas.width, screenshotCanvas.height);
            var canvas = document.createElement("canvas");
            var context = canvas.getContext("2d");
            canvas.height = screenshotImageData.height + 40;
            canvas.width = screenshotImageData.width + 40;
            context.fillStyle = "#fff";
            context.fillRect(20, 0, screenshotImageData.width, 40);
            context.putImageData(screenshotImageData, 20, 40);
            context.font = "20px Arial";
            context.fillStyle = "#000";
            context.fillText(text, 40, 30);
            return canvas.toDataURL();
        };
        ScreenshotViewModel.prototype._onlyTakeScreenshotOfView = function (viewScreenshot, viewCanvas, img, screenshotImageElement, maskDiv) {
            var _this = this;
            viewCanvas.height = viewScreenshot.data.height;
            viewCanvas.width = viewScreenshot.data.width;
            var context = viewCanvas.getContext("2d");
            img.src = viewScreenshot.dataUrl;
            img.onload = function () {
                context.drawImage(img, 0, 0);
                _this._showPreview(viewCanvas, screenshotImageElement, maskDiv);
                _this._canvasElement = viewCanvas;
            };
        };
        ScreenshotViewModel.prototype._includeOneMapComponent = function (viewScreenshot, viewCanvas, img, screenshotImageElement, maskDiv) {
            var _a;
            return tslib_1.__awaiter(this, void 0, void 0, function () {
                var context, combinedCanvas, firstComponent, secondMapComponent, thirdMapComponent, mapComponent, mapComponentCanvas;
                var _this = this;
                return tslib_1.__generator(this, function (_b) {
                    switch (_b.label) {
                        case 0:
                            context = viewCanvas.getContext("2d");
                            combinedCanvas = document.createElement("canvas");
                            firstComponent = document.querySelector(this._mapComponentSelectors[0]);
                            secondMapComponent = document.querySelector(this._mapComponentSelectors[1]);
                            thirdMapComponent = (_a = this.custom) === null || _a === void 0 ? void 0 : _a.element;
                            mapComponent = this.includeCustomInScreenshot
                                ? thirdMapComponent
                                : this.includeLegendInScreenshot
                                    ? firstComponent
                                    : secondMapComponent;
                            this._screenshotPromise = true;
                            this.notifyChange("state");
                            return [4 /*yield*/, html2canvas(mapComponent, {
                                    logging: true
                                })];
                        case 1:
                            mapComponentCanvas = _b.sent();
                            viewCanvas.height = viewScreenshot.data.height;
                            viewCanvas.width = viewScreenshot.data.width;
                            img.src = viewScreenshot.dataUrl;
                            img.onload = function () {
                                context.drawImage(img, 0, 0);
                                _this._generateImageForOneComponent(viewCanvas, combinedCanvas, viewScreenshot, mapComponentCanvas);
                                _this._canvasElement = combinedCanvas;
                                _this._showPreview(combinedCanvas, screenshotImageElement, maskDiv);
                                _this._screenshotPromise = false;
                                _this.notifyChange("state");
                            };
                            return [2 /*return*/];
                    }
                });
            });
        };
        ScreenshotViewModel.prototype._includeTwoMapComponents = function (viewScreenshot, viewCanvas, img, screenshotImageElement, maskDiv, firstNode, secondNode) {
            return tslib_1.__awaiter(this, void 0, void 0, function () {
                var screenshotKey, viewCanvasContext, combinedCanvasElements, html2CanvasConfig, firstMapComponent, secondMapComponent;
                return tslib_1.__generator(this, function (_a) {
                    switch (_a.label) {
                        case 0:
                            screenshotKey = "screenshot-key";
                            viewCanvasContext = viewCanvas.getContext("2d");
                            combinedCanvasElements = document.createElement("canvas");
                            this._screenshotPromise = true;
                            this.notifyChange("state");
                            html2CanvasConfig = {
                                removeContainer: true,
                                logging: false
                            };
                            return [4 /*yield*/, html2canvas(firstNode, html2CanvasConfig)];
                        case 1:
                            firstMapComponent = _a.sent();
                            this._firstMapComponent = firstMapComponent;
                            return [4 /*yield*/, html2canvas(secondNode, tslib_1.__assign({ height: secondNode.offsetHeight }, html2CanvasConfig))];
                        case 2:
                            secondMapComponent = _a.sent();
                            this._secondMapComponent = secondMapComponent;
                            this._screenshotPromise = null;
                            this.notifyChange("state");
                            this._handles.remove(screenshotKey);
                            this._handles.add(this._watchTwoMapComponents(viewCanvas, viewScreenshot, img, viewCanvasContext, combinedCanvasElements, screenshotImageElement, maskDiv, screenshotKey), screenshotKey);
                            return [2 /*return*/];
                    }
                });
            });
        };
        ScreenshotViewModel.prototype._includeThreeMapComponents = function (viewScreenshot, viewCanvas, img, screenshotImageElement, maskDiv, firstNode, secondNode, thirdNode) {
            return tslib_1.__awaiter(this, void 0, void 0, function () {
                var screenshotKey, viewCanvasContext, combinedCanvasElements, html2CanvasConfig, firstMapComponent, secondMapComponent, thirdMapComponent;
                return tslib_1.__generator(this, function (_a) {
                    switch (_a.label) {
                        case 0:
                            screenshotKey = "screenshot-key";
                            viewCanvasContext = viewCanvas.getContext("2d");
                            combinedCanvasElements = document.createElement("canvas");
                            this._screenshotPromise = true;
                            html2CanvasConfig = {
                                removeContainer: true,
                                logging: false
                            };
                            return [4 /*yield*/, html2canvas(firstNode, html2CanvasConfig)];
                        case 1:
                            firstMapComponent = _a.sent();
                            this._firstMapComponent = firstMapComponent;
                            return [4 /*yield*/, html2canvas(secondNode, tslib_1.__assign({ height: secondNode.offsetHeight }, html2CanvasConfig))];
                        case 2:
                            secondMapComponent = _a.sent();
                            this._secondMapComponent = secondMapComponent;
                            return [4 /*yield*/, html2canvas(thirdNode, tslib_1.__assign({ height: thirdNode.offsetHeight }, html2CanvasConfig))];
                        case 3:
                            thirdMapComponent = _a.sent();
                            this._thirdMapComponent = thirdMapComponent;
                            this._screenshotPromise = null;
                            this.notifyChange("state");
                            this._handles.remove(screenshotKey);
                            this._handles.add(this._watchThreeMapComponents(viewCanvas, viewScreenshot, img, viewCanvasContext, combinedCanvasElements, screenshotImageElement, maskDiv, screenshotKey), screenshotKey);
                            return [2 /*return*/];
                    }
                });
            });
        };
        ScreenshotViewModel.prototype._watchTwoMapComponents = function (viewCanvas, viewScreenshot, img, viewCanvasContext, combinedCanvasElements, screenshotImageElement, maskDiv, screenshotKey) {
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
                        _this._showPreview(combinedCanvasElements, screenshotImageElement, maskDiv);
                        _this._firstMapComponent = null;
                        _this._secondMapComponent = null;
                        _this._handles.remove(screenshotKey);
                        _this.notifyChange("state");
                    };
                }
            });
        };
        ScreenshotViewModel.prototype._watchThreeMapComponents = function (viewCanvas, viewScreenshot, img, viewCanvasContext, combinedCanvasElements, screenshotImageElement, maskDiv, screenshotKey) {
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
                        _this._showPreview(combinedCanvasElements, screenshotImageElement, maskDiv);
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
            var height = this.outputLayout === "horizontal"
                ? Math.max(mapComponentHeight, viewScreenshotHeight)
                : this.outputLayout === "vertical"
                    ? mapComponentHeight + viewScreenshotHeight
                    : null;
            var width = this.outputLayout === "horizontal"
                ? viewScreenshot.data.width + mapComponent.width
                : this.outputLayout === "vertical"
                    ? Math.max(viewScreenshot.data.width, mapComponent.width)
                    : null;
            combinedCanvas.width = width;
            combinedCanvas.height = height;
            viewLegendCanvasContext.fillStyle = "#fff";
            viewLegendCanvasContext.fillRect(0, 0, combinedCanvas.width, combinedCanvas.height);
            if (this.outputLayout === "horizontal") {
                viewLegendCanvasContext.drawImage(mapComponent, 0, 0);
                viewLegendCanvasContext.drawImage(viewCanvas, mapComponent.width, 0);
            }
            else if (this.outputLayout === "vertical") {
                viewLegendCanvasContext.drawImage(viewCanvas, 0, 0);
                viewLegendCanvasContext.drawImage(mapComponent, 0, viewScreenshotHeight);
            }
        };
        ScreenshotViewModel.prototype._generateImageForTwoComponents = function (viewCanvas, combinedCanvasElements, viewScreenshot, firstMapComponent, secondMapComponent) {
            var combinedCanvasContext = combinedCanvasElements.getContext("2d");
            var firstMapComponentHeight = firstMapComponent.height;
            var secondMapComponentHeight = secondMapComponent.height;
            var viewScreenshotHeight = viewScreenshot.data.height;
            if (this.outputLayout === "horizontal") {
                combinedCanvasElements.width =
                    viewScreenshot.data.width +
                        firstMapComponent.width +
                        secondMapComponent.width;
                combinedCanvasElements.height = Math.max(viewScreenshotHeight, firstMapComponentHeight, secondMapComponentHeight);
            }
            else if (this.outputLayout === "vertical") {
                combinedCanvasElements.width = Math.max(viewScreenshot.data.width, firstMapComponent.width, secondMapComponent.width);
                combinedCanvasElements.height =
                    viewScreenshot.data.height +
                        firstMapComponent.height +
                        secondMapComponent.height;
            }
            combinedCanvasContext.fillStyle = "#fff";
            combinedCanvasContext.fillRect(0, 0, combinedCanvasElements.width, combinedCanvasElements.height);
            if (this.outputLayout === "horizontal") {
                combinedCanvasContext.drawImage(firstMapComponent, 0, 0);
                combinedCanvasContext.drawImage(viewCanvas, firstMapComponent.width, 0);
                combinedCanvasContext.drawImage(secondMapComponent, viewScreenshot.data.width + firstMapComponent.width, 0);
            }
            else if (this.outputLayout === "vertical") {
                combinedCanvasContext.drawImage(viewCanvas, 0, 0);
                combinedCanvasContext.drawImage(firstMapComponent, 0, viewScreenshotHeight);
                combinedCanvasContext.drawImage(secondMapComponent, 0, viewScreenshotHeight + firstMapComponentHeight);
            }
        };
        ScreenshotViewModel.prototype._generateImageForThreeComponents = function (viewCanvas, combinedCanvasElements, viewScreenshot, firstMapComponent, secondMapComponent, thirdMapComponent) {
            var combinedCanvasContext = combinedCanvasElements.getContext("2d");
            var firstMapComponentHeight = firstMapComponent.height;
            var secondMapComponentHeight = secondMapComponent.height;
            var thirdMapComponentHeight = thirdMapComponent.height;
            var viewScreenshotHeight = viewScreenshot.data.height;
            if (this.outputLayout === "horizontal") {
                combinedCanvasElements.width =
                    viewScreenshot.data.width +
                        firstMapComponent.width +
                        secondMapComponent.width +
                        thirdMapComponent.width;
                combinedCanvasElements.height = Math.max(viewScreenshotHeight, firstMapComponentHeight, secondMapComponentHeight, thirdMapComponentHeight);
            }
            else if (this.outputLayout === "vertical") {
                combinedCanvasElements.width = Math.max(viewScreenshot.data.width, firstMapComponent.width, secondMapComponent.width, thirdMapComponent.width);
                combinedCanvasElements.height =
                    viewScreenshot.data.height +
                        firstMapComponent.height +
                        secondMapComponent.height +
                        thirdMapComponent.height;
            }
            combinedCanvasContext.fillStyle = "#fff";
            combinedCanvasContext.fillRect(0, 0, combinedCanvasElements.width, combinedCanvasElements.height);
            if (this.outputLayout === "horizontal") {
                combinedCanvasContext.drawImage(firstMapComponent, 0, 0);
                combinedCanvasContext.drawImage(viewCanvas, firstMapComponent.width, 0);
                combinedCanvasContext.drawImage(secondMapComponent, viewScreenshot.data.width + firstMapComponent.width, 0);
                combinedCanvasContext.drawImage(thirdMapComponent, viewScreenshot.data.width +
                    firstMapComponent.width +
                    secondMapComponent.width, 0);
            }
            else if (this.outputLayout === "vertical") {
                combinedCanvasContext.drawImage(viewCanvas, 0, 0);
                combinedCanvasContext.drawImage(firstMapComponent, 0, viewScreenshotHeight);
                combinedCanvasContext.drawImage(secondMapComponent, 0, viewScreenshot.data.height + firstMapComponent.height);
                combinedCanvasContext.drawImage(thirdMapComponent, 0, viewScreenshot.data.height +
                    firstMapComponent.height +
                    secondMapComponent.height);
            }
        };
        ScreenshotViewModel.prototype._showPreview = function (canvasElement, screenshotImageElement, maskDiv) {
            screenshotImageElement.width = canvasElement.width;
            screenshotImageElement.src = canvasElement.toDataURL();
            this.view.container.classList.remove("esri-screenshot__cursor");
            this._area = null;
            this._setMaskPosition(maskDiv, null);
            this.previewIsVisible = true;
            this._focusTitleInput();
            if (this.enablePopupOption &&
                this.includePopupInScreenshot &&
                this.featureWidget) {
                this.featureWidget.graphic = null;
            }
            this.notifyChange("state");
        };
        ScreenshotViewModel.prototype._focusTitleInput = function () {
            var _this = this;
            var focusInterval = setInterval(function () {
                _this.previewTitleInputNode.focus();
                if (document.activeElement === _this.previewTitleInputNode) {
                    clearInterval(focusInterval);
                }
            }, 10);
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
        ScreenshotViewModel.prototype._processScreenshot = function (viewScreenshot, screenshotImageElement, maskDiv) {
            var _a, _b, _c, _d;
            var viewCanvas = document.createElement("canvas");
            var img = document.createElement("img");
            var firstComponent = document.querySelector(this._mapComponentSelectors[0]);
            var secondMapComponent = document.querySelector(this._mapComponentSelectors[1]);
            if (!this.includeLegendInScreenshot &&
                !this.includePopupInScreenshot &&
                !this.includeCustomInScreenshot) {
                this._onlyTakeScreenshotOfView(viewScreenshot, viewCanvas, img, screenshotImageElement, maskDiv);
            }
            else {
                if (this.includeLegendInScreenshot &&
                    !this.includePopupInScreenshot &&
                    !this.includeCustomInScreenshot) {
                    if (firstComponent.offsetWidth && firstComponent.offsetHeight) {
                        this._includeOneMapComponent(viewScreenshot, viewCanvas, img, screenshotImageElement, maskDiv);
                    }
                    else {
                        this._onlyTakeScreenshotOfView(viewScreenshot, viewCanvas, img, screenshotImageElement, maskDiv);
                    }
                }
                else if (this.includePopupInScreenshot &&
                    !this.includeLegendInScreenshot &&
                    !this.includeCustomInScreenshot) {
                    if (secondMapComponent.offsetWidth && secondMapComponent.offsetHeight) {
                        this._includeOneMapComponent(viewScreenshot, viewCanvas, img, screenshotImageElement, maskDiv);
                    }
                    else {
                        this._onlyTakeScreenshotOfView(viewScreenshot, viewCanvas, img, screenshotImageElement, maskDiv);
                    }
                }
                else if (!this.includePopupInScreenshot &&
                    !this.includeLegendInScreenshot &&
                    this.includeCustomInScreenshot) {
                    if (((_b = (_a = this.custom) === null || _a === void 0 ? void 0 : _a.element) === null || _b === void 0 ? void 0 : _b.offsetWidth) && ((_d = (_c = this.custom) === null || _c === void 0 ? void 0 : _c.element) === null || _d === void 0 ? void 0 : _d.offsetHeight)) {
                        this._includeOneMapComponent(viewScreenshot, viewCanvas, img, screenshotImageElement, maskDiv);
                    }
                    else {
                        this._onlyTakeScreenshotOfView(viewScreenshot, viewCanvas, img, screenshotImageElement, maskDiv);
                    }
                }
                else if (this.includeLegendInScreenshot &&
                    this.includePopupInScreenshot &&
                    !this.includeCustomInScreenshot) {
                    if (firstComponent.offsetWidth &&
                        firstComponent.offsetHeight &&
                        secondMapComponent.offsetWidth &&
                        secondMapComponent.offsetHeight) {
                        this._includeTwoMapComponents(viewScreenshot, viewCanvas, img, screenshotImageElement, maskDiv, document.querySelector("" + this._mapComponentSelectors[0]), document.querySelector("" + this._mapComponentSelectors[1]));
                    }
                    else if (!firstComponent.offsetWidth ||
                        !firstComponent.offsetHeight ||
                        !secondMapComponent.offsetWidth ||
                        !secondMapComponent.offsetHeight) {
                        this._includeOneMapComponent(viewScreenshot, viewCanvas, img, screenshotImageElement, maskDiv);
                    }
                    else {
                        this._onlyTakeScreenshotOfView(viewScreenshot, viewCanvas, img, screenshotImageElement, maskDiv);
                    }
                }
                else if (this.includeLegendInScreenshot &&
                    this.includeCustomInScreenshot &&
                    !this.includePopupInScreenshot) {
                    if (firstComponent.offsetWidth &&
                        firstComponent.offsetHeight &&
                        this.custom.element.offsetWidth &&
                        this.custom.element.offsetHeight) {
                        this._includeTwoMapComponents(viewScreenshot, viewCanvas, img, screenshotImageElement, maskDiv, document.querySelector("" + this._mapComponentSelectors[0]), this.custom.element);
                    }
                    else if (!firstComponent.offsetWidth ||
                        !firstComponent.offsetHeight ||
                        !secondMapComponent.offsetWidth ||
                        !secondMapComponent.offsetHeight) {
                        this._includeOneMapComponent(viewScreenshot, viewCanvas, img, screenshotImageElement, maskDiv);
                    }
                    else {
                        this._onlyTakeScreenshotOfView(viewScreenshot, viewCanvas, img, screenshotImageElement, maskDiv);
                    }
                }
                else if (!this.includeLegendInScreenshot &&
                    this.includeCustomInScreenshot &&
                    this.includePopupInScreenshot) {
                    if (secondMapComponent.offsetWidth &&
                        secondMapComponent.offsetHeight &&
                        this.custom.element.offsetWidth &&
                        this.custom.element.offsetHeight) {
                        this._includeTwoMapComponents(viewScreenshot, viewCanvas, img, screenshotImageElement, maskDiv, document.querySelector("" + this._mapComponentSelectors[1]), this.custom.element);
                    }
                    else if (!firstComponent.offsetWidth ||
                        !firstComponent.offsetHeight ||
                        !secondMapComponent.offsetWidth ||
                        !secondMapComponent.offsetHeight) {
                        this._includeOneMapComponent(viewScreenshot, viewCanvas, img, screenshotImageElement, maskDiv);
                    }
                    else {
                        this._onlyTakeScreenshotOfView(viewScreenshot, viewCanvas, img, screenshotImageElement, maskDiv);
                    }
                }
                else if (this.includeLegendInScreenshot &&
                    this.includePopupInScreenshot &&
                    this.includeLegendInScreenshot) {
                    this._includeThreeMapComponents(viewScreenshot, viewCanvas, img, screenshotImageElement, maskDiv, document.querySelector("" + this._mapComponentSelectors[0]), document.querySelector("" + this._mapComponentSelectors[1]), this.custom.element);
                }
            }
        };
        ScreenshotViewModel.prototype._setMaskPosition = function (maskDiv, area) {
            if (!maskDiv) {
                return;
            }
            var boundClientRect = this.view.container.getBoundingClientRect();
            if (area) {
                maskDiv.style.top = area.y + boundClientRect.top + "px";
                maskDiv.style.left = area.x + boundClientRect.left + "px";
                maskDiv.style.bottom = area.y + boundClientRect.bottom + "px";
                maskDiv.style.right = area.x + boundClientRect.right + "px";
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
                var _a, _b, _c, _d;
                if (!_this.view) {
                    return;
                }
                if (!((_b = (_a = _this.view) === null || _a === void 0 ? void 0 : _a.popup) === null || _b === void 0 ? void 0 : _b.visible) &&
                    _this.screenshotModeIsActive &&
                    _this.enablePopupOption && ((_d = (_c = _this.view) === null || _c === void 0 ? void 0 : _c.popup) === null || _d === void 0 ? void 0 : _d.selectedFeature)) {
                    var layerView = _this.view.layerViews.find(function (layerView) { var _a, _b, _c, _d; return layerView.layer.id === ((_d = (_c = (_b = (_a = _this.view) === null || _a === void 0 ? void 0 : _a.popup) === null || _b === void 0 ? void 0 : _b.selectedFeature) === null || _c === void 0 ? void 0 : _c.layer) === null || _d === void 0 ? void 0 : _d.id); });
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
                var _a;
                if (!_this.view) {
                    return;
                }
                if ((_a = _this.view) === null || _a === void 0 ? void 0 : _a.popup) {
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
        tslib_1.__decorate([
            decorators_1.property({
                dependsOn: ["view.ready"],
                readOnly: true
            })
        ], ScreenshotViewModel.prototype, "state", null);
        tslib_1.__decorate([
            decorators_1.property()
        ], ScreenshotViewModel.prototype, "outputLayout", void 0);
        tslib_1.__decorate([
            decorators_1.property()
        ], ScreenshotViewModel.prototype, "custom", void 0);
        tslib_1.__decorate([
            decorators_1.property()
        ], ScreenshotViewModel.prototype, "dragHandler", void 0);
        tslib_1.__decorate([
            decorators_1.property()
        ], ScreenshotViewModel.prototype, "enableLegendOption", void 0);
        tslib_1.__decorate([
            decorators_1.property()
        ], ScreenshotViewModel.prototype, "enablePopupOption", void 0);
        tslib_1.__decorate([
            decorators_1.property({
                readOnly: true
            })
        ], ScreenshotViewModel.prototype, "featureWidget", void 0);
        tslib_1.__decorate([
            decorators_1.property()
        ], ScreenshotViewModel.prototype, "includeCustomInScreenshot", void 0);
        tslib_1.__decorate([
            decorators_1.property()
        ], ScreenshotViewModel.prototype, "includeLegendInScreenshot", void 0);
        tslib_1.__decorate([
            decorators_1.property()
        ], ScreenshotViewModel.prototype, "includePopupInScreenshot", void 0);
        tslib_1.__decorate([
            decorators_1.property({
                readOnly: true
            })
        ], ScreenshotViewModel.prototype, "legendWidget", void 0);
        tslib_1.__decorate([
            decorators_1.property()
        ], ScreenshotViewModel.prototype, "previewTitleInputNode", void 0);
        tslib_1.__decorate([
            decorators_1.property()
        ], ScreenshotViewModel.prototype, "previewIsVisible", void 0);
        tslib_1.__decorate([
            decorators_1.property()
        ], ScreenshotViewModel.prototype, "screenshotModeIsActive", void 0);
        tslib_1.__decorate([
            decorators_1.property()
        ], ScreenshotViewModel.prototype, "view", void 0);
        ScreenshotViewModel = tslib_1.__decorate([
            decorators_1.subclass("ScreenshotViewModel")
        ], ScreenshotViewModel);
        return ScreenshotViewModel;
    }(Accessor));
    return ScreenshotViewModel;
});
//# sourceMappingURL=ScreenshotViewModel.js.map