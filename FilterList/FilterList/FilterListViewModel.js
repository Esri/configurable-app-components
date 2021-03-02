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
define(["require", "exports", "esri/core/accessorSupport/decorators", "esri/core/Accessor"], function (require, exports, decorators_1, Accessor) {
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
            // ----------------------------------
            //
            //  Public Variables
            //
            // ----------------------------------
            _this.layerExpressions = [];
            _this.theme = "light";
            _this.updatingExpression = false;
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
            this.layerExpressions.map(function (layerExpression) {
                var tmpExp = [];
                var id = layerExpression.id;
                layerExpression.expressions.map(function (expression) {
                    if (!expression.checked) {
                        expression.checked = false;
                    }
                    else {
                        tmpExp.push(expression.definitionExpression);
                    }
                });
                _this._layers[id] = { expressions: tmpExp };
                if (tmpExp.length > 0) {
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
                    _this._layers[id].expressions.push(expression.definitionExpression);
                }
                else {
                    var i = _this._layers[id].expressions.findIndex(function (expr) { return expr === expression.definitionExpression; });
                    if (i > -1) {
                        _this._layers[id].expressions.splice(i, 1);
                    }
                }
                _this._generateOutput(id);
            });
        };
        FilterListViewModel.prototype.handleResetFilter = function () {
            var _this = this;
            this.layerExpressions.map(function (layerExpression) {
                var id = layerExpression.id;
                layerExpression.expressions.map(function (expression) { return (expression.checked = false); });
                _this._layers[id].expressions = [];
            });
        };
        // ----------------------------------
        //
        //  Private methods
        //
        // ----------------------------------
        FilterListViewModel.prototype._generateOutput = function (id) {
            var newOutput = {
                id: id,
                definitionExpression: this._layers[id].expressions.join(" AND ")
            };
            this.updatingExpression = true;
            this.set("output", newOutput);
        };
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
        ], FilterListViewModel.prototype, "output", void 0);
        FilterListViewModel = __decorate([
            decorators_1.subclass("FilterListViewModel")
        ], FilterListViewModel);
        return FilterListViewModel;
    }(Accessor));
    return FilterListViewModel;
});
//# sourceMappingURL=FilterListViewModel.js.map