// dojo
import i18n = require("dojo/i18n!./Info/nls/resources");

// esri.core.accessorSupport
import {
  subclass,
  property,
  aliasOf
} from "esri/core/accessorSupport/decorators";

// esri.widgets
import Widget = require("esri/widgets/Widget");

// esri.widgets.Expand
import Expand = require("esri/widgets/Expand");

// esri.widgets.support
import {
  accessibleHandler,
  tsx
} from "esri/widgets/support/widget";

// esri.views.MapView
import MapView = require("esri/views/MapView");

// esri.views.SceneView
import SceneView = require("esri/views/SceneView");

// esri.core.Collection
import Collection = require("esri/core/Collection");

// InfoItem
import InfoItem = require("./Info/InfoItem");

// InfoViewModel
import InfoViewModel = require("./Info/InfoViewModel");

// ----------------------------------
//
//  CSS Classes
//
// ----------------------------------

const CSS = {
  base: "esri-info",
  widget: "esri-widget esri-widget--panel",
  paginationContainer: "esri-info__pagination-container",
  paginationItem: "esri-info__pagination-item",
  paginationItemSelected: "esri-info__pagination-item--selected",
  titleContainer: "esri-info__title-container",
  infoContent: "esri-info__content",
  back: "esri-info__back",
  backText: "esri-info__back-text",
  buttonContainer: "esri-info__button-container",
  nextButton: "esri-info__next",
  list: "esri-info__list",
  listItem: "esri-info__list-item",
  listItemTextContainer: "esri-info__list-item-text-container",
  stepNumberContainer: "esri-info__number-container",
  stepNumber: "esri-info__number",
  explanationItem: "esri-info__explanation-item",
  contentContainer: "esri-info__content-container",
  lastPageButtons: "esri-info__last-page-button-container",
  backButtonContainer: "esri-info__back-button-container",
  closeButtonContainer: "esri-info__close-button-container",
  singlePageButton: "esri-info__single-page-button",
  calciteStyles: {
    btn: "btn",
    btnClear: "btn-clear"
  },
  icons: {
    widgetIcon: "icon-ui-question icon-ui-flush"
  }
};

@subclass("Info")
class Info extends Widget {
  constructor(value?: unknown) {
    super(value);
  }
  // ----------------------------------
  //
  //  Private Variables
  //
  // ----------------------------------
  private _paginationNodes: any[] = [];
  // ----------------------------------
  //
  //  Properties
  //
  // ----------------------------------

  // view
  @aliasOf("viewModel.view")
  @property()
  view: MapView | SceneView = null;

  // infoContent
  @aliasOf("viewModel.infoContent")
  @property()
  infoContent: Collection<InfoItem> = null;

  // expandWidget
  @aliasOf("viewModel.expandWidget")
  @property()
  expandWidget: Expand = null;

  // selectedItemIndex
  @aliasOf("viewModel.selectedItemIndex")
  @property()
  selectedItemIndex: number = null;

  @property()
  theme = "light";

  // ----------------------------------------------
  //
  //  iconClass and label - Expand Widget Support
  //
  // ----------------------------------------------

  // iconClass
  @property()
  iconClass = "esri-icon-question";

  // label
  @property()
  label = i18n.widgetLabel;

  // viewModel
  @property({
    type: InfoViewModel
  })
  viewModel: InfoViewModel = new InfoViewModel();

  // ----------------------------------
  //
  //  Lifecycle
  //
  // ----------------------------------

  render() {
    const paginationNodes =
      this.infoContent && this.infoContent.length > 1
        ? this._generatePaginationNodes()
        : null;
    const pageNavButtons = this._renderPageNavButtons();
    const content = this._renderContent(this.selectedItemIndex);
    const infoContentItem = this.infoContent.getItemAt(this.selectedItemIndex);
    return (
      <div class={this.classes(CSS.widget, CSS.base)}>
        {paginationNodes ? (
          <ul class={CSS.paginationContainer}>{paginationNodes}</ul>
        ) : null}
        <div key="content-container" class={CSS.contentContainer}>
          <div key="title-container" class={CSS.titleContainer}>
            <h1>{infoContentItem?.title}</h1>
          </div>
          <div key="info-content" class={CSS.infoContent}>
            {content}
          </div>
        </div>
        <div key="button-container" class={CSS.buttonContainer}>
          {pageNavButtons}
        </div>
      </div>
    );
  }

  //   _renderContent
  private _renderContent(selectedItemIndex: number): any {
    return this._generateContentNodes(selectedItemIndex);
  }

  // _generateContentNodes
  private _generateContentNodes(selectedItemIndex: number): any[] {
    const contentItem = this.infoContent.getItemAt(selectedItemIndex);
    if (contentItem?.type === "explanation") {
      return this._generateExplanationNode(contentItem);
    } else if (contentItem?.type === "list") {
      return this._generateListNode(contentItem);
    }
  }

