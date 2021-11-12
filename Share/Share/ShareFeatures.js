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
            function (d, b) { for (var p in b) if (Object.prototype.hasOwnProperty.call(b, p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        if (typeof b !== "function" && b !== null)
            throw new TypeError("Class extends value " + String(b) + " is not a constructor or null");
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
    var ShareFeatures = /** @class */ (function (_super) {
        __extends(ShareFeatures, _super);
        function ShareFeatures(value) {
            var _this = _super.call(this, value) || this;
            _this.embedMap = true;
            _this.shortenLink = true;
            return _this;
        }
        Object.defineProperty(ShareFeatures.prototype, "copyToClipboard", {
            set: function (value) {
                if (!this.shareServices) {
                    console.error("ERROR: Unable to toggle both Share Item AND Copy URL features off.");
                    return;
                }
                this._set("copyToClipboard", value);
            },
            enumerable: false,
            configurable: true
        });
        Object.defineProperty(ShareFeatures.prototype, "shareServices", {
            set: function (value) {
                if (!this.copyToClipboard) {
                    console.error("ERROR: Unable to toggle both Share Item AND Copy URL features off.");
                    return;
                }
                this._set("shareServices", value);
            },
            enumerable: false,
            configurable: true
        });
        __decorate([
            decorators_1.property({ value: true })
        ], ShareFeatures.prototype, "copyToClipboard", null);
        __decorate([
            decorators_1.property({ value: true })
        ], ShareFeatures.prototype, "shareServices", null);
        __decorate([
            decorators_1.property()
        ], ShareFeatures.prototype, "embedMap", void 0);
        __decorate([
            decorators_1.property()
        ], ShareFeatures.prototype, "shortenLink", void 0);
        ShareFeatures = __decorate([
            decorators_1.subclass("ShareFeatures")
        ], ShareFeatures);
        return ShareFeatures;
    }(Accessor));
    return ShareFeatures;
});
//# sourceMappingURL=ShareFeatures.js.map