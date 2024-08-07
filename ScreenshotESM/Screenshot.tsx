// Copyright 2024 Esri
// Licensed under the Apache License, Version 2.0 (the "License");
// you may not use this file except in compliance with the License.
// You may obtain a copy of the License at
//     http://www.apache.org/licenses/LICENSE-2.0
// Unless required by applicable law or agreed to in writing, software
// distributed under the License is distributed on an "AS IS" BASIS,
// WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
// See the License for the specific language governing permissions and
// limitations under the License.​

import Widget from "@arcgis/core/widgets/Widget";
import {
  subclass,
  property,
  aliasOf,
} from "@arcgis/core/core/accessorSupport/decorators";
import MapView from "@arcgis/core/views/MapView";
import SceneView from "@arcgis/core/views/SceneView";
import { when, watch, whenOnce } from "@arcgis/core/core/reactiveUtils";
import Handles from "@arcgis/core/core/Handles";
import {
  accessibleHandler,
  tsx,
  storeNode,
  messageBundle,
} from "@arcgis/core/widgets/support/widget";
import ScreenshotViewModel from "./Screenshot/ScreenshotViewModel";
import Legend from "@arcgis/core/widgets/Legend";
import FeatureWidget from "@arcgis/core/widgets/Feature";

import "./Screenshot/css/Screenshot.scss";

const CSS = {
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
  featureWarningTextContainer:
    "esri-screenshot__feature-warning-text-container",
  warningSVG: "esri-screenshot__warning-svg",
  selectFeatureText: "esri-screenshot__select-feature-text",
  screenshotfieldSetCheckbox: "esri-screenshot__field-set-checkbox",
  offScreenPopupContainer: "esri-screenshot__offscreen-pop-up-container",
  offScreenLegendContainer: "esri-screenshot__offscreen-legend-container",
  screenshotClose: "esri-screenshot__close-button",
  closeButtonContainer: "esri-screenshot__close-button-container",
  screenshotPreviewContainer: "esri-screenshot__img-preview-container",
  selectLayout: "esri-screenshot__select-layout",
};

@subclass("Screenshot")
export default class Screenshot extends Widget {
  constructor(value?: unknown) {
    super(value);
  }

  private _maskNode: HTMLElement = null;
  private _screenshotImgNode: HTMLImageElement = null;
  private _activeScreenshotBtnNode: HTMLButtonElement = null;
  private _selectFeatureAlertIsVisible: boolean = null;
  private _offscreenPopupContainer: HTMLElement = null;
  private _offscreenLegendContainer: HTMLElement = null;
  private _isOpen = false;

  private _handles: Handles = new Handles();
  private _elementOptions: {
    legend?: boolean;
    popup?: boolean;
    custom?: boolean;
  } = {};

  @aliasOf("viewModel.custom")
  custom: { label: string; element: HTMLElement } = null;

  @property()
  disableCustom = false;

  @aliasOf("viewModel.enableLegendOption")
  enableLegendOption: boolean = null;

  @aliasOf("viewModel.enablePopupOption")
  enablePopupOption: boolean = null;

  @aliasOf("viewModel.featureWidget")
  @property({
    readOnly: true,
  })
  featureWidget: FeatureWidget = null;
  @property()
  icon = "images";
  @aliasOf("viewModel.includeCustomInScreenshot")
  @property()
  includeCustomInScreenshot: boolean = null;

  @aliasOf("viewModel.includeLegendInScreenshot")
  @property()
  includeLegendInScreenshot: boolean = null;

  @property()
  includeLayoutOption = false;

  @aliasOf("viewModel.includePopupInScreenshot")
  @property()
  includePopupInScreenshot: boolean = null;

  @property()
  label;

  @aliasOf("viewModel.legendWidget")
  @property({
    readOnly: true,
  })
  legendWidget: Legend = null;

  @aliasOf("viewModel.screenshotModeIsActive")
  @property()
  screenshotModeIsActive: boolean = null;

  @property()
  theme = "light";

  @aliasOf("viewModel.view")
  @property()
  view: MapView | SceneView = null;

  @aliasOf("viewModel.outputLayout")
  @property()
  outputLayout: "vertical" | "horizontal" = null;

  @aliasOf("viewModel.previewTitleInputNode")
  @property()
  previewTitleInputNode: HTMLInputElement = null;

  @property()
  previewContainer: HTMLDivElement = null;

  @property()
  viewModel: ScreenshotViewModel = new ScreenshotViewModel();

