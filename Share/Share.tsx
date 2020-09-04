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

import i18n = require("dojo/i18n!./Share/nls/resources");

// esri.core
import Collection = require("esri/core/Collection");
import watchUtils = require("esri/core/watchUtils");
import { substitute } from "esri/intl";

// esri.core.accessorSupport
import {
  subclass,
  property,
  aliasOf
} from "esri/core/accessorSupport/decorators";

// esri.views
import MapView = require("esri/views/MapView");
import SceneView = require("esri/views/SceneView");

// esri.widgets
import Widget = require("esri/widgets/Widget");

//esri.widgets.support
import {
  accessibleHandler,
  renderable,
  tsx,
  storeNode
} from "esri/widgets/support/widget";

import ShareViewModel = require("./Share/ShareViewModel");
import ShareItem = require("./Share/ShareItem");
import ShareFeatures = require("./Share/ShareFeatures");
import PortalItem = require("esri/portal/PortalItem");

const CSS = {
  base: "esri-share",
  shareModalStyles: "esri-share__share-modal",
  shareButton: "esri-share__share-button",
  shareModal: {
    shareIframe: {
      iframeContainer: "esri-share__iframe-container",
      iframeTabSectionContainer: "esri-share__iframe-tab-section-container",
      iframeInputContainer: "esri-share__iframe-input-container",
      iframePreview: "esri-share__iframe-preview",
      iframeInput: "esri-share__iframe-input"
    },
    header: {
      heading: "esri-share__heading"
    },
    main: {
      mainHeader: "esri-share__main-header",
      mainHR: "esri-share__hr",
      mainCopy: {
        copyContainer: "esri-share__copy-container",
        copyClipboardContainer: "esri-share__copy-clipboard-container"
      },
      mainUrl: {
        inputGroup: "esri-share__copy-url-group",
        urlInput: "esri-share__url-input",
        linkGenerating: "esri-share--link-generating"
      },
      mainShare: {
        shareContainer: "esri-share__share-container",
        shareItemContainer: "esri-share__share-item-container",
        shareIcons: {
          facebook: "icon-social-facebook",
          twitter: "icon-social-twitter",
          email: "icon-social-contact",
          linkedin: "icon-social-linkedin",
          pinterest: "icon-social-pinterest",
          rss: "icon-social-rss"
        }
      }
    }
  },
  icons: {
    widgetIcon: "esri-icon-share",
    copy: "esri-share__copy-icon",
    svgIcon: "esri-share__svg-icon",
    facebook: "esri-share__facebook-icon",
    twitter: "esri-share__twitter-icon",
    linkedIn: "esri-share__linked-in-icon",
    mail: "esri-share__mail-icon"
  },
  shareIcon: "esri-share__share-icon"
};

@subclass("Share")
class Share extends Widget {
  constructor(params?: any) {
    super(params);
  }

  private _shareModal: HTMLCalciteModalElement = null;
  private _beforeCloseIsSet = false;

  private _iframeInputNode: HTMLInputElement = null;
  private _urlInputNode: HTMLInputElement = null;

  @aliasOf("viewModel.view")
  @property()
  view: MapView | SceneView = null;

  @aliasOf("viewModel.shareModalOpened")
  @renderable()
  shareModalOpened: boolean = null;

  @aliasOf("viewModel.shareItems")
  @renderable()
  shareItems: Collection<ShareItem> = null;

  @aliasOf("viewModel.shareFeatures")
  @renderable()
  shareFeatures: ShareFeatures = null;

  @aliasOf("viewModel.shareUrl")
  @renderable()
  shareUrl: string = null;

  @property()
  iconClass = CSS.icons.widgetIcon;
  @property()
  label = i18n.widgetLabel;

  @property()
  theme = "light";

  @renderable([
    "viewModel.state",
    "viewModel.embedCode",
    "viewModel.shareFeatures"
  ])
  @property({
    type: ShareViewModel
  })
  viewModel: ShareViewModel = new ShareViewModel();

  postInitialize() {
    this.own([
      watchUtils.whenTrue(this, "view.ready", () => {
        this.own([
          watchUtils.init(this, "shareModalOpened", () => {
            this._detectWidgetToggle();
          })
        ]);
      })
    ]);
  }

  destroy() {
    this._iframeInputNode = null;
    this._urlInputNode = null;
  }

  render() {
    const modal = this._renderShareModal();
    return (
      <div class={CSS.base} aria-labelledby="shareModal">
        <button
          class={this.classes(CSS.icons.widgetIcon, CSS.shareButton)}
          bind={this}
          theme={this.theme}
          title={i18n.heading}
          onclick={this._toggleShareModal}
          onkeydown={this._toggleShareModal}
        />
        {modal}
      </div>
    );
  }