  //   _generateListNode
  private _generateListNode(contentItem: any): any {
    const listItemNodes = contentItem.infoContentItems.map(
      (listItem, listItemIndex) => {
        const listItemNode = this._generateListItemNodes(
          listItem,
          listItemIndex
        );
        return listItemNode;
      }
    );
    return <ul class={CSS.list}>{listItemNodes}</ul>;
  }

  //   _generateListItemNode
  private _generateListItemNodes(listItem: string, listItemIndex: number): any {
    return (
      <li class={CSS.listItem}>
        <div class={CSS.stepNumberContainer}>
          <div class={CSS.stepNumber}>{`${listItemIndex + 1}`}</div>
        </div>
        <div class={CSS.listItemTextContainer}>{listItem}</div>
      </li>
    );
  }

  // _generateExplanationNode
  private _generateExplanationNode(contentItem: any): any {
    const explanationItemNodes = contentItem.infoContentItems.map(
      (explanationItem, explanationItemIndex) => {
        return this._generateExplanationItemNodes(
          explanationItem,
          explanationItemIndex
        );
      }
    );
    return <div>{explanationItemNodes}</div>;
  }

  // _generateExplanationItemNodes
  private _generateExplanationItemNodes(
    explanationItem: string,
    explanationItemIndex: number
  ): any {
    return (
      <p key={explanationItemIndex} class={CSS.explanationItem}>
        {explanationItem}
      </p>
    );
  }

  // _generatePaginationNodes
  private _generatePaginationNodes(): any {
    this._paginationNodes = [];
    return this.infoContent.toArray().map((contentItem, contentItemIndex) => {
      const paginationClass =
        this.selectedItemIndex === contentItemIndex
          ? this.classes(CSS.paginationItem, CSS.paginationItemSelected)
          : CSS.paginationItem;
      const paginationNode = (
        <li
          bind={this}
          onclick={this._goToPage}
          onkeydown={this._goToPage}
          class={paginationClass}
          data-pagination-index={`${contentItemIndex}`}
          aria-selected={
            this.selectedItemIndex === contentItemIndex ? "true" : "false"
          }
          aria-label={`${contentItemIndex + 1} of ${this.infoContent.length}`}
          tabIndex={0}
        />
      );
      this._paginationNodes.push(paginationNode);
      return paginationNode;
    });
  }

  // _renderPageNavButtons
  private _renderPageNavButtons(): any {
    const lastPageButtons = this._renderLastPageButtons();
    const closeButton = this._renderCloseButton();
    const nextButton = this._renderNextButton();
    return (
      <div>
        {this.selectedItemIndex !== this.infoContent.length - 1
          ? nextButton
          : this.infoContent.length > 1
          ? lastPageButtons
          : closeButton}
      </div>
    );
  }

  // _renderNextButton
  private _renderNextButton(): any {
    return (
      <calcite-button
        bind={this}
        onclick={this._nextPage}
        class={CSS.nextButton}
        title={i18n.next}
        theme={this.theme}
      >
        {i18n.next}
      </calcite-button>
    );
  }

  // _closeButton
  private _renderCloseButton(): any {
    return (
      <div class={CSS.lastPageButtons}>
        <calcite-button
          bind={this}
          onclick={this._closeInfoPanel}
          class={CSS.singlePageButton}
          title={i18n.close}
          theme={this.theme}
        >
          {i18n.close}
        </calcite-button>
      </div>
    );
  }

  // _renderNextBackButtons
  private _renderLastPageButtons(): any {
    const back = i18n.back;

    return (
      <div class={CSS.lastPageButtons}>
        <div key="info-back-button-container" class={CSS.backButtonContainer}>
          <calcite-button
            bind={this}
            onclick={this._previousPage}
            title={i18n.back}
            theme={this.theme}
            width="half"
          >
            {back.charAt(0).toUpperCase()}
            {back.substring(1, i18n.back.length)}
          </calcite-button>
        </div>
        <div class={CSS.closeButtonContainer}>
          <calcite-button
            bind={this}
            onclick={this._closeInfoPanel}
            title={i18n.close}
            theme={this.theme}
            appearance="outline"
            width="half"
          >
            {i18n.close}
          </calcite-button>
        </div>
      </div>
    );
  }

  // _goToPage
  @accessibleHandler()
  private _goToPage(event: Event): void {
    this.viewModel.goToPage(event, this._paginationNodes);
    this.scheduleRender();
  }

  // _nextPage
  @accessibleHandler()
  private _nextPage(): void {
    this.viewModel.nextPage(this._paginationNodes);
    this.scheduleRender();
  }

  // _previousPage
  @accessibleHandler()
  private _previousPage(): void {
    this.viewModel.previousPage(this._paginationNodes);
    this.scheduleRender();
  }

  // _closeInfoPanel
  @accessibleHandler()
  private _closeInfoPanel(): void {
    this.viewModel.closeInfoPanel();
    this.scheduleRender();
  }
}

export = Info;
