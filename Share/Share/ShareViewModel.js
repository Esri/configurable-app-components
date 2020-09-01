define(["require", "exports", "tslib", "esri/core/Accessor", "esri/core/Collection", "esri/core/accessorSupport/decorators", "esri/geometry/Point", "esri/request", "./ShareItem", "./ShareFeatures", "esri/geometry/projection", "esri/geometry/SpatialReference"], function (require, exports, tslib_1, Accessor, Collection, decorators_1, Point, esriRequest, ShareItem, ShareFeatures, projection, SpatialReference) {
    "use strict";
    //----------------------------------
    //
    //  Share Item Collection
    //
    //----------------------------------
    var ShareItemCollection = Collection.ofType(ShareItem);
    //----------------------------------
    //
    //  Default Share Items
    //
    //----------------------------------
    var FACEBOOK_ITEM = new ShareItem({
        id: "facebook",
        name: "Facebook",
        urlTemplate: "https://facebook.com/sharer/sharer.php?s=100&u={url}"
    });
    var TWITTER_ITEM = new ShareItem({
        id: "twitter",
        name: "Twitter",
        urlTemplate: "https://twitter.com/intent/tweet?text={title}&url={url}"
    });
    var LINKEDIN_ITEM = new ShareItem({
        id: "linkedin",
        name: "LinkedIn",
        urlTemplate: "https://linkedin.com/sharing/share-offsite/?url={url}&title={title}"
    });
    var EMAIL_ITEM = new ShareItem({
        id: "email",
        name: "E-mail",
        urlTemplate: "mailto:?subject={title}&body={summary}%20{url}"
    });
    //----------------------------------
    //
    //  Shorten URL API
    //
    //----------------------------------
    var SHORTEN_API = "https://arcg.is/prod/shorten";
    var ShareViewModel = /** @class */ (function (_super) {
        tslib_1.__extends(ShareViewModel, _super);
        function ShareViewModel() {
            //----------------------------------
            //
            //  Lifecycle
            //
            //----------------------------------
            var _this = _super !== null && _super.apply(this, arguments) || this;
            //----------------------------------
            //
            //  Private Variables
            //
            //----------------------------------
            // To keep track of widget state
            _this._shortening = false;
            _this._projecting = false;
            //----------------------------------
            //
            //  Properties
            //
            //----------------------------------
            //----------------------------------
            //
            //  view
            //
            //----------------------------------
            _this.view = null;
            //----------------------------------
            //
            // shareModalOpened
            //
            //----------------------------------
            _this.shareModalOpened = null;
            //----------------------------------
            //
            //  shareItems
            //
            //----------------------------------
            _this.shareItems = new ShareItemCollection([
                FACEBOOK_ITEM,
                TWITTER_ITEM,
                LINKEDIN_ITEM,
                EMAIL_ITEM
            ]);
            //----------------------------------
            //
            //  shareFeatures
            //
            //----------------------------------
            _this.shareFeatures = new ShareFeatures();
            //----------------------------------
            //
            //  shareUrl - readOnly
            //
            //----------------------------------
            _this.shareUrl = null;
            return _this;
        }
        ShareViewModel.prototype.destroy = function () {
            this.shareItems.removeAll();
            this.view = null;
        };
        Object.defineProperty(ShareViewModel.prototype, "state", {
            //----------------------------------
            //
            //  state - readOnly
            //
            //----------------------------------
            get: function () {
                var ready = this.get("view.ready");
                return ready
                    ? this._projecting
                        ? "projecting"
                        : this._shortening
                            ? "shortening"
                            : "ready"
                    : this.view
                        ? "loading"
                        : "disabled";
            },
            enumerable: false,
            configurable: true
        });
        Object.defineProperty(ShareViewModel.prototype, "embedCode", {
            //----------------------------------
            //
            //  embedCode - readOnly
            //
            //----------------------------------
            get: function () {
                return "<iframe src=\"" + this.shareUrl + "\" width=\"600\" height=\"450\" frameborder=\"0\" style=\"border:0\" allowfullscreen></iframe>";
            },
            enumerable: false,
            configurable: true
        });
        //----------------------------------
        //
        //  Public Methods
        //
        //----------------------------------
        ShareViewModel.prototype.generateUrl = function () {
            return tslib_1.__awaiter(this, void 0, void 0, function () {
                var url, shortenLink, shortenedUrl;
                return tslib_1.__generator(this, function (_a) {
                    switch (_a.label) {
                        case 0: return [4 /*yield*/, this._generateShareUrl()];
                        case 1:
                            url = _a.sent();
                            shortenLink = this.shareFeatures.shortenLink;
                            if (!shortenLink) return [3 /*break*/, 3];
                            return [4 /*yield*/, this._shorten(url)];
                        case 2:
                            shortenedUrl = _a.sent();
                            this._set("shareUrl", shortenedUrl);
                            return [2 /*return*/, shortenedUrl];
                        case 3:
                            this._set("shareUrl", url);
                            return [2 /*return*/, url];
                    }
                });
            });
        };
        //----------------------------------
        //
        //  Private Methods
        //
        //----------------------------------
        ShareViewModel.prototype._generateShareUrl = function () {
            return tslib_1.__awaiter(this, void 0, void 0, function () {
                var href, _a, x, y, spatialReference, centerPoint, point;
                return tslib_1.__generator(this, function (_b) {
                    switch (_b.label) {
                        case 0:
                            href = window.location.href;
                            // If view is not ready
                            if (!this.get("view.ready")) {
                                return [2 /*return*/, href];
                            }
                            _a = this.view.center, x = _a.x, y = _a.y;
                            spatialReference = this.view.spatialReference;
                            centerPoint = new Point({
                                x: x,
                                y: y,
                                spatialReference: spatialReference
                            });
                            return [4 /*yield*/, this._processPoint(centerPoint)];
                        case 1:
                            point = _b.sent();
                            return [2 /*return*/, this._generateShareUrlParams(point)];
                    }
                });
            });
        };
        ShareViewModel.prototype._processPoint = function (point) {
            return tslib_1.__awaiter(this, void 0, void 0, function () {
                var _a, isWGS84, isWebMercator, point_1, outputSpatialReference, projectedPoint;
                return tslib_1.__generator(this, function (_b) {
                    switch (_b.label) {
                        case 0:
                            _a = point.spatialReference, isWGS84 = _a.isWGS84, isWebMercator = _a.isWebMercator;
                            // If spatial reference is WGS84 or Web Mercator, use longitude/latitude values to generate the share URL parameters
                            if (isWGS84 || isWebMercator) {
                                return [2 /*return*/, point];
                            }
                            // Check if client side projection is not supported
                            if (!projection.isSupported()) {
                                point_1 = new Point({
                                    x: null,
                                    y: null
                                });
                                return [2 /*return*/, point_1];
                            }
                            outputSpatialReference = new SpatialReference({
                                wkid: 4326
                            });
                            this._projecting = true;
                            this.notifyChange("state");
                            return [4 /*yield*/, projection.load()];
                        case 1:
                            _b.sent();
                            projectedPoint = projection.project(point, outputSpatialReference);
                            this._projecting = false;
                            this.notifyChange("state");
                            return [2 /*return*/, projectedPoint];
                    }
                });
            });
        };
        ShareViewModel.prototype._generateShareUrlParams = function (point) {
            var href = window.location.href;
            var longitude = point.longitude, latitude = point.latitude;
            if (longitude === undefined || latitude === undefined) {
                return href;
            }
            var roundedLon = this._roundValue(longitude);
            var roundedLat = this._roundValue(latitude);
            var zoom = this.view.zoom;
            var roundedZoom = this._roundValue(zoom);
            var path = href.split("center")[0];
            // If no "?", then append "?". Otherwise, check for "?" and "="
            var sep = path.indexOf("?") === -1
                ? "?"
                : path.indexOf("?") !== -1 && path.indexOf("=") !== -1
                    ? "&"
                    : "";
            var shareParams = "" + path + sep + "center=" + roundedLon + "," + roundedLat + "&level=" + roundedZoom;
            var type = this.get("view.type");
            // Checks if view.type is 3D, if so add, 3D url parameters
            if (type === "3d") {
                var camera = this.view.camera;
                var heading = camera.heading, fov = camera.fov, tilt = camera.tilt;
                var roundedHeading = this._roundValue(heading);
                var roundedFov = this._roundValue(fov);
                var roundedTilt = this._roundValue(tilt);
                return shareParams + "&heading=" + roundedHeading + "&fov=" + roundedFov + "&tilt=" + roundedTilt;
            }
            // Otherwise, just return original url parameters for 2D
            return shareParams;
        };
        ShareViewModel.prototype._shorten = function (url) {
            return tslib_1.__awaiter(this, void 0, void 0, function () {
                var request, shortUrl;
                return tslib_1.__generator(this, function (_a) {
                    switch (_a.label) {
                        case 0:
                            this._shortening = true;
                            this.notifyChange("state");
                            return [4 /*yield*/, esriRequest(SHORTEN_API, {
                                    query: {
                                        longUrl: url,
                                        f: "json"
                                    }
                                })];
                        case 1:
                            request = _a.sent();
                            this._shortening = false;
                            this.notifyChange("state");
                            shortUrl = request.data && request.data.data && request.data.data.url;
                            if (shortUrl) {
                                return [2 /*return*/, shortUrl];
                            }
                            return [2 /*return*/];
                    }
                });
            });
        };
        ShareViewModel.prototype._roundValue = function (val) {
            return parseFloat(val.toFixed(4));
        };
        tslib_1.__decorate([
            decorators_1.property({
                dependsOn: ["view.ready"],
                readOnly: true
            })
        ], ShareViewModel.prototype, "state", null);
        tslib_1.__decorate([
            decorators_1.property({
                dependsOn: ["shareUrl"],
                readOnly: true
            })
        ], ShareViewModel.prototype, "embedCode", null);
        tslib_1.__decorate([
            decorators_1.property()
        ], ShareViewModel.prototype, "view", void 0);
        tslib_1.__decorate([
            decorators_1.property()
        ], ShareViewModel.prototype, "shareModalOpened", void 0);
        tslib_1.__decorate([
            decorators_1.property({
                type: ShareItemCollection
            })
        ], ShareViewModel.prototype, "shareItems", void 0);
        tslib_1.__decorate([
            decorators_1.property({
                type: ShareFeatures
            })
        ], ShareViewModel.prototype, "shareFeatures", void 0);
        tslib_1.__decorate([
            decorators_1.property({ readOnly: true })
        ], ShareViewModel.prototype, "shareUrl", void 0);
        ShareViewModel = tslib_1.__decorate([
            decorators_1.subclass("ShareViewModel")
        ], ShareViewModel);
        return ShareViewModel;
    }(Accessor));
    return ShareViewModel;
});
//# sourceMappingURL=ShareViewModel.js.map