// Copyright 2019 Esri
define(["require", "exports", "tslib", "esri/core/accessorSupport/decorators", "esri/core/Accessor"], function (require, exports, tslib_1, decorators_1, Accessor) {
    "use strict";
    var ShareItem = /** @class */ (function (_super) {
        tslib_1.__extends(ShareItem, _super);
        function ShareItem() {
            var _this = _super !== null && _super.apply(this, arguments) || this;
            _this.id = null;
            _this.name = null;
            _this.className = null;
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
        ], ShareItem.prototype, "className", void 0);
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