  @accessibleHandler()
  private _toggleShareModal(): void {
    const { _shareModal } = this;
    if (_shareModal.hasAttribute("active")) {
      _shareModal.removeAttribute("active");
      this.shareModalOpened = false;
    } else {
      _shareModal.setAttribute("active", "true");
      this.shareModalOpened = true;
    }
  }

  private _detectWidgetToggle(): void {
    if (this.shareModalOpened) {
      this._generateUrl();
    }
    this.scheduleRender();
  }

  @accessibleHandler()
  private _copyUrlInput(): void {
    this._urlInputNode.focus();
    this._urlInputNode.setSelectionRange(0, this._urlInputNode.value.length);
    document.execCommand("copy");
    this.scheduleRender();
  }

  @accessibleHandler()
  private _copyIframeInput(): void {
    this._iframeInputNode.focus();
    this._iframeInputNode.setSelectionRange(
      0,
      this._iframeInputNode.value.length
    );
    document.execCommand("copy");
    this.scheduleRender();
  }

  @accessibleHandler()
  private _processShareItem(event: Event): void {
    const node = event.currentTarget as HTMLElement;
    const shareItem = node["data-share-item"] as ShareItem;
    const { urlTemplate } = shareItem;
    const portalItem = this.get<PortalItem>("view.map.portalItem");
    const title = portalItem
      ? substitute(i18n.urlTitle, { title: portalItem.title })
      : null;
    const summary = portalItem
      ? substitute(i18n.urlSummary, { summary: portalItem.snippet })
      : null;
    this._openUrl(this.shareUrl, title, summary, urlTemplate);
  }

  private _generateUrl(): void {
    this.viewModel.generateUrl();
  }

  private _openUrl(
    url: string,
    title: string,
    summary: string,
    urlTemplate: string
  ): void {
    const urlToOpen = substitute(urlTemplate, {
      url,
      title,
      summary
    });
    console.log(urlToOpen);
    window.open(urlToOpen);
  }

  private _renderShareModal(): any {
    const modalContentNode = this._renderModalContent();
    return (
      <calcite-modal
        bind={this}
        class={this.classes(CSS.shareModalStyles)}
        aria-labelledby="shareModal"
        afterCreate={storeNode}
        afterUpdate={this._setBeforeClose}
        data-modal={this}
        data-node-ref="_shareModal"
        scale="s"
        width="s"
        theme={this.theme}
      >
        <h3 slot="header" id="shareModal" class={CSS.shareModal.header.heading}>
          {i18n.heading}
        </h3>
        <div slot="content">{modalContentNode}</div>
      </calcite-modal>
    );
  }

  private _renderModalContent(): any {
    const sendALinkContentNode = this._renderSendALinkContent();
    const embedMapContentNode = this._renderEmbedMapContent();
    const { embedMap } = this.shareFeatures;
    return embedMap ? (
      <calcite-tabs>
        <calcite-tab-nav slot="tab-nav">
          <calcite-tab-title active>{i18n.sendLink}</calcite-tab-title>
          <calcite-tab-title>{i18n.embedMap}</calcite-tab-title>
        </calcite-tab-nav>
        <calcite-tab active>{sendALinkContentNode}</calcite-tab>
        <calcite-tab>{embedMapContentNode}</calcite-tab>
      </calcite-tabs>
    ) : (
        sendALinkContentNode
      );
  }

  private _renderShareItem(shareItem: ShareItem): any {
    const { name, iconName } = shareItem;
    return (
      <button
        key={name}
        bind={this}
        onclick={this._processShareItem}
        class={this.classes(CSS.shareIcon, iconName)}
        title={name}
        aria-label={name}
        data-share-item={shareItem}
      >
        {shareItem.id === "facebook"
          ? this._renderFacebookIcon()
          : shareItem.id === "twitter"
            ? this._renderTwitterIcon()
            : shareItem.id === "linkedin"
              ? this._renderLinkedInIcon()
              : shareItem.id === "email"
                ? this._renderMailIcon()
                : null}
      </button>
    );
  }

  private _renderShareItems(): any[] {
    const shareServices = this.shareItems;
    const { shareIcons } = CSS.shareModal.main.mainShare;
    // Assign class names of icons to share item
    shareServices.forEach((shareItem: ShareItem) => {
      for (const icon in shareIcons) {
        if (icon === shareItem.id) {
          shareItem.iconName = shareIcons[shareItem.id];
        }
      }
    });

    return shareServices
      .toArray()
      .map(shareItems => this._renderShareItem(shareItems));
  }

