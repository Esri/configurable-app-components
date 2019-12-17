/// <amd-dependency path="esri/core/tsSupport/declareExtendsHelper" name="__extends" />
/// <amd-dependency path="esri/core/tsSupport/decorateHelper" name="__decorate" />

// dojo
import i18n = require("dojo/i18n!./Share/nls/resources");

// esri.core
import Collection = require("esri/core/Collection");
import watchUtils = require("esri/core/watchUtils");
import { substitute } from "esri/intl";

// esri.core.accessorSupport
import {
  subclass,
  declared,
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

// View Model
import ShareViewModel = require("./Share/ShareViewModel");

// Share Item
import ShareItem = require("./Share/ShareItem");

// ShareFeatures
import ShareFeatures = require("./Share/ShareFeatures");

// PortalItem
import PortalItem = require("esri/portal/PortalItem");

//----------------------------------
//
//  CSS Classes
//
//----------------------------------

const CSS = {
  base: "esri-share",
  shareModalStyles: "esri-share__share-modal",
  shareButton: "esri-share__share-button",
  shareModal: {
    close: "esri-share__close",
    shareIframe: {
      iframeContainer: "esri-share__iframe-container",
      iframeTabSectionContainer: "esri-share__iframe-tab-section-container",
      iframeInputContainer: "esri-share__iframe-input-container",
      iframePreview: "esri-share__iframe-preview",
      iframeInput: "esri-share__iframe-input",
      embedContentContainer: "esri-share__embed-content-container"
    },
    shareTabStyles: {
      tabSection: "esri-share__tab-section",
      iframeTab: "esri-share__iframe-tab-section"
    },
    header: {
      container: "esri-share__header-container",
      heading: "esri-share__heading"
    },
    main: {
      mainContainer: "esri-share__main-container",
      mainHeader: "esri-share__main-header",
      mainHR: "esri-share__hr",
      mainCopy: {
        copyButton: "esri-share__copy-button",
        copyContainer: "esri-share__copy-container",
        copyClipboardUrl: "esri-share__copy-clipboard-url",
        copyClipboardContainer: "esri-share__copy-clipboard-container",
        copyClipboardIframe: "esri-share__copy-clipboard-iframe"
      },
      mainUrl: {
        inputGroup: "esri-share__copy-url-group",
        urlInput: "esri-share__url-input",
        linkGenerating: "esri-share--link-generating"
      },
      mainShare: {
        shareContainer: "esri-share__share-container",
        shareItem: "esri-share__share-item",
        shareItemContainer: "esri-share__share-item-container",
        shareIcons: {
          facebook: "icon-social-facebook",
          twitter: "icon-social-twitter",
          email: "icon-social-contact",
          linkedin: "icon-social-linkedin",
          pinterest: "icon-social-pinterest",
          rss: "icon-social-rss"
        }
      },
      mainInputLabel: "esri-share__input-label"
    },
    calciteStyles: {
      modifier: "modifier-class",
      isActive: "is-active",
      tooltip: "tooltip",
      tooltipTop: "tooltip-top",
      modal: {
        jsModal: "js-modal",
        jsModalToggle: "js-modal-toggle",
        modalContent: "modal-content",
        modalOverlay: "modal-overlay"
      },
      tabs: {
        jsTab: "js-tab",
        jsTabSection: "js-tab-section",
        tabGroup: "js-tab-group",
        tabNav: "tab-nav",
        tabTitle: "tab-title",
        tabContents: "tab-contents",
        tabSection: "tab-section"
      }
    }
  },
  icons: {
    widgetIcon: "esri-icon-share",
    copyIconContainer: "esri-share__copy-icon-container",
    copy: "esri-share__copy-icon",
    esriLoader: "esri-share__loader",
    closeIcon: "icon-ui-close",
    copyToClipboardIcon: "icon-ui-duplicate"
  }
};

@subclass("Share")
class Share extends declared(Widget) {
  constructor(params?: any) {
    super(params);
  }
  //----------------------------------
  //
  //  Private Variables
  //
  //----------------------------------

  // Tabs
  private _linkTabExpanded = true;
  private _embedTabExpanded = false;

  // Tooltips
  private _linkCopied = false;
  private _embedCopied = false;

  //  DOM Nodes //
  // URL Input & Iframe Input
  private _iframeInputNode: HTMLInputElement = null;
  private _urlInputNode: HTMLInputElement = null;

  //----------------------------------
  //
  //  Properties
  //
  //----------------------------------

  //----------------------------------
  //
  //  view
  //
  //----------------------------------

  @aliasOf("viewModel.view")
  @property()
  view: MapView | SceneView = null;

  //----------------------------------
  //
  //  shareModalOpened
  //
  //----------------------------------
  @aliasOf("viewModel.shareModalOpened")
  @renderable()
  shareModalOpened: boolean = null;

  //----------------------------------
  //
  //  shareItems
  //
  //----------------------------------

  @aliasOf("viewModel.shareItems")
  @renderable()
  shareItems: Collection<ShareItem> = null;

  //----------------------------------
  //
  //  shareFeatures
  //
  //----------------------------------
  @aliasOf("viewModel.shareFeatures")
  @renderable()
  shareFeatures: ShareFeatures = null;

  //----------------------------------
  //
  //  shareUrl - readOnly
  //
  //----------------------------------

  @aliasOf("viewModel.shareUrl")
  @renderable()
  shareUrl: string = null;

  //----------------------------------
  //
  //  iconClass and label - Expand Widget Support
  //
  //----------------------------------

  @property()
  iconClass = CSS.icons.widgetIcon;
  @property()
  label = i18n.widgetLabel;

  //----------------------------------
  //
  //  viewModel
  //
  //----------------------------------

  @renderable([
    "viewModel.state",
    "viewModel.embedCode",
    "viewModel.shareFeatures"
  ])
  @property({
    type: ShareViewModel
  })
  viewModel: ShareViewModel = new ShareViewModel();

  //----------------------------------
  //
  //  Lifecycle
  //
  //----------------------------------

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
    const shareModalNode = this._renderShareModal();
    return (
      <div class={CSS.base} aria-labelledby="shareModal">
        <button
          class={this.classes(
            CSS.shareModal.calciteStyles.modal.jsModalToggle,
            CSS.icons.widgetIcon,
            CSS.shareButton
          )}
          bind={this}
          title={i18n.heading}
          onclick={this._toggleShareModal}
          onkeydown={this._toggleShareModal}
        />
        {shareModalNode}
      </div>
    );
  }

  @accessibleHandler()
  private _toggleShareModal(): void {
    this.shareModalOpened = !this.shareModalOpened;
  }

  private _detectWidgetToggle(): void {
    if (this.shareModalOpened) {
      this._generateUrl();
    } else {
      this._removeCopyTooltips();
    }
    this.scheduleRender();
  }

  @accessibleHandler()
  private _copyUrlInput(): void {
    this._urlInputNode.focus();
    this._urlInputNode.setSelectionRange(0, this._urlInputNode.value.length);
    document.execCommand("copy");
    this._linkCopied = true;
    this._embedCopied = false;
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
    this._linkCopied = false;
    this._embedCopied = true;
    this.scheduleRender();
  }

  @accessibleHandler()
  private _linkTab(): void {
    // Link Tab Option
    this._linkTabExpanded = true;
    this._embedTabExpanded = false;
    this.scheduleRender();
  }

  @accessibleHandler()
  private _embedTab(): void {
    // Embed Tab Option
    this._linkTabExpanded = false;
    this._embedTabExpanded = true;
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

  @accessibleHandler()
  private _stopPropagation(e: Event): void {
    e.stopPropagation();
  }

  private _generateUrl(): void {
    this.viewModel.generateUrl();
  }

  private _removeCopyTooltips(): void {
    this._linkCopied = false;
    this._embedCopied = false;
    this.scheduleRender();
  }

  private _openUrl(
    url: string,
    title: string,
    summary: string,
    urlTemplate: string
  ): void {
    const urlToOpen = substitute(urlTemplate, {
      url: encodeURI(url),
      title,
      summary
    });
    window.open(urlToOpen);
  }

  // Render Nodes
  private _renderShareModal(): any {
    const modalContainerNode = this._renderModalContainer();
    const shareModalClass = {
      [CSS.shareModal.calciteStyles.isActive]: this.shareModalOpened
    };
    return (
      <div
        class={this.classes(
          CSS.shareModal.calciteStyles.modal.jsModal,
          CSS.shareModal.calciteStyles.modal.modalOverlay,
          CSS.shareModal.calciteStyles.modifier,
          shareModalClass
        )}
        bind={this}
        onclick={this._toggleShareModal}
        onkeydown={this._toggleShareModal}
      >
        {modalContainerNode}
      </div>
    );
  }

  private _renderModalContainer(): any {
    const modalContentNode = this._renderModalContent();
    return (
      <div
        class={this.classes(
          CSS.shareModalStyles,
          CSS.shareModal.calciteStyles.modal.modalContent
        )}
        tabIndex={0}
        bind={this}
        onclick={this._stopPropagation}
        onkeydown={this._stopPropagation}
      >
        <h1 id="shareModal" class={CSS.shareModal.header.heading}>
          {i18n.heading}
        </h1>
        <div>{modalContentNode}</div>
        <div
          bind={this}
          onclick={this._toggleShareModal}
          onkeydown={this._toggleShareModal}
          class={this.classes(
            CSS.shareModal.calciteStyles.modal.jsModalToggle,
            CSS.shareModal.close,
            CSS.icons.closeIcon
          )}
          aria-label="close-modal"
          tabIndex={0}
        />
      </div>
    );
  }

  private _renderModalContent(): any {
    const { embedMap } = this.shareFeatures;
    const sendALinkContentNode = this._renderSendALinkContent();
    const embedMapContentNode = this._renderEmbedMapContent();
    const linkTabClass = {
      [CSS.shareModal.calciteStyles.isActive]: this._linkTabExpanded
    };
    const embedTabClass = {
      [CSS.shareModal.calciteStyles.isActive]: this._embedTabExpanded
    };
    return (
      <div class={CSS.shareModal.main.mainContainer}>
        <div
          class={this.classes(
            CSS.shareModal.calciteStyles.modifier,
            CSS.shareModal.calciteStyles.tabs.tabGroup
          )}
        >
          {embedMap ? (
            <nav class={CSS.shareModal.calciteStyles.tabs.tabNav}>
              <div
                class={this.classes(
                  CSS.shareModal.calciteStyles.tabs.tabTitle,
                  CSS.shareModal.calciteStyles.tabs.jsTab,
                  linkTabClass
                )}
                bind={this}
                tabIndex={0}
                onclick={this._linkTab}
                onkeydown={this._linkTab}
                aria-expanded={`${this._linkTabExpanded}`}
              >
                {i18n.sendLink}
              </div>
              {embedMap ? (
                <div
                  class={this.classes(
                    CSS.shareModal.calciteStyles.tabs.tabTitle,
                    CSS.shareModal.calciteStyles.tabs.jsTab,
                    embedTabClass
                  )}
                  bind={this}
                  tabIndex={0}
                  onclick={this._embedTab}
                  onkeydown={this._embedTab}
                  aria-expanded={`${this._embedTabExpanded}`}
                >
                  {i18n.embedMap}
                </div>
              ) : null}
            </nav>
          ) : null}
          <section class={CSS.shareModal.calciteStyles.tabs.tabContents}>
            {sendALinkContentNode}
            {embedMapContentNode}
          </section>
        </div>
      </div>
    );
  }

  private _renderShareItem(shareItem: ShareItem): any {
    const { name, className } = shareItem;
    return (
      <div
        class={this.classes(CSS.shareModal.main.mainShare.shareItem, name)}
        key={name}
      >
        <div
          class={className}
          title={name}
          onclick={this._processShareItem}
          onkeydown={this._processShareItem}
          tabIndex={0}
          aria-label={name}
          bind={this}
          data-share-item={shareItem}
          role="button"
        />
      </div>
    );
  }

  private _renderShareItems(): any[] {
    const shareServices = this.shareItems;
    const { shareIcons } = CSS.shareModal.main.mainShare;
    // Assign class names of icons to share item
    shareServices.forEach((shareItem: ShareItem) => {
      for (const icon in shareIcons) {
        if (icon === shareItem.id) {
          shareItem.className = shareIcons[shareItem.id];
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
            <h2 class={CSS.shareModal.main.mainHeader}>{i18n.subHeading}</h2>
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
    const toolTipClasses = {
      [CSS.shareModal.calciteStyles.tooltip]: this._linkCopied,
      [CSS.shareModal.calciteStyles.tooltipTop]: this._linkCopied
    };
    return (
      <div>
        {copyToClipboard ? (
          <div
            class={CSS.shareModal.main.mainCopy.copyContainer}
            key="copy-container"
          >
            <div class={CSS.shareModal.main.mainUrl.inputGroup}>
              <h2 class={CSS.shareModal.main.mainHeader}>{i18n.clipboard}</h2>
              <div class={CSS.shareModal.main.mainCopy.copyClipboardContainer}>
                <div
                  class={this.classes(
                    CSS.shareModal.main.mainCopy.copyClipboardUrl,
                    toolTipClasses
                  )}
                  bind={this}
                  onclick={this._copyUrlInput}
                  onkeydown={this._copyUrlInput}
                  tabIndex={0}
                  aria-label={i18n.copied}
                  role="button"
                >
                  <div
                    class={this.classes(
                      CSS.icons.copy,
                      CSS.icons.copyToClipboardIcon
                    )}
                  />
                </div>
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
    const linkContentClass = {
      [CSS.shareModal.calciteStyles.isActive]: this._linkTabExpanded
    };
    return (
      <article
        class={this.classes(
          CSS.shareModal.calciteStyles.tabs.tabSection,
          CSS.shareModal.calciteStyles.tabs.jsTabSection,
          CSS.shareModal.shareTabStyles.tabSection,
          linkContentClass
        )}
        bind={this}
        aria-expanded={`${this._linkTabExpanded}`}
      >
        {state === "ready" ? (
          <div>
            {shareServicesNode}
            {!copyToClipboard || !shareServices ? null : (
              <hr class={CSS.shareModal.main.mainHR} />
            )}
            {copyUrlNode}
          </div>
        ) : (
          <div class={CSS.icons.esriLoader} />
        )}
      </article>
    );
  }

  private _renderCopyIframe(): any {
    const { embedCode, state } = this.viewModel;
    const toolTipClasses = {
      [CSS.shareModal.calciteStyles.tooltip]: this._embedCopied,
      [CSS.shareModal.calciteStyles.tooltipTop]: this._embedCopied
    };
    return (
      <div class={CSS.shareModal.shareIframe.iframeInputContainer}>
        <div
          class={this.classes(
            CSS.shareModal.main.mainCopy.copyClipboardIframe,
            toolTipClasses
          )}
          bind={this}
          onclick={this._copyIframeInput}
          onkeydown={this._copyIframeInput}
          aria-label={i18n.copied}
          tabIndex={0}
          role="button"
        >
          <div
            class={this.classes(CSS.icons.copyToClipboardIcon, CSS.icons.copy)}
          />
        </div>

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
    const embedContentClass = {
      [CSS.shareModal.calciteStyles.isActive]: this._embedTabExpanded
    };
    return (
      <div class={CSS.shareModal.shareIframe.embedContentContainer}>
        {embedMap ? (
          <article
            class={this.classes(
              CSS.shareModal.calciteStyles.tabs.tabSection,
              CSS.shareModal.calciteStyles.tabs.jsTabSection,
              CSS.shareModal.shareTabStyles.tabSection,
              CSS.shareModal.shareTabStyles.iframeTab,
              embedContentClass
            )}
            bind={this}
            aria-expanded={`${this._embedTabExpanded}`}
          >
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
              <div class={CSS.icons.esriLoader} />
            )}
          </article>
        ) : null}
      </div>
    );
  }
}

export = Share;
