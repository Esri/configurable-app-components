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
var __assign = (this && this.__assign) || function () {
    __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
define(["require", "exports", "esri/core/accessorSupport/decorators", "esri/core/Accessor", "esri/geometry/support/jsonUtils"], function (require, exports, decorators_1, Accessor, jsonUtils_1) {
    "use strict";
    var accordionStyle = "\n  .accordion-item-content { padding: 0!important; }\n  .accordion-item-header-text { flex-direction: unset!important }";
    var FilterListViewModel = /** @class */ (function (_super) {
        __extends(FilterListViewModel, _super);
        // ----------------------------------
        //
        //  Lifecycle methods
        //
        // ----------------------------------
        function FilterListViewModel(params) {
            var _this = _super.call(this, params) || this;
            _this.layerExpressions = [];
            _this.theme = "light";
            _this.updatingExpression = false;
            _this.extentSelector = false;
            // ----------------------------------
            //
            //  Private Variables
            //
            // ----------------------------------
            _this._layers = {};
            return _this;
        }
        // ----------------------------------
        //
        //  Public methods
        //
        // ----------------------------------
        FilterListViewModel.prototype.initExpressions = function () {
            var _this = this;
            var _a;
            (_a = this.layerExpressions) === null || _a === void 0 ? void 0 : _a.map(function (layerExpression) {
                var _a;
                var tmpExp = {};
                var id = layerExpression.id;
                layerExpression.expressions.map(function (expression) {
                    var _a;
                    if (!expression.checked) {
                        expression.checked = false;
                    }
                    else {
                        tmpExp = (_a = {},
                            _a[expression.id] = expression.definitionExpression,
                            _a);
                    }
                });
                _this._layers[id] = {
                    expressions: tmpExp,
                    operator: (_a = layerExpression === null || layerExpression === void 0 ? void 0 : layerExpression.operator) !== null && _a !== void 0 ? _a : " AND "
                };
                if (Object.keys(tmpExp).length > 0) {
                    _this._generateOutput(id);
                }
            });
        };
        FilterListViewModel.prototype.initLayerHeader = function (accordionItem) {
            var style = document.createElement("style");
            if (this.theme === "dark") {
                accordionStyle += " .accordion-item-header {\n        border-bottom: 1px solid rgb(217, 218, 218)!important;\n        padding: 14px 20px!important;\n      }";
            }
            else if (this.theme === "light") {
                accordionStyle += " .accordion-item-header {\n        background: rgb(244, 243, 244)!important;\n        border-bottom: 1px solid rgb(217, 218, 218)!important;\n        padding: 14px 20px!important;\n      }";
            }
            style.innerHTML = accordionStyle;
            accordionItem.shadowRoot.prepend(style);
        };
        FilterListViewModel.prototype.initCheckbox = function (id, expression, checkbox) {
            var _this = this;
            checkbox.addEventListener("calciteCheckboxChange", function (event) {
                var node = event.target;
                expression.checked = node.checked;
                if (node.checked) {
                    _this._layers[id].expressions[expression.id] = {
                        definitionExpression: expression.definitionExpression
                    };
                }
                else {
                    delete _this._layers[id].expressions[expression.id];
                }
                _this._generateOutput(id);
            });
        };
        FilterListViewModel.prototype.handleSelect = function (expression, layerId, event) {
            var node = event.target;
            if (node.value !== "default") {
                var definitionExpression = expression.field + " = '" + node.value + "'";
                this._layers[layerId].expressions[expression.id] = {
                    definitionExpression: definitionExpression
                };
            }
            else {
                delete this._layers[layerId].expressions[expression.id];
            }
            this._generateOutput(layerId);
        };
        FilterListViewModel.prototype.handleComboSelectCreate = function (expression, layerId, comboBox) {
            comboBox.addEventListener("calciteLookupChange", this.handleComboSelect.bind(this, expression, layerId));
        };
        FilterListViewModel.prototype.handleComboSelect = function (expression, layerId, event) {
            var items = event.detail;
            if (items && items.length) {
                var values = items.map(function (item) { return "'" + item.value + "'"; });
                var definitionExpression = expression.field + " IN (" + values.join(",") + ")";
                this._layers[layerId].expressions[expression.id] = {
                    definitionExpression: definitionExpression
                };
            }
            else {
                delete this._layers[layerId].expressions[expression.id];
            }
            this._generateOutput(layerId);
        };
        FilterListViewModel.prototype.handleNumberInputCreate = function (expression, layerId, type, input) {
            input.addEventListener("calciteInputInput", this.handleNumberInput.bind(this, expression, layerId, type));
        };
        FilterListViewModel.prototype.handleNumberInput = function (expression, layerId, type, event) {
            var value = event.detail.value;
            this._debounceNumberInput(expression, layerId, value, type);
        };
        FilterListViewModel.prototype.handleDatePickerCreate = function (expression, layerId, datePicker) {
            datePicker.start = this._convertToDate(expression === null || expression === void 0 ? void 0 : expression.start);
            datePicker.end = this._convertToDate(expression === null || expression === void 0 ? void 0 : expression.end);
            datePicker.min = this._convertToDate(expression === null || expression === void 0 ? void 0 : expression.min);
            datePicker.max = this._convertToDate(expression === null || expression === void 0 ? void 0 : expression.max);
            datePicker.addEventListener("calciteDatePickerRangeChange", this.handleDatePickerRangeChange.bind(this, expression, layerId));
            datePicker.addEventListener("input", this.handleDatePickerInputChange.bind(this, expression, layerId));
        };
        FilterListViewModel.prototype.handleDatePickerRangeChange = function (expression, layerId, event) {
            var _a, _b;
            this.setExpressionDates((_a = event.detail) === null || _a === void 0 ? void 0 : _a.startDate, (_b = event.detail) === null || _b === void 0 ? void 0 : _b.endDate, expression, layerId);
        };
        FilterListViewModel.prototype.handleDatePickerInputChange = function (expression, layerId, event) {
            var _this = this;
            setTimeout(function () {
                var datePicker = event.target;
                _this.setExpressionDates(datePicker.startAsDate, datePicker.endAsDate, expression, layerId);
            }, 1000);
        };
        FilterListViewModel.prototype.handleResetDatePicker = function (expression, layerId, event) {
            var datePicker = document.getElementById(expression.id.toString());
            datePicker.start = null;
            datePicker.startAsDate = null;
            datePicker.end = null;
            datePicker.endAsDate = null;
            delete this._layers[layerId].expressions[expression.id];
            this._generateOutput(layerId);
        };
        FilterListViewModel.prototype.setExpressionDates = function (startDate, endDate, expression, layerId) {
            var expressions = this._layers[layerId].expressions;
            var start = startDate ? this._convertToDate(Math.floor(startDate.getTime()), true) : null;
            var end = endDate ? this._convertToDate(Math.floor(endDate.getTime()), true) : null;
            var chevron = end && !start ? "<" : !end && start ? ">" : null;
            if (chevron) {
                expressions[expression.id] = {
                    definitionExpression: expression.field + " " + chevron + " '" + (start !== null && start !== void 0 ? start : end) + "'",
                    type: "date"
                };
            }
            else {
                expressions[expression.id] = {
                    definitionExpression: expression.field + " BETWEEN '" + start + "' AND '" + end + "'",
                    type: "date"
                };
            }
            this._generateOutput(layerId);
        };
        FilterListViewModel.prototype.handleResetFilter = function () {
            var _this = this;
            this.layerExpressions.map(function (layerExpression) {
                var id = layerExpression.id;
                layerExpression.expressions.map(function (expression) {
                    var id = expression.id, type = expression.type, useCombobox = expression.useCombobox;
                    if (type) {
                        if (type === "string" && !useCombobox) {
                            var select = document.getElementById(id.toString());
                            select.value = "default";
                        }
                        else if (type === "string" && useCombobox) {
                            var combobox = document.getElementById(id.toString());
                            var wrapper = combobox.shadowRoot.querySelector(".wrapper");
                            for (var i = 0; i < wrapper.children.length; i++) {
                                var child = wrapper.children[i];
                                if (child.nodeName === "CALCITE-CHIP") {
                                    var chip = child;
                                    chip.style.display = "none";
                                }
                            }
                            for (var i = 0; i < combobox.children.length; i++) {
                                var comboboxItem = combobox.children[i];
                                comboboxItem.selected = false;
                            }
                        }
                        else if (type === "date") {
                            var datePicker = document.getElementById(id.toString());
                            datePicker.startAsDate = new Date(expression === null || expression === void 0 ? void 0 : expression.start);
                            datePicker.endAsDate = new Date(expression === null || expression === void 0 ? void 0 : expression.end);
                        }
                    }
                    expression.checked = false;
                });
                _this._layers[id].expressions = {};
            });
        };
        FilterListViewModel.prototype.calculateStatistics = function (layerId, field) {
            var _a, _b;
            return __awaiter(this, void 0, void 0, function () {
                var layer, query, results;
                return __generator(this, function (_c) {
                    switch (_c.label) {
                        case 0:
                            layer = this.map.layers.find(function (_a) {
                                var id = _a.id;
                                return id === layerId;
                            });
                            if (!(layer && layer.type === "feature")) return [3 /*break*/, 2];
                            query = layer.createQuery();
                            query.where = layer.definitionExpression ? layer.definitionExpression : "1=1";
                            if ((_b = (_a = layer === null || layer === void 0 ? void 0 : layer.capabilities) === null || _a === void 0 ? void 0 : _a.query) === null || _b === void 0 ? void 0 : _b.supportsCacheHint) {
                                query.cacheHint = true;
                            }
                            if (!field) return [3 /*break*/, 2];
                            query.outFields = [field];
                            query.returnDistinctValues = true;
                            query.returnGeometry = false;
                            if (this.extentSelector && this.extentSelectorConfig) {
                                query.geometry = this._getExtent(this.extentSelector, this.extentSelectorConfig);
                                query.spatialRelationship = "intersects";
                            }
                            return [4 /*yield*/, layer.queryFeatures(query)];
                        case 1:
                            results = _c.sent();
                            return [2 /*return*/, results === null || results === void 0 ? void 0 : results.features];
                        case 2: return [2 /*return*/, []];
                    }
                });
            });
        };
        // ----------------------------------
        //
        //  Private methods
        //
        // ----------------------------------
        FilterListViewModel.prototype._generateOutput = function (id) {
            var defExpressions = [];
            Object.values(this._layers[id].expressions).forEach(function (_a) {
                var definitionExpression = _a.definitionExpression;
                return defExpressions.push(definitionExpression);
            });
            var newOutput = {
                id: id,
                definitionExpression: defExpressions.join(this._layers[id].operator)
            };
            this.updatingExpression = true;
            this.set("output", newOutput);
        };
        FilterListViewModel.prototype._convertToDate = function (date, includeTime) {
            if (includeTime === void 0) { includeTime = false; }
            if (date) {
                var tmpDate = new Date(date);
                var formattedDate = tmpDate.getFullYear() + "-" + (tmpDate.getMonth() + 1) + "-" + tmpDate.getDate();
                if (includeTime) {
                    var time = tmpDate.getHours() + ":" + tmpDate.getMinutes() + ":" + tmpDate.getSeconds();
                    return formattedDate + " " + time;
                }
                else {
                    return formattedDate;
                }
            }
            return null;
        };
        FilterListViewModel.prototype._getExtent = function (extentSelector, extentSelectorConfig) {
            if (extentSelector && extentSelectorConfig) {
                var constraints = extentSelectorConfig.constraints;
                var newConstraints = __assign({}, constraints);
                var geometry = newConstraints === null || newConstraints === void 0 ? void 0 : newConstraints.geometry;
                if (geometry) {
                    var tmpExtent = jsonUtils_1.fromJSON(geometry);
                    if (tmpExtent && ((tmpExtent === null || tmpExtent === void 0 ? void 0 : tmpExtent.type) === "extent" || (tmpExtent === null || tmpExtent === void 0 ? void 0 : tmpExtent.type) === "polygon")) {
                        return tmpExtent;
                    }
                }
            }
            return null;
        };
        FilterListViewModel.prototype._debounceNumberInput = function (expression, layerId, value, type) {
            var _this = this;
            if (this._timeout) {
                clearTimeout(this._timeout);
            }
            this._timeout = setTimeout(function () {
                _this._updateExpressions(layerId, expression.id, value, type);
                _this._setNumberRangeExpression(expression, layerId, value);
                _this._generateOutput(layerId);
            }, 800);
        };
        FilterListViewModel.prototype._updateExpressions = function (layerId, id, value, type) {
            var _a, _b;
            var _c, _d;
            var expressions = this._layers[layerId].expressions;
            if (expressions[id]) {
                expressions[id] = __assign(__assign({}, expressions[id]), (_a = { type: "number" }, _a[type] = value, _a));
                if (!((_c = expressions[id]) === null || _c === void 0 ? void 0 : _c.min) && !((_d = expressions[id]) === null || _d === void 0 ? void 0 : _d.max)) {
                    delete expressions[id];
                    this._generateOutput(layerId);
                    return;
                }
            }
            else {
                expressions[id] = (_b = {
                        definitionExpression: null,
                        type: "number"
                    },
                    _b[type] = value,
                    _b);
            }
        };
        FilterListViewModel.prototype._setNumberRangeExpression = function (expression, layerId, value) {
            var _a, _b;
            var expressions = this._layers[layerId].expressions;
            var field = expression.field, id = expression.id;
            var displayName = document.getElementById(id + "-name");
            var inputMessage = document.getElementById(id + "-error");
            var min = (_a = expressions[id]) === null || _a === void 0 ? void 0 : _a.min;
            var max = (_b = expressions[id]) === null || _b === void 0 ? void 0 : _b.max;
            var chevron = max && !min ? "<" : !max && min ? ">" : null;
            if (chevron) {
                var exprValue = value ? value : max ? max : min ? min : null;
                if (exprValue) {
                    displayName.style.color = "inherit";
                    inputMessage.active = false;
                    expressions[id].definitionExpression = field + " " + chevron + " " + exprValue;
                }
                else {
                    delete expressions[id];
                }
            }
            else if (Number(max) < Number(min)) {
                displayName.style.color = "red";
                inputMessage.active = true;
            }
            else {
                displayName.style.color = "inherit";
                inputMessage.active = false;
                expressions[id].definitionExpression = field + " BETWEEN " + min + " AND " + max;
            }
        };
        __decorate([
            decorators_1.property()
        ], FilterListViewModel.prototype, "map", void 0);
        __decorate([
            decorators_1.property()
        ], FilterListViewModel.prototype, "layerExpressions", void 0);
        __decorate([
            decorators_1.property()
        ], FilterListViewModel.prototype, "theme", void 0);
        __decorate([
            decorators_1.property()
        ], FilterListViewModel.prototype, "updatingExpression", void 0);
        __decorate([
            decorators_1.property()
        ], FilterListViewModel.prototype, "extentSelector", void 0);
        __decorate([
            decorators_1.property()
        ], FilterListViewModel.prototype, "extentSelectorConfig", void 0);
        __decorate([
            decorators_1.property()
        ], FilterListViewModel.prototype, "output", void 0);
        FilterListViewModel = __decorate([
            decorators_1.subclass("FilterListViewModel")
        ], FilterListViewModel);
        return FilterListViewModel;
    }(Accessor));
    return FilterListViewModel;
});
//# sourceMappingURL=FilterListViewModel.js.map