  private _renderShareItemContainer(): any {
    const { shareServices } = this.shareFeatures;
    const { state } = this.viewModel;
    const shareItemNodes = shareServices ? this._renderShareItems() : null;
    const shareItemNode = shareServices
      ? state === "ready" && shareItemNodes.length
        ? [shareItemNodes]
        : null
      : null;
    return (
      <div>
        {shareServices ? (
          <div
            class={CSS.shareModal.main.mainShare.shareContainer}
            key="share-container"
          >
            <span class={CSS.shareModal.main.mainHeader}>
              {i18n.subHeading}
            </span>
            <div class={CSS.shareModal.main.mainShare.shareItemContainer}>
              {shareItemNode}
            </div>
          </div>
        ) : null}
      </div>
    );
  }

  private _renderCopyUrl(): any {
    const { copyToClipboard } = this.shareFeatures;
    return (
      <div>
        {copyToClipboard ? (
          <div
            class={CSS.shareModal.main.mainCopy.copyContainer}
            key="copy-container"
          >
            <div class={CSS.shareModal.main.mainUrl.inputGroup}>
              <span class={CSS.shareModal.main.mainHeader}>
                {i18n.clipboard}
              </span>
              <div class={CSS.shareModal.main.mainCopy.copyClipboardContainer}>
                <calcite-button
                  bind={this}
                  onclick={this._copyUrlInput}
                  onkeydown={this._copyUrlInput}
                >
                  <calcite-icon icon="copy" />
                </calcite-button>
                <input
                  type="text"
                  class={CSS.shareModal.main.mainUrl.urlInput}
                  bind={this}
                  value={this.shareUrl}
                  afterCreate={storeNode}
                  data-node-ref="_urlInputNode"
                  readOnly
                />
              </div>
            </div>
          </div>
        ) : null}
      </div>
    );
  }

  private _renderSendALinkContent(): any {
    const copyUrlNode = this._renderCopyUrl();
    const shareServicesNode = this._renderShareItemContainer();
    const { shareServices, copyToClipboard } = this.shareFeatures;
    const { state } = this.viewModel;
    return state === "ready" ? (
      <div>
        {shareServicesNode}
        {!copyToClipboard || !shareServices ? null : (
          <hr class={CSS.shareModal.main.mainHR} />
        )}
        {copyUrlNode}
      </div>
    ) : (
        <calcite-loader active />
      );
  }

  private _renderCopyIframe(): any {
    const { embedCode, state } = this.viewModel;
    return (
      <div class={CSS.shareModal.shareIframe.iframeInputContainer}>
        <calcite-button
          bind={this}
          onclick={this._copyIframeInput}
          onkeydown={this._copyIframeInput}
        >
          <calcite-icon icon="copy" />
        </calcite-button>

        {state === "ready" ? (
          <input
            class={CSS.shareModal.shareIframe.iframeInput}
            type="text"
            tabindex={0}
            value={embedCode}
            bind={this}
            afterCreate={storeNode}
            data-node-ref="_iframeInputNode"
            readOnly
          />
        ) : (
            <div class={CSS.shareModal.main.mainUrl.linkGenerating}>
              {i18n.generateLink}
            </div>
          )}
      </div>
    );
  }

  private _renderEmbedMapContent(): any {
    const { embedMap } = this.shareFeatures;
    const { state } = this.viewModel;
    const copyIframeCodeNode = this._renderCopyIframe();

    return embedMap ? (
      <div bind={this}>
        {state === "ready" ? (
          <div
            key="iframe-tab-section-container"
            class={CSS.shareModal.shareIframe.iframeTabSectionContainer}
          >
            <h2 class={CSS.shareModal.main.mainHeader}>{i18n.clipboard}</h2>
            {copyIframeCodeNode}
            <div class={CSS.shareModal.shareIframe.iframeContainer}>
              {embedMap ? (
                state === "ready" ? (
                  this.shareModalOpened ? (
                    <iframe
                      class={CSS.shareModal.shareIframe.iframePreview}
                      src={this.shareUrl}
                      tabIndex="-1"
                      scrolling="no"
                    />
                  ) : null
                ) : null
              ) : null}
            </div>
          </div>
        ) : (
            <calcite-loader active />
          )}
      </div>
    ) : null;
  }

  private _setBeforeClose(): void {
    if (this._shareModal && !this._beforeCloseIsSet) {
      this._shareModal.beforeClose = (node: HTMLCalciteModalElement) => {
        return this._beforeClose(node);
      };
      this._beforeCloseIsSet = true;
    }
  }

