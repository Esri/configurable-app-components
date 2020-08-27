// Copyright 2019 Esri
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