  @property()
  @messageBundle("dist/assets/t9nCommon/common")
  commonMessages: any;

  postInitialize() {
    this.label = this?.commonMessages?.screenshot?.widgetLabel;
    this.addHandles([
      this._togglePopupAlert(),
      this._generateOffScreenPopup(),
      this._watchSelectedFeature(),
      when(
        () => this?.legendWidget,
        () => {
          this.scheduleRender();
        },
        { initial: true }
      ),
      when(
        () =>
          this?.enableLegendOption || this?.enablePopupOption || this?.custom,
        () => {
          if (this.enableLegendOption) {
            this._elementOptions.legend = this.includeLegendInScreenshot;
          }
          if (this.enablePopupOption) {
            this._elementOptions.popup = this.includePopupInScreenshot;
          }
          if (this.custom) {
            this._elementOptions.custom = this.includeCustomInScreenshot;
          }
        },
        { initial: true }
      ),
      when(
        () => this?.previewContainer,
        () => {
          document.addEventListener("keydown", (e) => {
            if (this.viewModel.previewIsVisible) {
              const selectors =
                'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])';
              const focusableElements =
                this.previewContainer.querySelectorAll(selectors);
              const firstFocusableElement =
                focusableElements[0] as HTMLInputElement;
              const lastFocusableElement = focusableElements[
                focusableElements.length - 1
              ] as HTMLButtonElement;
              this._handleTab(e, firstFocusableElement, lastFocusableElement);
            }
          });
        },
        {
          initial: true,
        }
      ),
      watch(
        () => this.viewModel?.previewIsVisible,
        async () => {
          await whenOnce(() => !this.viewModel?.previewIsVisible);
          this._isOpen = false;
          this.scheduleRender();
        }
      ),
    ]);
    const offScreenPopupContainer = document.createElement("div");
    const offScreenLegendContainer = document.createElement("div");
    offScreenPopupContainer.classList.add(CSS.offScreenPopupContainer);
    offScreenLegendContainer.classList.add(CSS.offScreenLegendContainer);
    document.body.appendChild(offScreenPopupContainer);
    document.body.appendChild(offScreenLegendContainer);
    this._offscreenPopupContainer = offScreenPopupContainer;
    this._offscreenLegendContainer = offScreenLegendContainer;
  }

  render(): any {
    const { screenshotModeIsActive } = this.viewModel;
    const screenshotPanel = this._renderScreenshotPanel();
    const screenshotPreviewOverlay = this._renderScreenshotPreviewOverlay();
    const maskNode = this._renderMaskNode(screenshotModeIsActive);
    const optOutOfScreenshotButton = this._renderOptOutOfScreenshotButton();
    if (this.legendWidget && !this.legendWidget.container) {
      this.legendWidget.container = this._offscreenLegendContainer;
    }

    return this._isOpen ? (
      <div key="screenshot">
        {screenshotModeIsActive ? (
          <div key="screenshot-container" class={CSS.closeButtonContainer}>
            {optOutOfScreenshotButton}
          </div>
        ) : (
          screenshotPanel
        )}
        {screenshotPreviewOverlay}
        {maskNode}
      </div>
    ) : (
      <div key="close-button">
        <calcite-button
          onclick={() => {
            this._isOpen = !this._isOpen;
            this.scheduleRender();
          }}
          class="esri-widget--button"
          icon-start="images"
          kind="neutral"
        />
      </div>
    );
  }

  destroy() {
    this._handles.removeAll();
    this._handles.destroy();
    this._handles = null;
    this._maskNode = null;
    this._screenshotImgNode = null;
  }

  @accessibleHandler()
  activateScreenshot(): void {
    if (this.viewModel.screenshotModeIsActive) {
      return;
    }
    this.viewModel.screenshotModeIsActive = true;
    this.view.container.classList.add(CSS.screenshotCursor);
    this.viewModel.dragHandler = (this.view as any).on(
      "drag",
      (event: Event) => {
        this.viewModel.setScreenshotArea(
          event,
          this._maskNode,
          this._screenshotImgNode,
          this.viewModel.dragHandler
        );
      }
    );
    this.scheduleRender();
  }

  private _downloadImage() {
    this.viewModel.downloadImage();
  }

