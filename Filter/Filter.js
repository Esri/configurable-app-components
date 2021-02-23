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
define(["require", "exports", "esri/core/accessorSupport/decorators", "esri/core/watchUtils", "esri/widgets/support/widget", "esri/widgets/Widget", "dojo/i18n!./Filter/nls/resources", "./Filter/FilterViewModel"], function (require, exports, decorators_1, watchUtils_1, widget_1, Widget, i18n, FilterViewModel) {
    "use strict";
    var CSS = {
        base: "filter-list",
        filterContainer: "filter-list__filter-container",
        headerContainerDark: "filter-list__header-container filter-list__header-container--dark",
        headerContainerLight: "filter-list__header-container filter-list__header-container--light",
        resetContainer: "filter-list__reset-container",
        resetBtn: "filter-list__reset-btn",
        filterItem: {
            single: "filter-list__filter-item-container filter-list__filter-item-container--single",
            accordion: "filter-list__filter-item-container filter-list__filter-item-container--accordion",
            light: "filter-list__filter-item-container--light",
            dark: "filter-list__filter-item-container--dark"
        },
        filterItemTitle: "filter-list__filter-title",
        checkboxContainer: "filter-list__checkbox-container"
    };
    var Filter = /** @class */ (function (_super) {
        __extends(Filter, _super);
        // ----------------------------------
        //
        //  Lifecycle methods
        //
        // ----------------------------------
        function Filter(properties) {
            var _this = _super.call(this, properties) || this;
            _this.viewModel = new FilterViewModel();
            return _this;
        }
        Filter.prototype.postInitialize = function () {
            var _this = this;
            this.viewModel.initExpressions();
            this._reset = {
                disabled: this.layerExpressions && this.layerExpressions.length ? false : true,
                color: this.layerExpressions && this.layerExpressions.length ? "blue" : "dark"
            };
            this.own(watchUtils_1.watch(this, "definitionExpression", function () {
                _this.scheduleRender();
            }));
        };
        Filter.prototype.render = function () {
            var filters = this._initFilter();
            var header = this._renderFilterHeader();
            var reset = this._renderReset();
            return (widget_1.tsx("div", { class: CSS.base },
                widget_1.tsx("div", { class: CSS.filterContainer },
                    header,
                    filters,
                    reset)));
        };
        // ----------------------------------
        //
        //  Private methods
        //
        // ----------------------------------
        Filter.prototype._renderFilterHeader = function () {
            return (widget_1.tsx("div", { class: this.theme === "light" ? CSS.headerContainerLight : CSS.headerContainerDark },
                widget_1.tsx("h3", null, i18n.selectFilter)));
        };
        Filter.prototype._renderLayerAccordion = function () {
            var _this = this;
            return (widget_1.tsx("calcite-accordion", { theme: this.theme }, this.layerExpressions.map(function (layerExpression) {
                return _this._renderFilterAccordionItem(layerExpression);
            })));
        };
        Filter.prototype._renderFilterAccordionItem = function (layerExpression) {
            var filter = this._renderFilter(layerExpression);
            return (widget_1.tsx("calcite-accordion-item", { bind: this, "item-title": layerExpression.title, "icon-position": "start", afterCreate: this.viewModel.initLayerHeader }, filter));
        };
        Filter.prototype._renderFilter = function (layerExpression) {
            var _this = this;
            var itemTheme = CSS.filterItem[this.theme];
            return layerExpression.expressions.map(function (expression) {
                return (widget_1.tsx("div", { class: _this._isSingleFilter
                        ? _this.classes(CSS.filterItem.single, itemTheme)
                        : _this.classes(CSS.filterItem.accordion, itemTheme) },
                    widget_1.tsx("div", { class: CSS.filterItemTitle },
                        widget_1.tsx("p", null, expression.name)),
                    widget_1.tsx("div", { class: CSS.checkboxContainer },
                        widget_1.tsx("calcite-checkbox", { scale: "l", checked: expression.checked, theme: _this.theme, afterCreate: _this.viewModel.initCheckbox.bind(_this.viewModel, expression) }))));
            });
        };
        Filter.prototype._renderReset = function () {
            return (widget_1.tsx("div", { class: CSS.resetContainer },
                widget_1.tsx("div", { class: CSS.resetBtn },
                    widget_1.tsx("calcite-button", { bind: this.viewModel, appearance: "outline", width: "full", color: this._reset.color, theme: this.theme, disabled: this._reset.disabled, onclick: this.viewModel.handleResetFilter }, i18n.resetFilter))));
        };
        Filter.prototype._initFilter = function () {
            if (this.layerExpressions) {
                if (this.layerExpressions.length === 1) {
                    this._isSingleFilter = true;
                    return this._renderFilter(this.layerExpressions[0]);
                }
                else if (this.layerExpressions.length > 1) {
                    this._isSingleFilter = false;
                    return this._renderLayerAccordion();
                }
            }
            return;
        };
        __decorate([
            decorators_1.property(),
            decorators_1.aliasOf("viewModel.layerExpressions")
        ], Filter.prototype, "layerExpressions", void 0);
        __decorate([
            decorators_1.property()
        ], Filter.prototype, "viewModel", void 0);
        __decorate([
            decorators_1.property(),
            decorators_1.aliasOf("viewModel.theme")
        ], Filter.prototype, "theme", void 0);
        __decorate([
            decorators_1.aliasOf("viewModel.definitionExpression")
        ], Filter.prototype, "definitionExpression", void 0);
        Filter = __decorate([
            decorators_1.subclass("Filter")
        ], Filter);
        return Filter;
    }(Widget));
    return Filter;
});
//# sourceMappingURL=Filter.js.map