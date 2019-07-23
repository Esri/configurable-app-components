// Copyright 2019 Esri
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
define(["require", "exports", "esri/core/tsSupport/declareExtendsHelper", "esri/core/tsSupport/decorateHelper", "esri/core/accessorSupport/decorators", "esri/core/Accessor"], function (require, exports, __extends, __decorate, decorators_1, Accessor) {
    "use strict";
    var ShareFeatures = /** @class */ (function (_super) {
        __extends(ShareFeatures, _super);
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
            enumerable: true,
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
            enumerable: true,
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
    }(decorators_1.declared(Accessor)));
    return ShareFeatures;
});
//# sourceMappingURL=ShareFeatures.js.map