  private _renderScreenshotPanel(): any {
    const { screenshotTitle, screenshotSubtitle } =
      this?.commonMessages?.screenshot;
    const fieldSet = this._renderFieldSet();
    const setMapAreaButton = this._renderSetMapAreaButton();
    const featureWarning = this._renderFeatureWarning();
    const screenshotLayout = this.includeLayoutOption
      ? this._renderScreenshotLayout()
      : null;
    return (
      <div key="screenshot-panel" class={this.classes(CSS.base, CSS.widget)}>
        <div class={CSS.mainContainer}>
          <calcite-button
            onclick={() => (this._isOpen = false)}
            class="close-button"
            kind="neutral"
            appearance="transparent"
            icon-start="x"
          />
          <h1 class={CSS.panelTitle}>{screenshotTitle}</h1>
          {this.enableLegendOption || this.enablePopupOption || this.custom ? (
            <h3 class={CSS.panelSubTitle}>{screenshotSubtitle}</h3>
          ) : null}
          {this.enableLegendOption || this.enablePopupOption || this.custom
            ? fieldSet
            : null}
          {this.enablePopupOption ? featureWarning : null}
          {screenshotLayout}
          {setMapAreaButton}
        </div>
      </div>
    );
  }

  private _renderScreenshotLayout(): any {
    const elementOptionKeys = Object.keys(this._elementOptions);
    const allDisabled = elementOptionKeys.every(
      (key) => !this._elementOptions[key]
    );
    return (
      <label class={CSS.selectLayout}>
        <span> {this?.commonMessages?.screenshot?.screenshotLayout}</span>
        <select
          bind={this}
          onchange={this._updateLayoutOption}
          disabled={allDisabled}
        >
          <option
            value="horizontal"
            selected={this.outputLayout === "horizontal" ? true : false}
          >
            {this?.commonMessages?.screenshot?.horizontal}
          </option>
          <option
            value="vertical"
            selected={this.outputLayout === "vertical" ? true : false}
          >
            {this?.commonMessages?.screenshot?.vertical}
          </option>
        </select>
      </label>
    );
  }

  private _renderFeatureWarning(): any {
    return (
      <div key="feature-warning" class={CSS.featureWarning}>
        {this._selectFeatureAlertIsVisible ? (
          <div class={CSS.featureWarningTextContainer}>
            <svg
              class={CSS.warningSVG}
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 16 16"
              width="16px"
              height="16px"
            >
              <path d="M14.894 12.552l-6-11.998a1 1 0 0 0-1.787 0l-6 11.998A.998.998 0 0 0 2 13.999h12a.998.998 0 0 0 .894-1.447zM9 12H7v-2h2zm0-3H7V4h2z" />
            </svg>
            <span class={CSS.selectFeatureText}>
              {this?.commonMessages?.screenshot?.selectAFeature}
            </span>
          </div>
        ) : null}
      </div>
    );
  }

  private _renderFieldSet(): any {
    const { legend, popup } = this?.commonMessages?.screenshot;
    return (
      <div class={CSS.screenshotfieldSetCheckbox}>
        {this.enableLegendOption ? (
          <label
            key="esri-screenshot-legend-option"
            class={CSS.screenshotOption}
          >
            <input
              bind={this}
              onclick={this._toggleLegend}
              onkeydown={this._toggleLegend}
              checked={this.includeLegendInScreenshot}
              type="checkbox"
            />
            {legend}
          </label>
        ) : null}
        {this.enablePopupOption ? (
          <label
            key="esri-screenshot-popup-option"
            class={CSS.screenshotOption}
          >
            <input
              bind={this}
              onclick={this._togglePopup}
              onkeydown={this._togglePopup}
              type="checkbox"
              checked={this.includePopupInScreenshot}
            />
            {popup}
          </label>
        ) : null}
        {this.custom ? (
          <label
            key="esri-screenshot-custom-option"
            class={CSS.screenshotOption}
          >
            <input
              bind={this}
              onclick={this._toggleCustom}
              onkeydown={this._toggleCustom}
              type="checkbox"
              checked={this.includeCustomInScreenshot}
              disabled={this.disableCustom}
            />
            {this.custom.label}
          </label>
        ) : null}
      </div>
    );
  }

