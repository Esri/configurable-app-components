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
define(["require", "exports", "tslib", "esri/core/accessorSupport/decorators", "esri/core/Accessor"], function (require, exports, tslib_1, decorators_1, Accessor) {
    "use strict";
    var ShareFeatures = /** @class */ (function (_super) {
        tslib_1.__extends(ShareFeatures, _super);
        function ShareFeatures() {
            var _this = _super !== null && _super.apply(this, arguments) || this;
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
        tslib_1.__decorate([
            decorators_1.property({ value: true })
        ], ShareFeatures.prototype, "copyToClipboard", null);
        tslib_1.__decorate([
            decorators_1.property({ value: true })
        ], ShareFeatures.prototype, "shareServices", null);
        tslib_1.__decorate([
            decorators_1.property()
        ], ShareFeatures.prototype, "embedMap", void 0);
        tslib_1.__decorate([
            decorators_1.property()
        ], ShareFeatures.prototype, "shortenLink", void 0);
        ShareFeatures = tslib_1.__decorate([
            decorators_1.subclass("ShareFeatures")
        ], ShareFeatures);
        return ShareFeatures;
    }(Accessor));
    return ShareFeatures;
});
//# sourceMappingURL=ShareFeatures.js.map