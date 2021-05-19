define(["require", "exports", "tslib", "esri/widgets/support/widget", "esri/core/accessorSupport/decorators", "esri/widgets/Widget", "esri/core/watchUtils"], function (require, exports, tslib_1, widget_1, decorators_1, Widget, watchUtils_1) {
    "use strict";
    var base = "esri-page";
    var CSS = {
        base: base,
        title: base + "__title-text",
        subtitle: base + "__subtitle-text",
        textContainer: base + "__text-container",
        scrollContainer: base + "__scroll-container",
        scrollText: base + "__scroll-text",
        backToCoverPage: base + "__back-to-cover-page"
    };
    var Page = /** @class */ (function (_super) {
        tslib_1.__extends(Page, _super);
        function Page(props) {
            var _this = _super.call(this, props) || this;
            _this.showScrollTop = true;
            _this.title = null;
            _this.titleColor = null;
            _this.subtitle = null;
            _this.subtitleColor = null;
            _this.background = null;
            _this.buttonText = null;
            _this.messages = null;
            return _this;
        }
        Page.prototype.postInitialize = function () {
            var _this = this;
            this._handleDefaultMessages();
            this._handleDocBodyStyles();
            this.own([
                watchUtils_1.whenTrueOnce(this, "showScrollTop", function () {
                    _this._handleShowScrollTop();
                })
            ]);
        };
        Page.prototype.destroy = function () {
            document.body.style.overflow = "";
            document.body.style.position = "";
            document.body.style.top = "0";
            document.body.style.transition = "";
        };
        Page.prototype.render = function () {
            var _a;
            var textContainer = this._renderTextContainer();
            var scrollContainer = this._renderScrollContainer();
            console.log(this.messages);
            return (widget_1.tsx("div", { class: CSS.base, styles: ((_a = this.background) === null || _a === void 0 ? void 0 : _a.backgroundType) === "image"
                    ? this._getBackgroundStyles()
                    : {
                        backgroundColor: this.background.backgroundColor
                    } },
                textContainer,
                scrollContainer));
        };
        Page.prototype._getBackgroundStyles = function () {
            var backgroundImage = this.background.backgroundImage;
            var backgroundImageVal = (backgroundImage === null || backgroundImage === void 0 ? void 0 : backgroundImage.url) ? "url('" + (backgroundImage === null || backgroundImage === void 0 ? void 0 : backgroundImage.url) + "')"
                : "url('https://www.esri.com/content/dam/esrisites/en-us/about/about/images/overview-banner.jpg')";
            return {
                backgroundImage: backgroundImageVal,
                backgroundSize: "cover"
            };
        };
        Page.prototype._renderTextContainer = function () {
            var _a = this, title = _a.title, titleColor = _a.titleColor, subtitle = _a.subtitle, subtitleColor = _a.subtitleColor;
            return (widget_1.tsx("div", { class: CSS.textContainer },
                widget_1.tsx("h1", { class: CSS.title, style: { color: titleColor } }, title),
                widget_1.tsx("span", { class: CSS.subtitle, style: { color: subtitleColor } }, subtitle)));
        };
        Page.prototype._renderScrollContainer = function () {
            return (widget_1.tsx("div", { class: CSS.scrollContainer },
                widget_1.tsx("button", { onclick: this._handleScroll.bind(this) },
                    widget_1.tsx("span", { class: CSS.scrollText }, this.buttonText),
                    widget_1.tsx("calcite-icon", { icon: "chevron-down", scale: "l" }))));
        };
        Page.prototype._handleScroll = function () {
            document.body.style.top = "-100%";
        };
        Page.prototype._handleDefaultMessages = function () {
            var _a = this.messages, title = _a.title, subtitle = _a.subtitle, buttonText = _a.buttonText;
            if (!this.title) {
                this.title = title;
            }
            if (!this.subtitle) {
                this.subtitle = subtitle;
            }
            if (!this.buttonText) {
                this.buttonText = buttonText;
            }
        };
        Page.prototype._handleDocBodyStyles = function () {
            document.body.style.overflow = "hidden";
            document.body.style.position = "relative";
            document.body.style.top = "0";
            document.body.style.transition = "top 0.5s ease 0s";
        };
        Page.prototype._handleShowScrollTop = function () {
            var _this = this;
            var fabElement = document.createElement("calcite-fab");
            fabElement.classList.add(CSS.backToCoverPage);
            fabElement.textEnabled = true;
            fabElement.icon = "chevron-up";
            fabElement.label = this.messages.backToCoverPage;
            fabElement.onclick = function () {
                _this._scrollBackToCoverPage();
            };
            document.body.appendChild(fabElement);
        };
        Page.prototype._scrollBackToCoverPage = function () {
            document.body.style.top = "0";
        };
        tslib_1.__decorate([
            decorators_1.property()
        ], Page.prototype, "showScrollTop", void 0);
        tslib_1.__decorate([
            decorators_1.property()
        ], Page.prototype, "title", void 0);
        tslib_1.__decorate([
            decorators_1.property()
        ], Page.prototype, "titleColor", void 0);
        tslib_1.__decorate([
            decorators_1.property()
        ], Page.prototype, "subtitle", void 0);
        tslib_1.__decorate([
            decorators_1.property()
        ], Page.prototype, "subtitleColor", void 0);
        tslib_1.__decorate([
            decorators_1.property()
        ], Page.prototype, "background", void 0);
        tslib_1.__decorate([
            decorators_1.property()
        ], Page.prototype, "buttonText", void 0);
        tslib_1.__decorate([
            decorators_1.property(),
            widget_1.messageBundle("node_modules/@esri/configurable-app-components/Page/t9n/resources")
        ], Page.prototype, "messages", void 0);
        Page = tslib_1.__decorate([
            decorators_1.subclass("Page")
        ], Page);
        return Page;
    }(Widget));
    return Page;
});
