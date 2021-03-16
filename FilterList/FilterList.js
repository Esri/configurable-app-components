// Copyright 2021 Esri
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
define(["require", "exports", "esri/core/accessorSupport/decorators", "esri/core/watchUtils", "esri/widgets/support/widget", "esri/widgets/Widget", "dojo/i18n!./FilterList/nls/resources", "./FilterList/FilterListViewModel"], function (require, exports, decorators_1, watchUtils_1, widget_1, Widget, i18n, FilterListViewModel) {
    "use strict";
    var CSS = {
        baseDark: "esri-filter-list esri-filter-list--dark",
        baseLight: "esri-filter-list esri-filter-list--light",
        filterContainer: "esri-filter-list__filter-container",
        headerContainer: "esri-filter-list__header-container",
        resetContainer: "esri-filter-list__reset-container",
        resetBtn: "esri-filter-list__reset-btn",
        optionalBtn: "esri-filter-list__optional-btn",
        filterItem: {
            single: "esri-filter-list__filter-item-container esri-filter-list__filter-item-container--single",
            accordion: "esri-filter-list__filter-item-container esri-filter-list__filter-item-container--accordion"
        },
        filterItemTitle: "esri-filter-list__filter-title",
        checkboxContainer: "esri-filter-list__checkbox-container"
    };
    var FilterList = /** @class */ (function (_super) {
        __extends(FilterList, _super);
        // ----------------------------------
        //
        //  Lifecycle methods
        //
        // ----------------------------------
        function FilterList(properties) {
            var _this = _super.call(this, properties) || this;
            _this.viewModel = new FilterListViewModel();
            _this.headerTag = "h3";
            _this.optionalBtnText = "Close Filter";
            return _this;
        }
        FilterList.prototype.postInitialize = function () {
            var _this = this;
            this.viewModel.initExpressions();
            this._reset = {
                disabled: this.layerExpressions && this.layerExpressions.length ? false : true,
                color: this.layerExpressions && this.layerExpressions.length ? "blue" : "dark"
            };
            this.own(watchUtils_1.whenTrue(this, "updatingExpression", function () {
                _this.scheduleRender();
                _this.updatingExpression = false;
            }));
        };
        FilterList.prototype.render = function () {
            var filterList = this._initFilterList();
            var header = this._renderFilterHeader();
            var reset = this.optionalBtnOnClick ? this._renderOptionalButton() : this._renderReset();
            return (widget_1.tsx("div", { class: this.theme === "light" ? CSS.baseLight : CSS.baseDark },
                widget_1.tsx("div", { class: CSS.filterContainer },
                    header,
                    filterList,
                    reset)));
        };
        // ----------------------------------
        //
        //  Private methods
        //
        // ----------------------------------
        FilterList.prototype._renderFilterHeader = function () {
            return widget_1.tsx("div", { bind: this, afterCreate: this._createHeaderTitle, class: CSS.headerContainer });
        };
        FilterList.prototype._renderLayerAccordion = function () {
            var _this = this;
            return (widget_1.tsx("calcite-accordion", { theme: this.theme }, this.layerExpressions.map(function (layerExpression) {
                return _this._renderFilterAccordionItem(layerExpression);
            })));
        };
        FilterList.prototype._renderFilterAccordionItem = function (layerExpression) {
            var filter = this._renderFilter(layerExpression);
            return (widget_1.tsx("calcite-accordion-item", { key: layerExpression.id, bind: this, "item-title": layerExpression.title, "icon-position": "start", afterCreate: this.viewModel.initLayerHeader }, filter));
        };
        FilterList.prototype._renderFilter = function (layerExpression) {
            var _this = this;
            var id = layerExpression.id;
            return layerExpression.expressions.map(function (expression, index) {
                return (widget_1.tsx("div", { key: id + "-" + index, class: _this._isSingleFilterList ? CSS.filterItem.single : CSS.filterItem.accordion },
                    widget_1.tsx("div", { class: CSS.filterItemTitle },
                        widget_1.tsx("p", null, expression.name)),
                    widget_1.tsx("div", { class: CSS.checkboxContainer },
                        widget_1.tsx("calcite-checkbox", { scale: "l", checked: expression.checked, theme: _this.theme, afterCreate: _this.viewModel.initCheckbox.bind(_this.viewModel, id, expression) }))));
            });
        };
        FilterList.prototype._renderReset = function () {
            return (widget_1.tsx("div", { class: CSS.resetContainer },
                widget_1.tsx("div", { class: CSS.resetBtn },
                    widget_1.tsx("calcite-button", { bind: this, appearance: "outline", width: "half", color: this._reset.color, theme: this.theme, disabled: this._reset.disabled, onclick: this._handleResetFilter }, i18n.resetFilter))));
        };
        FilterList.prototype._renderOptionalButton = function () {
            return (widget_1.tsx("div", { class: CSS.resetContainer },
                widget_1.tsx("div", { class: CSS.optionalBtn },
                    widget_1.tsx("calcite-button", { bind: this, appearance: "outline", width: "half", color: this._reset.color, theme: this.theme, disabled: this._reset.disabled, onclick: this._handleResetFilter }, i18n.resetFilter),
                    widget_1.tsx("calcite-button", { bind: this, appearance: "solid", width: "half", color: "blue", theme: this.theme, onclick: this.optionalBtnOnClick }, this.optionalBtnText))));
        };
        FilterList.prototype._initFilterList = function () {
            if (this.layerExpressions) {
                if (this.layerExpressions.length === 1) {
                    this._isSingleFilterList = true;
                    return this._renderFilter(this.layerExpressions[0]);
                }
                else if (this.layerExpressions.length > 1) {
                    this._isSingleFilterList = false;
                    return this._renderLayerAccordion();
                }
            }
            return;
        };
        FilterList.prototype._handleResetFilter = function () {
            var resetLayers = [];
            this.layerExpressions.map(function (layerExpression) {
                resetLayers.push({
                    id: layerExpression.id,
                    definitionExpression: ""
                });
            });
            this.viewModel.handleResetFilter();
            this.emit("filterListReset", resetLayers);
        };
        FilterList.prototype._createHeaderTitle = function (header) {
            this._headerTitle = document.createElement(this.headerTag);
            this._headerTitle.innerHTML = i18n.selectFilter;
            header.prepend(this._headerTitle);
        };
        __decorate([
            decorators_1.aliasOf("viewModel.layerExpressions")
        ], FilterList.prototype, "layerExpressions", void 0);
        __decorate([
            decorators_1.property()
        ], FilterList.prototype, "viewModel", void 0);
        __decorate([
            decorators_1.aliasOf("viewModel.theme")
        ], FilterList.prototype, "theme", void 0);
        __decorate([
            decorators_1.aliasOf("viewModel.updatingExpression")
        ], FilterList.prototype, "updatingExpression", void 0);
        __decorate([
            decorators_1.property()
        ], FilterList.prototype, "headerTag", void 0);
        __decorate([
            decorators_1.property()
        ], FilterList.prototype, "optionalBtnText", void 0);
        __decorate([
            decorators_1.property()
        ], FilterList.prototype, "optionalBtnOnClick", void 0);
        __decorate([
            decorators_1.aliasOf("viewModel.output")
        ], FilterList.prototype, "output", void 0);
        FilterList = __decorate([
            decorators_1.subclass("FilterList")
        ], FilterList);
        return FilterList;
    }(Widget));
    return FilterList;
});
//# sourceMappingURL=FilterList.js.map