  private _beforeClose(node: HTMLCalciteModalElement): Promise<void> {
    return new Promise(resolve => {
      this.shareModalOpened = false;
      node.removeAttribute("active");
      resolve();
    });
  }

  private _renderFacebookIcon(): any {
    return (
      <svg class={this.classes(CSS.icons.facebook, CSS.icons.svgIcon)}>
        <path
          d="M2.2,0.5C1.6,0.5,1,1.1,1,1.8v20.5c0,0.7,0.6,1.3,1.3,1.3H13v-10h-3v-3h3V8.1
	c0.3-3,2.1-4.6,4.8-4.6C19,3.5,21,3.6,21,3.6v2.9h-2.4C17.1,6.7,17,8.4,17,8.4v2.1h3.3l-0.4,3H17v10h5.7c0.7,0,1.3-0.6,1.3-1.3V1.8
	c0-0.7-0.6-1.3-1.3-1.3L2.2,0.5L2.2,0.5z"
        />
      </svg>
    );
  }

  private _renderTwitterIcon(): any {
    return (
      <svg class={this.classes(CSS.icons.twitter, CSS.icons.svgIcon)}>
        <path
          d="M24,4.3c-0.8,0.4-1.8,0.7-2.7,0.8c1-0.6,1.7-1.6,2.1-2.8c-0.9,0.6-1.9,1-3,1.2
	c-0.9-1-2.1-1.6-3.4-1.6c-2.6,0-4.7,2.3-4.7,5c0,0.4,0,0.8,0.1,1.2C8.4,7.9,4.9,5.9,2.6,2.8C2.2,3.6,2,4.5,2,5.4
	c0,1.8,0.8,3.3,2.1,4.2C3.3,9.6,2.6,9.3,1.9,9c0,0,0,0,0,0.1c0,2.4,1.6,4.5,3.8,5c-0.4,0.1-0.8,0.2-1.2,0.2c-0.3,0-0.6,0-0.9-0.1
	c0.6,2,2.3,3.5,4.4,3.5c-1.6,1.4-3.7,2.2-5.9,2.2c-0.4,0-0.8,0-1.1-0.1c2.1,1.4,4.6,2.3,7.2,2.3c8.7,0,13.4-7.7,13.4-14.4
	c0-0.2,0-0.4,0-0.7C22.6,6.2,23.4,5.3,24,4.3"
        />
      </svg>
    );
  }

  private _renderLinkedInIcon(): any {
    return (
      <svg class={this.classes(CSS.icons.linkedIn, CSS.icons.svgIcon)}>
        <path
          d="M2.7,0.5C1.8,0.5,1,1.2,1,2.1v19.7c0,0.9,0.8,1.6,1.7,1.6h19.6c0.9,0,1.7-0.7,1.7-1.6V2.1
	c0-0.9-0.8-1.6-1.7-1.6H2.7z M6.2,3.9c1.2,0,1.9,0.8,1.9,1.8c0,1-0.8,1.8-2,1.8h0C5,7.5,4.3,6.7,4.3,5.7C4.3,4.7,5,3.9,6.2,3.9
	L6.2,3.9z M16.1,9.3c2.2,0,3.9,1.4,3.9,4.5v5.7h-3v-5.6c0-1.4-0.5-2.4-1.9-2.4c-1.1,0-1.7,0.7-2,1.3C13,13,13,13.4,13,13.7v5.8H9.6
	c0,0,0-9.1,0-10H13v1.4C13.5,10.2,14.3,9.3,16.1,9.3L16.1,9.3z M13,10.5C13,10.5,13,10.5,13,10.5L13,10.5L13,10.5z M5,9.5h3v10H5
	V8.9V9.5z"
        />
      </svg>
    );
  }

  private _renderMailIcon(): any {
    return (
      <svg class={this.classes(CSS.icons.mail, CSS.icons.svgIcon)}>
        <path
          d="M14.8,11.7l9.1-7.3C24,4.7,24,4.9,24,5.1v14.6c0,0.3-0.1,0.6-0.3,0.9L14.8,11.7z M12,12.8l11.3-9.1
	c-0.3-0.2-0.6-0.3-0.9-0.3H1.6c-0.3,0-0.6,0.1-0.9,0.3L12,12.8z M14.1,12.4L12,14.1l-2.1-1.7l-8.9,8.9c0.2,0.1,0.4,0.1,0.6,0.1h20.9
	c0.2,0,0.4,0,0.6-0.1L14.1,12.4z M0.1,4.5C0.1,4.7,0,4.9,0,5.1v14.6c0,0.3,0.1,0.6,0.3,0.9l8.9-8.9L0.1,4.5z"
        />
      </svg>
    );
  }
}

export = Share;
