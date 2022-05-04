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
define(["require", "exports", "esri/core/accessorSupport/decorators", "esri/core/watchUtils", "esri/widgets/support/widget", "esri/widgets/Widget", "esri/intl", "dojo/i18n!./FilterList/nls/resources", "./FilterList/FilterListViewModel"], function (require, exports, decorators_1, watchUtils_1, widget_1, Widget, intl_1, i18n, FilterListViewModel) {
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
            accordion: "esri-filter-list__filter-item-container esri-filter-list__filter-item-container--accordion",
            userInput: "esri-filter-list__filter-item-container esri-filter-list__filter-item-container--user-input"
        },
        filterItemTitle: "esri-filter-list__filter-title",
        checkboxContainer: "esri-filter-list__checkbox-container",
        numberInputContainer: "esri-filter-list__number-input-container",
        dateInputContainer: "esri-filter-list__date-picker-input-container",
        operatorDesc: "esri-filter-list__operator-description"
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
            this._locale = intl_1.getLocale();
            this.own([
                watchUtils_1.init(this, "layerExpressions", function () {
                    var _a;
                    var resetLayers = [];
                    (_a = _this.layerExpressions) === null || _a === void 0 ? void 0 : _a.map(function (layerExpression) {
                        resetLayers.push({
                            id: layerExpression.id,
                            definitionExpression: ""
                        });
                    });
                    _this.emit("filterListReset", resetLayers);
                    _this._initExpressions();
                    _this._reset = {
                        disabled: _this.layerExpressions && _this.layerExpressions.length ? false : true,
                        color: _this.layerExpressions && _this.layerExpressions.length ? "blue" : "dark"
                    };
                })
            ]);
        };
        FilterList.prototype.render = function () {
            var filterConfig = this._initFilterConfig();
            var header = this._renderFilterHeader();
            var reset = this.optionalBtnOnClick ? this._renderOptionalButton() : this._renderReset();
            return (widget_1.tsx("div", { class: this.theme === "light" ? CSS.baseLight : CSS.baseDark },
                widget_1.tsx("div", { class: CSS.filterContainer, style: !this._isSingleFilterConfig ? "border:unset" : null },
                    header,
                    filterConfig,
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
            var operator = layerExpression.operator;
            var operatorTranslation = (operator === null || operator === void 0 ? void 0 : operator.trim()) === "OR" ? "orOperator" : "andOperator";
            return (widget_1.tsx("calcite-accordion-item", { key: layerExpression.id, bind: this, "item-title": layerExpression.title, "item-subtitle": i18n === null || i18n === void 0 ? void 0 : i18n[operatorTranslation], "icon-position": "start", afterCreate: this.viewModel.initLayerHeader }, filter));
        };
        FilterList.prototype._renderFilter = function (layerExpression) {
            var _this = this;
            var id = layerExpression.id;
            return layerExpression.expressions.map(function (expression, index) {
                return expression.definitionExpression ? (widget_1.tsx("div", { key: id + "-" + index, class: _this._isSingleFilterConfig ? CSS.filterItem.single : CSS.filterItem.accordion },
                    widget_1.tsx("div", { class: CSS.filterItemTitle },
                        widget_1.tsx("p", null, expression.name)),
                    widget_1.tsx("div", { class: CSS.checkboxContainer },
                        widget_1.tsx("calcite-checkbox", { id: expression.definitionExpressionId, scale: "l", checked: expression.checked, theme: _this.theme, afterCreate: _this.viewModel.initCheckbox.bind(_this.viewModel, id, expression) })))) : (_this._initInput(id, expression));
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
                    widget_1.tsx("calcite-button", { bind: this, appearance: "outline", color: this._reset.color, theme: this.theme, disabled: this._reset.disabled, onclick: this._handleResetFilter }, i18n.resetFilter),
                    widget_1.tsx("calcite-button", { bind: this, appearance: "solid", color: "blue", theme: this.theme, onclick: this.optionalBtnOnClick }, this.optionalBtnText))));
        };
        // HARDCODED IN EN
        FilterList.prototype._renderDatePicker = function (layerId, expression) {
            var _a;
            return (widget_1.tsx("label", { class: CSS.filterItem.userInput },
                widget_1.tsx("span", null, expression === null || expression === void 0 ? void 0 : expression.name),
                widget_1.tsx("div", { class: CSS.dateInputContainer },
                    widget_1.tsx("calcite-input-date-picker", { id: expression === null || expression === void 0 ? void 0 : expression.definitionExpressionId, afterCreate: this.viewModel.handleDatePickerCreate.bind(this.viewModel, expression, layerId), scale: "s", start: expression === null || expression === void 0 ? void 0 : expression.start, end: expression === null || expression === void 0 ? void 0 : expression.end, min: expression === null || expression === void 0 ? void 0 : expression.min, max: expression === null || expression === void 0 ? void 0 : expression.max, locale: (_a = this._locale) !== null && _a !== void 0 ? _a : "en", "next-month-label": "Next month", "prev-month-label": "Previous month", range: true, layout: "vertical", theme: this.theme }),
                    widget_1.tsx("calcite-action", { onclick: this.viewModel.handleResetDatePicker.bind(this.viewModel, expression, layerId), icon: "reset", label: "Reset date picker", scale: "s", theme: this.theme }))));
        };
        // HARDCODED IN EN
        FilterList.prototype._renderNumberSlider = function (layerId, expression) {
            return (expression === null || expression === void 0 ? void 0 : expression.min) && (expression === null || expression === void 0 ? void 0 : expression.max) ? (widget_1.tsx("label", { key: expression === null || expression === void 0 ? void 0 : expression.definitionExpressionId, class: CSS.filterItem.userInput },
                widget_1.tsx("span", null, expression === null || expression === void 0 ? void 0 : expression.name),
                widget_1.tsx("div", { class: CSS.numberInputContainer },
                    widget_1.tsx("calcite-slider", { id: expression === null || expression === void 0 ? void 0 : expression.definitionExpressionId, afterCreate: this.viewModel.handleSliderCreate.bind(this.viewModel, expression, layerId), "min-label": expression.field + ", lower bound", "max-label": expression.field + ", upper bound", step: (expression === null || expression === void 0 ? void 0 : expression.step) ? expression.step : 1, "label-handles": "", snap: "", theme: this.theme })))) : null;
        };
        FilterList.prototype._renderCombobox = function (layerId, expression) {
            var _a;
            var comboItems = (_a = expression === null || expression === void 0 ? void 0 : expression.selectFields) === null || _a === void 0 ? void 0 : _a.map(function (field, index) {
                var name = expression.type === "coded-value" ? expression.codedValues[field] : field;
                return widget_1.tsx("calcite-combobox-item", { key: name + "-" + index, value: field, "text-label": name });
            });
            return (widget_1.tsx("label", { key: "combo-select", class: CSS.filterItem.userInput },
                widget_1.tsx("span", null, expression === null || expression === void 0 ? void 0 : expression.name),
                widget_1.tsx("calcite-combobox", { id: expression === null || expression === void 0 ? void 0 : expression.definitionExpressionId, afterCreate: this.viewModel.handleComboSelectCreate.bind(this.viewModel, expression, layerId), label: expression === null || expression === void 0 ? void 0 : expression.name, placeholder: expression === null || expression === void 0 ? void 0 : expression.placeholder, "selection-mode": "multi", scale: "s", "max-items": "6", theme: this.theme }, comboItems)));
        };
        FilterList.prototype._initFilterConfig = function () {
            if (this.layerExpressions && this.layerExpressions.length) {
                if (this.layerExpressions.length === 1) {
                    var operator = this.layerExpressions[0].operator;
                    var operatorTranslation = (operator === null || operator === void 0 ? void 0 : operator.trim()) === "OR" ? "orOperator" : "andOperator";
                    this._isSingleFilterConfig = true;
                    return (widget_1.tsx("div", null,
                        widget_1.tsx("p", { class: CSS.operatorDesc }, i18n === null || i18n === void 0 ? void 0 : i18n[operatorTranslation]),
                        this._renderFilter(this.layerExpressions[0])));
                }
                else if (this.layerExpressions.length > 1) {
                    this._isSingleFilterConfig = false;
                    return this._renderLayerAccordion();
                }
            }
            return;
        };
        FilterList.prototype._initInput = function (layerId, expression) {
            var type = expression.type;
            if (type === "string" || type == "coded-value") {
                return this._renderCombobox(layerId, expression);
            }
            else if (type === "number" || type == "range") {
                return this._renderNumberSlider(layerId, expression);
            }
            else if (type === "date") {
                return this._renderDatePicker(layerId, expression);
            }
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
            this.scheduleRender();
            this.emit("filterListReset", resetLayers);
        };
        FilterList.prototype._createHeaderTitle = function (header) {
            this._headerTitle = document.createElement(this.headerTag);
            this._headerTitle.innerHTML = i18n.selectFilter;
            header.prepend(this._headerTitle);
        };
        FilterList.prototype._initExpressions = function () {
            var _this = this;
            var _a;
            (_a = this.layerExpressions) === null || _a === void 0 ? void 0 : _a.forEach(function (layerExpression) {
                var _a, _b;
                var id = layerExpression.id;
                var tmpExp = {};
                (_a = layerExpression.expressions) === null || _a === void 0 ? void 0 : _a.forEach(function (expression, index) {
                    var _a;
                    expression.definitionExpressionId = id + "-" + index;
                    if (!expression.checked) {
                        expression.checked = false;
                    }
                    else if (expression.definitionExpression) {
                        tmpExp = (_a = {},
                            _a[expression.definitionExpressionId] = expression.definitionExpression,
                            _a);
                    }
                    _this.viewModel.setInitExpression(id, expression, function () { return _this.scheduleRender(); });
                });
                _this.layers[id] = {
                    expressions: tmpExp,
                    operator: (_b = layerExpression === null || layerExpression === void 0 ? void 0 : layerExpression.operator) !== null && _b !== void 0 ? _b : " AND "
                };
                if (Object.values(tmpExp).length) {
                    _this.viewModel.generateOutput(id);
                }
            });
        };
        __decorate([
            decorators_1.aliasOf("viewModel.map")
        ], FilterList.prototype, "map", void 0);
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
            decorators_1.aliasOf("viewModel.extentSelector")
        ], FilterList.prototype, "extentSelector", void 0);
        __decorate([
            decorators_1.aliasOf("viewModel.extentSelectorConfig")
        ], FilterList.prototype, "extentSelectorConfig", void 0);
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
            decorators_1.aliasOf("viewModel.layers")
        ], FilterList.prototype, "layers", void 0);
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