  private _renderSetMapAreaButton(): any {
    const { setScreenshotArea } = this?.commonMessages?.screenshot;
    return (
      <div key="active-button-container" class={CSS.buttonContainer}>
        <calcite-button
          bind={this}
          tabIndex={0}
          onclick={this.activateScreenshot}
          onkeydown={this.activateScreenshot}
          afterCreate={storeNode}
          data-node-ref="_activeScreenshotBtnNode"
          disabled={
            this.enablePopupOption && this.includePopupInScreenshot
              ? this.featureWidget && this.featureWidget.graphic
                ? false
                : true
              : false
          }
          width="full"
          theme={this.theme}
        >
          {setScreenshotArea}
        </calcite-button>
      </div>
    );
  }

  private _renderScreenshotPreviewOverlay(): any {
    const { previewIsVisible } = this.viewModel;
    const overlayIsVisible = {
      [CSS.showOverlay]: previewIsVisible,
      [CSS.hideOverlay]: !previewIsVisible,
    };
    const screenshotPreviewBtns = this._renderScreenshotPreviewBtns();
    return (
      <div
        afterCreate={this._attachToBody}
        class={this.classes(CSS.screenshotDiv, overlayIsVisible)}
      >
        <div
          bind={this}
          class={CSS.screenshotPreviewContainer}
          role="dialog"
          aria-label={this?.commonMessages?.screenshot?.downloadImage}
          afterCreate={storeNode}
          data-node-ref="previewContainer"
        >
          <div class={CSS.screenshotImgContainer}>
            <img
              bind={this}
              afterCreate={storeNode}
              data-node-ref="_screenshotImgNode"
              class={CSS.screenshotImg}
            />
          </div>
          <input
            bind={this}
            type="text"
            afterCreate={storeNode}
            data-node-ref="previewTitleInputNode"
            placeholder={this?.commonMessages?.screenshot?.enterTitle}
          />

          {screenshotPreviewBtns}
        </div>
      </div>
    );
  }

  private _renderScreenshotPreviewBtns(): any {
    return (
      <div>
        <button
          bind={this}
          class={CSS.actionBtn}
          afterCreate={this._downloadEventListener}
          aria-label={this?.commonMessages?.screenshot?.downloadImage}
          title={this?.commonMessages?.screenshot?.downloadImage}
        >
          {this?.commonMessages?.screenshot?.downloadImage}
        </button>
        <button
          bind={this}
          class={this.classes(CSS.actionBtn, CSS.backBtn)}
          afterCreate={this._addCloseEventListener}
          aria-label={this?.commonMessages?.screenshot?.backButton}
          title={this?.commonMessages?.screenshot?.backButton}
        >
          {this?.commonMessages?.screenshot?.backButton}
        </button>
      </div>
    );
  }

  private _addCloseEventListener(node: HTMLElement): void {
    node.addEventListener("click", () => {
      this._closePreview();
    });
  }

  private _downloadEventListener(node: HTMLElement) {
    node.addEventListener("click", () => {
      this._downloadImage();
    });
  }

  private _renderMaskNode(screenshotModeIsActive: boolean): any {
    const maskDivIsHidden = {
      [CSS.hide]: !screenshotModeIsActive,
    };
    return (
      <div
        bind={this}
        class={this.classes(CSS.maskDiv, maskDivIsHidden)}
        afterCreate={storeNode}
        data-node-ref="_maskNode"
      />
    );
  }

  private _renderOptOutOfScreenshotButton(): any {
    return (
      <calcite-button
        bind={this}
        tabIndex={0}
        class={this.classes(CSS.pointerCursor, CSS.screenshotClose)}
        onclick={this.deactivateScreenshot}
        onkeydown={this.deactivateScreenshot}
        title={this?.commonMessages?.screenshot?.deactivateScreenshot}
        kind="danger"
        icon-start="x"
      ></calcite-button>
    );
  }

  @accessibleHandler()
  deactivateScreenshot(): void {
    this.viewModel.screenshotModeIsActive = false;
    this.view.container.classList.remove(CSS.screenshotCursor);
    if (this.featureWidget && this.featureWidget.graphic) {
      this.featureWidget.graphic = null;
    }
    if (this.viewModel.dragHandler) {
      this.viewModel.dragHandler.remove();
      this.viewModel.dragHandler = null;
    }

    window.setTimeout(() => {
      this._activeScreenshotBtnNode.focus();
    }, 10);

    this.scheduleRender();
  }

  @accessibleHandler()
  private _toggleLegend(event: Event): void {
    const node = event.currentTarget as HTMLInputElement;
    this.includeLegendInScreenshot = node.checked;
    this._elementOptions.legend = node.checked;
    this.scheduleRender();
  }

