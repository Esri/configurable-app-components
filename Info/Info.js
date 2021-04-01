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
define(["require", "exports", "dojo/i18n!./Info/nls/resources", "esri/core/accessorSupport/decorators", "esri/widgets/Widget", "esri/widgets/support/widget", "./Info/InfoViewModel"], function (require, exports, i18n, decorators_1, Widget, widget_1, InfoViewModel) {
    "use strict";
    // ----------------------------------
    //
    //  CSS Classes
    //
    // ----------------------------------
    var CSS = {
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
    var Info = /** @class */ (function (_super) {
        __extends(Info, _super);
        function Info(value) {
            var _this = _super.call(this, value) || this;
            // ----------------------------------
            //
            //  Private Variables
            //
            // ----------------------------------
            _this._paginationNodes = [];
            // ----------------------------------
            //
            //  Properties
            //
            // ----------------------------------
            // view
            _this.view = null;
            // infoContent
            _this.infoContent = null;
            // expandWidget
            _this.expandWidget = null;
            // selectedItemIndex
            _this.selectedItemIndex = null;
            _this.theme = "light";
            // ----------------------------------------------
            //
            //  iconClass and label - Expand Widget Support
            //
            // ----------------------------------------------
            // iconClass
            _this.iconClass = "esri-icon-question";
            // label
            _this.label = i18n.widgetLabel;
            // viewModel
            _this.viewModel = new InfoViewModel();
            return _this;
        }
        // ----------------------------------
        //
        //  Lifecycle
        //
        // ----------------------------------
        Info.prototype.render = function () {
            var paginationNodes = this.infoContent && this.infoContent.length > 1
                ? this._generatePaginationNodes()
                : null;
            var pageNavButtons = this._renderPageNavButtons();
            var content = this._renderContent(this.selectedItemIndex);
            var infoContentItem = this.infoContent.getItemAt(this.selectedItemIndex);
            return (widget_1.tsx("div", { class: this.classes(CSS.widget, CSS.base) },
                paginationNodes ? (widget_1.tsx("ul", { class: CSS.paginationContainer }, paginationNodes)) : null,
                widget_1.tsx("div", { key: "content-container", class: CSS.contentContainer },
                    widget_1.tsx("div", { key: "title-container", class: CSS.titleContainer },
                        widget_1.tsx("h1", null, infoContentItem === null || infoContentItem === void 0 ? void 0 : infoContentItem.title)),
                    widget_1.tsx("div", { key: "info-content", class: CSS.infoContent }, content)),
                widget_1.tsx("div", { key: "button-container", class: CSS.buttonContainer }, pageNavButtons)));
        };
        //   _renderContent
        Info.prototype._renderContent = function (selectedItemIndex) {
            return this._generateContentNodes(selectedItemIndex);
        };
        // _generateContentNodes
        Info.prototype._generateContentNodes = function (selectedItemIndex) {
            var contentItem = this.infoContent.getItemAt(selectedItemIndex);
            if ((contentItem === null || contentItem === void 0 ? void 0 : contentItem.type) === "explanation") {
                return this._generateExplanationNode(contentItem);
            }
            else if ((contentItem === null || contentItem === void 0 ? void 0 : contentItem.type) === "list") {
                return this._generateListNode(contentItem);
            }
        };
        //   _generateListNode
        Info.prototype._generateListNode = function (contentItem) {
            var _this = this;
            var listItemNodes = contentItem.infoContentItems.map(function (listItem, listItemIndex) {
                var listItemNode = _this._generateListItemNodes(listItem, listItemIndex);
                return listItemNode;
            });
            return widget_1.tsx("ul", { class: CSS.list }, listItemNodes);
        };
        //   _generateListItemNode
        Info.prototype._generateListItemNodes = function (listItem, listItemIndex) {
            return (widget_1.tsx("li", { class: CSS.listItem },
                widget_1.tsx("div", { class: CSS.stepNumberContainer },
                    widget_1.tsx("div", { class: CSS.stepNumber }, "" + (listItemIndex + 1))),
                widget_1.tsx("div", { class: CSS.listItemTextContainer }, listItem)));
        };
        // _generateExplanationNode
        Info.prototype._generateExplanationNode = function (contentItem) {
            var _this = this;
            var explanationItemNodes = contentItem.infoContentItems.map(function (explanationItem, explanationItemIndex) {
                return _this._generateExplanationItemNodes(explanationItem, explanationItemIndex);
            });
            return widget_1.tsx("div", null, explanationItemNodes);
        };
        // _generateExplanationItemNodes
        Info.prototype._generateExplanationItemNodes = function (explanationItem, explanationItemIndex) {
            return (widget_1.tsx("p", { key: explanationItemIndex, class: CSS.explanationItem }, explanationItem));
        };
        // _generatePaginationNodes
        Info.prototype._generatePaginationNodes = function () {
            var _this = this;
            this._paginationNodes = [];
            return this.infoContent.toArray().map(function (contentItem, contentItemIndex) {
                var paginationClass = _this.selectedItemIndex === contentItemIndex
                    ? _this.classes(CSS.paginationItem, CSS.paginationItemSelected)
                    : CSS.paginationItem;
                var paginationNode = (widget_1.tsx("li", { bind: _this, onclick: _this._goToPage, onkeydown: _this._goToPage, class: paginationClass, "data-pagination-index": "" + contentItemIndex, "aria-selected": _this.selectedItemIndex === contentItemIndex ? "true" : "false", "aria-label": contentItemIndex + 1 + " of " + _this.infoContent.length, tabIndex: 0 }));
                _this._paginationNodes.push(paginationNode);
                return paginationNode;
            });
        };
        // _renderPageNavButtons
        Info.prototype._renderPageNavButtons = function () {
            var lastPageButtons = this._renderLastPageButtons();
            var closeButton = this._renderCloseButton();
            var nextButton = this._renderNextButton();
            return (widget_1.tsx("div", null, this.selectedItemIndex !== this.infoContent.length - 1
                ? nextButton
                : this.infoContent.length > 1
                    ? lastPageButtons
                    : closeButton));
        };
        // _renderNextButton
        Info.prototype._renderNextButton = function () {
            return (widget_1.tsx("calcite-button", { bind: this, onclick: this._nextPage, class: CSS.nextButton, title: i18n.next, theme: this.theme }, i18n.next));
        };
        // _closeButton
        Info.prototype._renderCloseButton = function () {
            return (widget_1.tsx("div", { class: CSS.lastPageButtons },
                widget_1.tsx("calcite-button", { bind: this, onclick: this._closeInfoPanel, class: CSS.singlePageButton, title: i18n.close, theme: this.theme }, i18n.close)));
        };
        // _renderNextBackButtons
        Info.prototype._renderLastPageButtons = function () {
            var back = i18n.back;
            return (widget_1.tsx("div", { class: CSS.lastPageButtons },
                widget_1.tsx("div", { key: "info-back-button-container", class: CSS.backButtonContainer },
                    widget_1.tsx("calcite-button", { bind: this, onclick: this._previousPage, title: i18n.back, theme: this.theme, width: "half" },
                        back.charAt(0).toUpperCase(),
                        back.substring(1, i18n.back.length))),
                widget_1.tsx("div", { class: CSS.closeButtonContainer },
                    widget_1.tsx("calcite-button", { bind: this, onclick: this._closeInfoPanel, title: i18n.close, theme: this.theme, appearance: "outline", width: "half" }, i18n.close))));
        };
        // _goToPage
        Info.prototype._goToPage = function (event) {
            this.viewModel.goToPage(event, this._paginationNodes);
            this.scheduleRender();
        };
        // _nextPage
        Info.prototype._nextPage = function () {
            this.viewModel.nextPage(this._paginationNodes);
            this.scheduleRender();
        };
        // _previousPage
        Info.prototype._previousPage = function () {
            this.viewModel.previousPage(this._paginationNodes);
            this.scheduleRender();
        };
        // _closeInfoPanel
        Info.prototype._closeInfoPanel = function () {
            this.viewModel.closeInfoPanel();
            this.scheduleRender();
        };
        __decorate([
            decorators_1.aliasOf("viewModel.view"),
            decorators_1.property()
        ], Info.prototype, "view", void 0);
        __decorate([
            decorators_1.aliasOf("viewModel.infoContent"),
            decorators_1.property()
        ], Info.prototype, "infoContent", void 0);
        __decorate([
            decorators_1.aliasOf("viewModel.expandWidget"),
            decorators_1.property()
        ], Info.prototype, "expandWidget", void 0);
        __decorate([
            decorators_1.aliasOf("viewModel.selectedItemIndex"),
            decorators_1.property()
        ], Info.prototype, "selectedItemIndex", void 0);
        __decorate([
            decorators_1.property()
        ], Info.prototype, "theme", void 0);
        __decorate([
            decorators_1.property()
        ], Info.prototype, "iconClass", void 0);
        __decorate([
            decorators_1.property()
        ], Info.prototype, "label", void 0);
        __decorate([
            decorators_1.property({
                type: InfoViewModel
            })
        ], Info.prototype, "viewModel", void 0);
        __decorate([
            widget_1.accessibleHandler()
        ], Info.prototype, "_goToPage", null);
        __decorate([
            widget_1.accessibleHandler()
        ], Info.prototype, "_nextPage", null);
        __decorate([
            widget_1.accessibleHandler()
        ], Info.prototype, "_previousPage", null);
        __decorate([
            widget_1.accessibleHandler()
        ], Info.prototype, "_closeInfoPanel", null);
        Info = __decorate([
            decorators_1.subclass("Info")
        ], Info);
        return Info;
    }(Widget));
    return Info;
});
//# sourceMappingURL=Info.js.map