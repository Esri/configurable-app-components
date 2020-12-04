"use strict";
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
var i18n = require("dojo/i18n!./Screenshot/nls/resources");
var Widget = require("esri/widgets/Widget");
var decorators_1 = require("esri/core/accessorSupport/decorators");
var watchUtils = require("esri/core/watchUtils");
var Handles = require("esri/core/Handles");
var widget_1 = require("esri/widgets/support/widget");
var ScreenshotViewModel = require("./Screenshot/ScreenshotViewModel");
var FeatureWidget = require("esri/widgets/Feature");
var CSS = {
    base: "esri-screenshot",
    widget: "esri-widget esri-widget--panel",
    screenshotBtn: "esri-screenshot__btn",
    mainContainer: "esri-screenshot__main-container",
    panelTitle: "esri-screenshot__panel-title",
    panelSubTitle: "esri-screenshot__panel-subtitle",
    screenshotOption: "esri-screenshot__screenshot-option",
    buttonContainer: "esri-screenshot__screenshot-button-container",
    hide: "esri-screenshot--hide",
    screenshotCursor: "esri-screenshot__cursor",
    maskDiv: "esri-screenshot__mask-div",
    actionBtn: "esri-screenshot__action-btn",
    screenshotImg: "esri-screenshot__js-screenshot-image",
    screenshotDiv: "esri-screenshot__screenshot-div",
    screenshotImgContainer: "esri-screenshot__screenshot-img-container",
    downloadBtn: "esri-screenshot__download-btn",
    backBtn: "esri-screenshot__back-btn",
    showOverlay: "esri-screenshot--show-overlay",
    hideOverlay: "esri-screenshot--hide-overlay",
    pointerCursor: "esri-screenshot--pointer",
    disabledCursor: "esri-screenshot--disabled",
    featureWarning: "esri-screenshot__feature-warning",
    featureWarningTextContainer: "esri-screenshot__feature-warning-text-container",
    warningSVG: "esri-screenshot__warning-svg",
    selectFeatureText: "esri-screenshot__select-feature-text",
    screenshotfieldSetCheckbox: "esri-screenshot__field-set-checkbox",
    offScreenPopupContainer: "esri-screenshot__offscreen-pop-up-container",
    offScreenLegendContainer: "esri-screenshot__offscreen-legend-container",
    screenshotClose: "esri-screenshot__close-button",
    closeButtonContainer: "esri-screenshot__close-button-container",
    screenshotPreviewContainer: "esri-screenshot__img-preview-container",
    selectLayout: "esri-screenshot__select-layout"
};
var Screenshot = /** @class */ (function (_super) {
    __extends(Screenshot, _super);
    function Screenshot(value) {
        var _this = _super.call(this, value) || this;
        _this._maskNode = null;
        _this._screenshotImgNode = null;
        _this._activeScreenshotBtnNode = null;
        _this._selectFeatureAlertIsVisible = null;
        _this._offscreenPopupContainer = null;
        _this._offscreenLegendContainer = null;
        _this._handles = new Handles();
        _this._elementOptions = {};
        _this.custom = null;
        _this.enableLegendOption = null;
        _this.enablePopupOption = null;
        _this.featureWidget = null;
        _this.iconClass = "esri-icon-media";
        _this.includeCustomInScreenshot = null;
        _this.includeLegendInScreenshot = null;
        _this.includeLayoutOption = false;
        _this.includePopupInScreenshot = null;
        _this.label = i18n.widgetLabel;
        _this.legendWidget = null;
        _this.screenshotModeIsActive = null;
        _this.theme = "light";
        _this.view = null;
        _this.outputLayout = null;
        _this.previewTitleInputNode = null;
        _this.viewModel = new ScreenshotViewModel();
        return _this;
    }
    Screenshot.prototype.postInitialize = function () {
        var _this = this;
        this.own([
            this._togglePopupAlert(),
            this._generateOffScreenPopup(),
            this._watchSelectedFeature(),
            watchUtils.when(this, "legendWidget", function () {
                _this.scheduleRender();
            }),
            watchUtils.when(this, ["enableLegendOption", "enablePopupOption", "custom"], function () {
                if (_this.enableLegendOption) {
                    _this._elementOptions.legend = _this.includeLegendInScreenshot;
                }
                if (_this.enablePopupOption) {
                    _this._elementOptions.popup = _this.includePopupInScreenshot;
                }
                if (_this.custom) {
                    _this._elementOptions.custom = _this.includeCustomInScreenshot;
                }
            })
        ]);
        var offScreenPopupContainer = document.createElement("div");
        var offScreenLegendContainer = document.createElement("div");
        offScreenPopupContainer.classList.add(CSS.offScreenPopupContainer);
        offScreenLegendContainer.classList.add(CSS.offScreenLegendContainer);
        document.body.appendChild(offScreenPopupContainer);
        document.body.appendChild(offScreenLegendContainer);
        this._offscreenPopupContainer = offScreenPopupContainer;
        this._offscreenLegendContainer = offScreenLegendContainer;
    };
    Screenshot.prototype.render = function () {
        var screenshotModeIsActive = this.viewModel.screenshotModeIsActive;
        var screenshotPanel = this._renderScreenshotPanel();
        var screenshotPreviewOverlay = this._renderScreenshotPreviewOverlay();
        var maskNode = this._renderMaskNode(screenshotModeIsActive);
        var optOutOfScreenshotButton = this._renderOptOutOfScreenshotButton();
        if (this.legendWidget && !this.legendWidget.container) {
            this.legendWidget.container = this._offscreenLegendContainer;
        }
        return (<div>
        {screenshotModeIsActive ? (<div key="screenshot-container" class={CSS.closeButtonContainer}>
            {optOutOfScreenshotButton}
          </div>) : (screenshotPanel)}
        {screenshotPreviewOverlay}
        {maskNode}
      </div>);
    };
    Screenshot.prototype.destroy = function () {
        this._handles.removeAll();
        this._handles.destroy();
        this._handles = null;
        this._maskNode = null;
        this._screenshotImgNode = null;
    };
    Screenshot.prototype.activateScreenshot = function () {
        var _this = this;
        if (this.viewModel.screenshotModeIsActive) {
            return;
        }
        this.viewModel.screenshotModeIsActive = true;
        this.view.container.classList.add(CSS.screenshotCursor);
        this.viewModel.dragHandler = this.view.on("drag", function (event) {
            _this.viewModel.setScreenshotArea(event, _this._maskNode, _this._screenshotImgNode, _this.viewModel.dragHandler);
        });
        this.scheduleRender();
    };
    Screenshot.prototype._downloadImage = function () {
        this.viewModel.downloadImage();
    };
    Screenshot.prototype._renderScreenshotPanel = function () {
        var screenshotTitle = i18n.screenshotTitle, screenshotSubtitle = i18n.screenshotSubtitle;
        var fieldSet = this._renderFieldSet();
        var setMapAreaButton = this._renderSetMapAreaButton();
        var featureWarning = this._renderFeatureWarning();
        var screenshotLayout = this.includeLayoutOption
            ? this._renderScreenshotLayout()
            : null;
        return (<div key="screenshot-panel" class={this.classes(CSS.base, CSS.widget)}>
        <div class={CSS.mainContainer}>
          <h1 class={CSS.panelTitle}>{screenshotTitle}</h1>
          {this.enableLegendOption || this.enablePopupOption || this.custom ? (<h3 class={CSS.panelSubTitle}>{screenshotSubtitle}</h3>) : null}
          {this.enableLegendOption || this.enablePopupOption || this.custom
            ? fieldSet
            : null}
          {this.enablePopupOption ? featureWarning : null}
          {screenshotLayout}
          {setMapAreaButton}
        </div>
      </div>);
    };
    Screenshot.prototype._renderScreenshotLayout = function () {
        var _this = this;
        var elementOptionKeys = Object.keys(this._elementOptions);
        var allDisabled = elementOptionKeys.every(function (key) { return !_this._elementOptions[key]; });
        return (<label class={CSS.selectLayout}>
        <span> {i18n.screenshotLayout}</span>
        <select bind={this} onchange={this._updateLayoutOption} disabled={allDisabled}>
          <option value="horizontal" selected={this.outputLayout === "horizontal" ? true : false}>
            {i18n.horizontal}
          </option>
          <option value="vertical" selected={this.outputLayout === "vertical" ? true : false}>
            {i18n.vertical}
          </option>
        </select>
      </label>);
    };
    Screenshot.prototype._renderFeatureWarning = function () {
        return (<div key="feature-warning" class={CSS.featureWarning}>
        {this._selectFeatureAlertIsVisible ? (<div class={CSS.featureWarningTextContainer}>
            <svg class={CSS.warningSVG} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16 16" width="16px" height="16px">
              <path d="M14.894 12.552l-6-11.998a1 1 0 0 0-1.787 0l-6 11.998A.998.998 0 0 0 2 13.999h12a.998.998 0 0 0 .894-1.447zM9 12H7v-2h2zm0-3H7V4h2z"/>
            </svg>
            <span class={CSS.selectFeatureText}>{i18n.selectAFeature}</span>
          </div>) : null}
      </div>);
    };
    Screenshot.prototype._renderFieldSet = function () {
        var legend = i18n.legend, popup = i18n.popup;
        return (<div class={CSS.screenshotfieldSetCheckbox}>
        {this.enableLegendOption ? (<label key="esri-screenshot-legend-option" class={CSS.screenshotOption}>
            <input bind={this} onclick={this._toggleLegend} onkeydown={this._toggleLegend} checked={this.includeLegendInScreenshot} type="checkbox"/>
            {legend}
          </label>) : null}
        {this.enablePopupOption ? (<label key="esri-screenshot-popup-option" class={CSS.screenshotOption}>
            <input bind={this} onclick={this._togglePopup} onkeydown={this._togglePopup} type="checkbox" checked={this.includePopupInScreenshot}/>
            {popup}
          </label>) : null}
        {this.custom ? (<label key="esri-screenshot-custom-option" class={CSS.screenshotOption}>
            <input bind={this} onclick={this._toggleCustom} onkeydown={this._toggleCustom} type="checkbox" checked={this.includeCustomInScreenshot}/>
            {this.custom.label}
          </label>) : null}
      </div>);
    };
    Screenshot.prototype._renderSetMapAreaButton = function () {
        var setScreenshotArea = i18n.setScreenshotArea;
        return (<div key="active-button-container" class={CSS.buttonContainer}>
        <calcite-button bind={this} tabIndex={0} onclick={this.activateScreenshot} onkeydown={this.activateScreenshot} afterCreate={widget_1.storeNode} data-node-ref="_activeScreenshotBtnNode" disabled={this.enablePopupOption && this.includePopupInScreenshot
            ? this.featureWidget && this.featureWidget.graphic
                ? false
                : true
            : false} width="full" theme={this.theme}>
          {setScreenshotArea}
        </calcite-button>
      </div>);
    };
    Screenshot.prototype._renderScreenshotPreviewOverlay = function () {
        var _a;
        var previewIsVisible = this.viewModel.previewIsVisible;
        var overlayIsVisible = (_a = {},
            _a[CSS.showOverlay] = previewIsVisible,
            _a[CSS.hideOverlay] = !previewIsVisible,
            _a);
        var screenshotPreviewBtns = this._renderScreenshotPreviewBtns();
        return (<div afterCreate={this._attachToBody} class={this.classes(CSS.screenshotDiv, overlayIsVisible)}>
        <div class={CSS.screenshotPreviewContainer}>
          <div class={CSS.screenshotImgContainer}>
            <img bind={this} afterCreate={widget_1.storeNode} data-node-ref="_screenshotImgNode" class={CSS.screenshotImg}/>
          </div>
          <input bind={this} type="text" afterCreate={widget_1.storeNode} data-node-ref="previewTitleInputNode" placeholder={i18n.enterTitle}/>

          {screenshotPreviewBtns}
        </div>
      </div>);
    };
    Screenshot.prototype._renderScreenshotPreviewBtns = function () {
        return (<div>
        <button bind={this} class={CSS.actionBtn} afterCreate={this._downloadEventListener} aria-label={i18n.downloadImage} title={i18n.downloadImage}>
          {i18n.downloadImage}
        </button>
        <button bind={this} class={this.classes(CSS.actionBtn, CSS.backBtn)} afterCreate={this._addCloseEventListener} aria-label={i18n.backButton} title={i18n.backButton}>
          {i18n.backButton}
        </button>
      </div>);
    };
    Screenshot.prototype._addCloseEventListener = function (node) {
        var _this = this;
        node.addEventListener("click", function () {
            _this._closePreview();
        });
    };
    Screenshot.prototype._downloadEventListener = function (node) {
        var _this = this;
        node.addEventListener("click", function () {
            _this._downloadImage();
        });
    };
    Screenshot.prototype._renderMaskNode = function (screenshotModeIsActive) {
        var _a;
        var maskDivIsHidden = (_a = {},
            _a[CSS.hide] = !screenshotModeIsActive,
            _a);
        return (<div bind={this} class={this.classes(CSS.maskDiv, maskDivIsHidden)} afterCreate={widget_1.storeNode} data-node-ref="_maskNode"/>);
    };
    Screenshot.prototype._renderOptOutOfScreenshotButton = function () {
        return (<calcite-button bind={this} tabIndex={0} class={this.classes(CSS.pointerCursor, CSS.screenshotClose)} onclick={this.deactivateScreenshot} onkeydown={this.deactivateScreenshot} title={i18n.deactivateScreenshot} color="red">
        <calcite-icon icon="x"></calcite-icon>
      </calcite-button>);
    };
    Screenshot.prototype.deactivateScreenshot = function () {
        var _this = this;
        this.viewModel.screenshotModeIsActive = false;
        this.view.container.classList.remove(CSS.screenshotCursor);
        if (this.featureWidget && this.featureWidget.graphic) {
            this.featureWidget.graphic = null;
        }
        if (this.viewModel.dragHandler) {
            this.viewModel.dragHandler.remove();
            this.viewModel.dragHandler = null;
        }
        window.setTimeout(function () {
            _this._activeScreenshotBtnNode.focus();
        }, 10);
        this.scheduleRender();
    };
    Screenshot.prototype._toggleLegend = function (event) {
        var node = event.currentTarget;
        this.includeLegendInScreenshot = node.checked;
        this._elementOptions.legend = node.checked;
        this.scheduleRender();
    };
    Screenshot.prototype._togglePopup = function (event) {
        var node = event.currentTarget;
        this.includePopupInScreenshot = node.checked;
        this._elementOptions.popup = node.checked;
        this.scheduleRender();
    };
    Screenshot.prototype._toggleCustom = function (event) {
        var node = event.currentTarget;
        this.includeCustomInScreenshot = node.checked;
        this._elementOptions.custom = node.checked;
        this.scheduleRender();
    };
    Screenshot.prototype._closePreview = function () {
        var _this = this;
        var _a;
        var viewModel = this.viewModel;
        viewModel.previewIsVisible = false;
        viewModel.screenshotModeIsActive = false;
        if ((_a = this === null || this === void 0 ? void 0 : this.view) === null || _a === void 0 ? void 0 : _a.popup) {
            this.view.popup.clear();
        }
        window.setTimeout(function () {
            _this._activeScreenshotBtnNode.focus();
        }, 10);
        this.scheduleRender();
    };
    Screenshot.prototype._generateOffScreenPopup = function () {
        var _this = this;
        return watchUtils.watch(this, "view.popup.visible", function () {
            var _a, _b;
            if (!_this.view) {
                return;
            }
            if (((_b = (_a = _this === null || _this === void 0 ? void 0 : _this.view) === null || _a === void 0 ? void 0 : _a.popup) === null || _b === void 0 ? void 0 : _b.visible) && _this._offscreenPopupContainer) {
                if (!_this.featureWidget) {
                    _this._set("featureWidget", new FeatureWidget({
                        container: _this._offscreenPopupContainer,
                        graphic: _this.view.popup.selectedFeature,
                        map: _this.view.map,
                        spatialReference: _this.view.spatialReference
                    }));
                    _this._selectFeatureAlertIsVisible = false;
                    _this.scheduleRender();
                }
            }
        });
    };
    Screenshot.prototype._togglePopupAlert = function () {
        var _this = this;
        return watchUtils.init(this, "enablePopupOption", function () {
            if (_this.enablePopupOption) {
                _this.own([
                    watchUtils.watch(_this, [
                        "includePopupInScreenshot",
                        "featureWidget",
                        "featureWidget.graphic"
                    ], function () {
                        _this._triggerAlert();
                    }),
                    watchUtils.init(_this, "includePopupInScreenshot", function () {
                        _this._triggerAlert();
                    })
                ]);
            }
        });
    };
    Screenshot.prototype._triggerAlert = function () {
        if (this.includePopupInScreenshot &&
            (!this.featureWidget ||
                (this.featureWidget && !this.featureWidget.graphic))) {
            this._selectFeatureAlertIsVisible = true;
        }
        else {
            this._selectFeatureAlertIsVisible = false;
        }
        this.scheduleRender();
    };
    Screenshot.prototype._watchSelectedFeature = function () {
        var _this = this;
        return watchUtils.watch(this, "view.popup.selectedFeature", function () {
            var _a, _b, _c, _d;
            if (_this.featureWidget &&
                _this.view && ((_a = _this.view) === null || _a === void 0 ? void 0 : _a.popup) && ((_c = (_b = _this.view) === null || _b === void 0 ? void 0 : _b.popup) === null || _c === void 0 ? void 0 : _c.selectedFeature)) {
                while (_this._offscreenPopupContainer &&
                    _this._offscreenPopupContainer.firstChild) {
                    _this._offscreenPopupContainer.removeChild(_this._offscreenPopupContainer.firstChild);
                }
                _this.featureWidget.graphic = null;
                _this._set("featureWidget", null);
            }
            if ((_d = _this === null || _this === void 0 ? void 0 : _this.view) === null || _d === void 0 ? void 0 : _d.popup) {
                _this._set("featureWidget", new FeatureWidget({
                    container: _this._offscreenPopupContainer,
                    graphic: _this.view.popup.selectedFeature,
                    map: _this.view.map,
                    spatialReference: _this.view.spatialReference
                }));
            }
            _this.scheduleRender();
        });
    };
    Screenshot.prototype._updateLayoutOption = function (e) {
        var node = e.target;
        this.outputLayout = node.value;
    };
    Screenshot.prototype._attachToBody = function (node) {
        document.body.appendChild(node);
    };
    __decorate([
        decorators_1.aliasOf("viewModel.custom")
    ], Screenshot.prototype, "custom");
    __decorate([
        decorators_1.aliasOf("viewModel.enableLegendOption"),
        widget_1.renderable()
    ], Screenshot.prototype, "enableLegendOption");
    __decorate([
        decorators_1.aliasOf("viewModel.enablePopupOption"),
        widget_1.renderable()
    ], Screenshot.prototype, "enablePopupOption");
    __decorate([
        decorators_1.aliasOf("viewModel.featureWidget"),
        decorators_1.property({
            readOnly: true
        })
    ], Screenshot.prototype, "featureWidget");
    __decorate([
        decorators_1.property()
    ], Screenshot.prototype, "iconClass");
    __decorate([
        decorators_1.aliasOf("viewModel.includeCustomInScreenshot"),
        decorators_1.property()
    ], Screenshot.prototype, "includeCustomInScreenshot");
    __decorate([
        decorators_1.aliasOf("viewModel.includeLegendInScreenshot"),
        decorators_1.property()
    ], Screenshot.prototype, "includeLegendInScreenshot");
    __decorate([
        decorators_1.property()
    ], Screenshot.prototype, "includeLayoutOption");
    __decorate([
        decorators_1.aliasOf("viewModel.includePopupInScreenshot"),
        decorators_1.property()
    ], Screenshot.prototype, "includePopupInScreenshot");
    __decorate([
        decorators_1.property()
    ], Screenshot.prototype, "label");
    __decorate([
        decorators_1.aliasOf("viewModel.legendWidget"),
        decorators_1.property({
            readOnly: true
        })
    ], Screenshot.prototype, "legendWidget");
    __decorate([
        decorators_1.aliasOf("viewModel.screenshotModeIsActive"),
        decorators_1.property()
    ], Screenshot.prototype, "screenshotModeIsActive");
    __decorate([
        decorators_1.property()
    ], Screenshot.prototype, "theme");
    __decorate([
        decorators_1.aliasOf("viewModel.view"),
        decorators_1.property()
    ], Screenshot.prototype, "view");
    __decorate([
        decorators_1.aliasOf("viewModel.outputLayout"),
        decorators_1.property()
    ], Screenshot.prototype, "outputLayout");
    __decorate([
        decorators_1.aliasOf("viewModel.previewTitleInputNode"),
        decorators_1.property()
    ], Screenshot.prototype, "previewTitleInputNode");
    __decorate([
        decorators_1.property(),
        widget_1.renderable([
            "viewModel.state",
            "viewModel.includeLegendInScreenshot",
            "viewModel.includePopupInScreenshot",
            "viewModel.enableLegendOption",
            "viewModel.enablePopupOption",
            "viewModel.featureWidget",
            "viewModel.legendWidget"
        ])
    ], Screenshot.prototype, "viewModel");
    __decorate([
        widget_1.accessibleHandler()
    ], Screenshot.prototype, "activateScreenshot");
    __decorate([
        widget_1.accessibleHandler()
    ], Screenshot.prototype, "deactivateScreenshot");
    __decorate([
        widget_1.accessibleHandler()
    ], Screenshot.prototype, "_toggleLegend");
    __decorate([
        widget_1.accessibleHandler()
    ], Screenshot.prototype, "_togglePopup");
    __decorate([
        widget_1.accessibleHandler()
    ], Screenshot.prototype, "_toggleCustom");
    Screenshot = __decorate([
        decorators_1.subclass("Screenshot")
    ], Screenshot);
    return Screenshot;
}(Widget));
module.exports = Screenshot;