  @accessibleHandler()
  private _togglePopup(event: Event): void {
    const node = event.currentTarget as HTMLInputElement;
    this.includePopupInScreenshot = node.checked;
    this._elementOptions.popup = node.checked;
    this.scheduleRender();
  }

  @accessibleHandler()
  private _toggleCustom(event: Event): void {
    const node = event.currentTarget as HTMLInputElement;
    this.includeCustomInScreenshot = node.checked;
    this._elementOptions.custom = node.checked;
    this.scheduleRender();
  }

  private _closePreview(): void {
    const { viewModel } = this;
    viewModel.previewIsVisible = false;
    viewModel.screenshotModeIsActive = false;
    this.view?.popup?.clear && this.view.popup.clear?.();
    window.setTimeout(() => {
      this._activeScreenshotBtnNode.focus();
    }, 10);
    this.scheduleRender();
  }

  private _generateOffScreenPopup(): __esri.WatchHandle {
    return watch(
      () => this?.view?.popup?.visible,
      () => {
        if (!this.view) {
          return;
        }
        if (this?.view?.popup?.visible && this._offscreenPopupContainer) {
          if (!this.featureWidget) {
            this._set(
              "featureWidget",
              new FeatureWidget({
                container: this._offscreenPopupContainer,
                graphic: this.view.popup.selectedFeature,
                map: this.view.map,
                spatialReference: this.view.spatialReference,
              })
            );
            this._selectFeatureAlertIsVisible = false;
            this.scheduleRender();
          }
        }
      }
    );
  }

  private _togglePopupAlert(): __esri.WatchHandle {
    return watch(
      () => this?.enablePopupOption,
      () => {
        if (this.enablePopupOption) {
          this.addHandles([
            watch(
              () =>
                this?.includePopupInScreenshot ||
                this?.featureWidget ||
                this?.featureWidget?.graphic,
              () => {
                this._triggerAlert();
              }
            ),
            watch(
              () => this?.includePopupInScreenshot,
              () => {
                this._triggerAlert();
              },
              {
                initial: true,
              }
            ),
          ]);
        }
      },
      {
        initial: true,
      }
    );
  }

  private _triggerAlert(): void {
    if (
      this.includePopupInScreenshot &&
      (!this.featureWidget ||
        (this.featureWidget && !this.featureWidget.graphic))
    ) {
      this._selectFeatureAlertIsVisible = true;
    } else {
      this._selectFeatureAlertIsVisible = false;
    }
    this.scheduleRender();
  }

  private _watchSelectedFeature(): __esri.WatchHandle {
    return watch(
      () => this?.view?.popup?.selectedFeature,
      () => {
        if (
          this.featureWidget &&
          this.view &&
          this.view?.popup &&
          this.view?.popup?.selectedFeature
        ) {
          while (
            this._offscreenPopupContainer &&
            this._offscreenPopupContainer.firstChild
          ) {
            this._offscreenPopupContainer.removeChild(
              this._offscreenPopupContainer.firstChild
            );
          }
          this.featureWidget.graphic = null;
          this._set("featureWidget", null);
        }
        if (this?.view?.popup) {
          this._set(
            "featureWidget",
            new FeatureWidget({
              container: this._offscreenPopupContainer,
              graphic: this.view.popup.selectedFeature,
              map: this.view.map,
              spatialReference: this.view.spatialReference,
            })
          );
        }

        this.scheduleRender();
      }
    );
  }

  private _updateLayoutOption(e: Event) {
    const node = e.target as HTMLSelectElement;
    this.outputLayout = node.value as "horizontal" | "vertical";
  }

  private _attachToBody(this: HTMLElement, node) {
    document.body.appendChild(node);
  }

  private _handleTab(e, firstFocusableElement, lastFocusableElement) {
    let isTabPressed = e.key === "Tab" || e.keyCode === 9;

    if (!isTabPressed) {
      return;
    }

    if (e.shiftKey) {
      if (document.activeElement === firstFocusableElement) {
        const interval = setInterval(() => {
          lastFocusableElement.focus();
          if (document.activeElement === lastFocusableElement) {
            clearInterval(interval);
            return;
          }
        }, 0);
        e.preventDefault();
      }
    } else {
      if (document.activeElement === lastFocusableElement) {
        const interval = setInterval(() => {
          firstFocusableElement.focus();
          if (document.activeElement === firstFocusableElement) {
            clearInterval(interval);
            return;
          }
        }, 0);
        e.preventDefault();
      }
    }
  }
}
