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
    var ShareItem = /** @class */ (function (_super) {
        tslib_1.__extends(ShareItem, _super);
        function ShareItem() {
            var _this = _super !== null && _super.apply(this, arguments) || this;
            _this.id = null;
            _this.name = null;
            _this.iconName = null;
            _this.urlTemplate = null;
            return _this;
        }
        tslib_1.__decorate([
            decorators_1.property()
        ], ShareItem.prototype, "id", void 0);
        tslib_1.__decorate([
            decorators_1.property()
        ], ShareItem.prototype, "name", void 0);
        tslib_1.__decorate([
            decorators_1.property()
        ], ShareItem.prototype, "iconName", void 0);
        tslib_1.__decorate([
            decorators_1.property()
        ], ShareItem.prototype, "urlTemplate", void 0);
        ShareItem = tslib_1.__decorate([
            decorators_1.subclass("ShareItem")
        ], ShareItem);
        return ShareItem;
    }(Accessor));
    return ShareItem;
});
//# sourceMappingURL=ShareItem.js.map