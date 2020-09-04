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
define(["require", "exports", "dojo/i18n!./Share/nls/resources", "esri/core/watchUtils", "esri/intl", "esri/core/accessorSupport/decorators", "esri/widgets/Widget", "esri/widgets/support/widget", "./Share/ShareViewModel"], function (require, exports, i18n, watchUtils, intl_1, decorators_1, Widget, widget_1, ShareViewModel) {
    "use strict";
    var CSS = {
        base: "esri-share",
        shareModalStyles: "esri-share__share-modal",
        shareButton: "esri-share__share-button",
        shareModal: {
            shareIframe: {
                iframeContainer: "esri-share__iframe-container",
                iframeTabSectionContainer: "esri-share__iframe-tab-section-container",
                iframeInputContainer: "esri-share__iframe-input-container",
                iframePreview: "esri-share__iframe-preview",
                iframeInput: "esri-share__iframe-input"
            },
            header: {
                heading: "esri-share__heading"
            },
            main: {
                mainHeader: "esri-share__main-header",
                mainHR: "esri-share__hr",
                mainCopy: {
                    copyContainer: "esri-share__copy-container",
                    copyClipboardContainer: "esri-share__copy-clipboard-container"
                },
                mainUrl: {
                    inputGroup: "esri-share__copy-url-group",
                    urlInput: "esri-share__url-input",
                    linkGenerating: "esri-share--link-generating"
                },
                mainShare: {
                    shareContainer: "esri-share__share-container",
                    shareItemContainer: "esri-share__share-item-container",
                    shareIcons: {
                        facebook: "icon-social-facebook",
                        twitter: "icon-social-twitter",
                        email: "icon-social-contact",
                        linkedin: "icon-social-linkedin",
                        pinterest: "icon-social-pinterest",
                        rss: "icon-social-rss"
                    }
                }
            }
        },
        icons: {
            widgetIcon: "esri-icon-share",
            copy: "esri-share__copy-icon",
            svgIcon: "esri-share__svg-icon",
            facebook: "esri-share__facebook-icon",
            twitter: "esri-share__twitter-icon",
            linkedIn: "esri-share__linked-in-icon",
            mail: "esri-share__mail-icon"
        },
        shareIcon: "esri-share__share-icon"
    };
    var Share = /** @class */ (function (_super) {
        __extends(Share, _super);
        function Share(params) {
            var _this = _super.call(this, params) || this;
            _this._shareModal = null;
            _this._beforeCloseIsSet = false;
            _this._iframeInputNode = null;
            _this._urlInputNode = null;
            _this.view = null;
            _this.shareModalOpened = null;
            _this.shareItems = null;
            _this.shareFeatures = null;
            _this.shareUrl = null;
            _this.iconClass = CSS.icons.widgetIcon;
            _this.label = i18n.widgetLabel;
            _this.theme = "light";
            _this.viewModel = new ShareViewModel();
            return _this;
        }
        Share.prototype.postInitialize = function () {
            var _this = this;
            this.own([
                watchUtils.whenTrue(this, "view.ready", function () {
                    _this.own([
                        watchUtils.init(_this, "shareModalOpened", function () {
                            _this._detectWidgetToggle();
                        })
                    ]);
                })
            ]);
        };
        Share.prototype.destroy = function () {
            this._iframeInputNode = null;
            this._urlInputNode = null;
        };
        Share.prototype.render = function () {
            var modal = this._renderShareModal();
            return (widget_1.tsx("div", { class: CSS.base, "aria-labelledby": "shareModal" },
                widget_1.tsx("button", { class: this.classes(CSS.icons.widgetIcon, CSS.shareButton), bind: this, theme: this.theme, title: i18n.heading, onclick: this._toggleShareModal, onkeydown: this._toggleShareModal }),
                modal));
        };
        Share.prototype._toggleShareModal = function () {
            var _shareModal = this._shareModal;
            if (_shareModal.hasAttribute("active")) {
                _shareModal.removeAttribute("active");
                this.shareModalOpened = false;
            }
            else {
                _shareModal.setAttribute("active", "true");
                this.shareModalOpened = true;
            }
        };
        Share.prototype._detectWidgetToggle = function () {
            if (this.shareModalOpened) {
                this._generateUrl();
            }
            this.scheduleRender();
        };
        Share.prototype._copyUrlInput = function () {
            this._urlInputNode.focus();
            this._urlInputNode.setSelectionRange(0, this._urlInputNode.value.length);
            document.execCommand("copy");
            this.scheduleRender();
        };
        Share.prototype._copyIframeInput = function () {
            this._iframeInputNode.focus();
            this._iframeInputNode.setSelectionRange(0, this._iframeInputNode.value.length);
            document.execCommand("copy");
            this.scheduleRender();
        };
        Share.prototype._processShareItem = function (event) {
            var node = event.currentTarget;
            var shareItem = node["data-share-item"];
            var urlTemplate = shareItem.urlTemplate;
            var portalItem = this.get("view.map.portalItem");
            var title = portalItem
                ? intl_1.substitute(i18n.urlTitle, { title: portalItem.title })
                : null;
            var summary = portalItem
                ? intl_1.substitute(i18n.urlSummary, { summary: portalItem.snippet })
                : null;
            this._openUrl(this.shareUrl, title, summary, urlTemplate);
        };
        Share.prototype._generateUrl = function () {
            this.viewModel.generateUrl();
        };
        Share.prototype._openUrl = function (url, title, summary, urlTemplate) {
            var urlToOpen = intl_1.substitute(urlTemplate, {
                url: url,
                title: title,
                summary: summary
            });
            console.log(urlToOpen);
            window.open(urlToOpen);
        };
        Share.prototype._renderShareModal = function () {
            var modalContentNode = this._renderModalContent();
            return (widget_1.tsx("calcite-modal", { bind: this, class: this.classes(CSS.shareModalStyles), "aria-labelledby": "shareModal", afterCreate: widget_1.storeNode, afterUpdate: this._setBeforeClose, "data-modal": this, "data-node-ref": "_shareModal", scale: "s", width: "s", theme: this.theme },
                widget_1.tsx("h3", { slot: "header", id: "shareModal", class: CSS.shareModal.header.heading }, i18n.heading),
                widget_1.tsx("div", { slot: "content" }, modalContentNode)));
        };
        Share.prototype._renderModalContent = function () {
            var sendALinkContentNode = this._renderSendALinkContent();
            var embedMapContentNode = this._renderEmbedMapContent();
            var embedMap = this.shareFeatures.embedMap;
            return embedMap ? (widget_1.tsx("calcite-tabs", null,
                widget_1.tsx("calcite-tab-nav", { slot: "tab-nav" },
                    widget_1.tsx("calcite-tab-title", { active: true }, i18n.sendLink),
                    widget_1.tsx("calcite-tab-title", null, i18n.embedMap)),
                widget_1.tsx("calcite-tab", { active: true }, sendALinkContentNode),
                widget_1.tsx("calcite-tab", null, embedMapContentNode))) : (sendALinkContentNode);
        };
        Share.prototype._renderShareItem = function (shareItem) {
            var name = shareItem.name, iconName = shareItem.iconName;
            return (widget_1.tsx("button", { key: name, bind: this, onclick: this._processShareItem, class: this.classes(CSS.shareIcon, iconName), title: name, "aria-label": name, "data-share-item": shareItem }, shareItem.id === "facebook"
                ? this._renderFacebookIcon()
                : shareItem.id === "twitter"
                    ? this._renderTwitterIcon()
                    : shareItem.id === "linkedin"
                        ? this._renderLinkedInIcon()
                        : shareItem.id === "email"
                            ? this._renderMailIcon()
                            : null));
        };
        Share.prototype._renderShareItems = function () {
            var _this = this;
            var shareServices = this.shareItems;
            var shareIcons = CSS.shareModal.main.mainShare.shareIcons;
            // Assign class names of icons to share item
            shareServices.forEach(function (shareItem) {
                for (var icon in shareIcons) {
                    if (icon === shareItem.id) {
                        shareItem.iconName = shareIcons[shareItem.id];
                    }
                }
            });
            return shareServices
                .toArray()
                .map(function (shareItems) { return _this._renderShareItem(shareItems); });
        };
        Share.prototype._renderShareItemContainer = function () {
            var shareServices = this.shareFeatures.shareServices;
            var state = this.viewModel.state;
            var shareItemNodes = shareServices ? this._renderShareItems() : null;
            var shareItemNode = shareServices
                ? state === "ready" && shareItemNodes.length
                    ? [shareItemNodes]
                    : null
                : null;
            return (widget_1.tsx("div", null, shareServices ? (widget_1.tsx("div", { class: CSS.shareModal.main.mainShare.shareContainer, key: "share-container" },
                widget_1.tsx("span", { class: CSS.shareModal.main.mainHeader }, i18n.subHeading),
                widget_1.tsx("div", { class: CSS.shareModal.main.mainShare.shareItemContainer }, shareItemNode))) : null));
        };
        Share.prototype._renderCopyUrl = function () {
            var copyToClipboard = this.shareFeatures.copyToClipboard;
            return (widget_1.tsx("div", null, copyToClipboard ? (widget_1.tsx("div", { class: CSS.shareModal.main.mainCopy.copyContainer, key: "copy-container" },
                widget_1.tsx("div", { class: CSS.shareModal.main.mainUrl.inputGroup },
                    widget_1.tsx("span", { class: CSS.shareModal.main.mainHeader }, i18n.clipboard),
                    widget_1.tsx("div", { class: CSS.shareModal.main.mainCopy.copyClipboardContainer },
                        widget_1.tsx("calcite-button", { bind: this, onclick: this._copyUrlInput, onkeydown: this._copyUrlInput },
                            widget_1.tsx("calcite-icon", { icon: "copy" })),
                        widget_1.tsx("input", { type: "text", class: CSS.shareModal.main.mainUrl.urlInput, bind: this, value: this.shareUrl, afterCreate: widget_1.storeNode, "data-node-ref": "_urlInputNode", readOnly: true }))))) : null));
        };
        Share.prototype._renderSendALinkContent = function () {
            var copyUrlNode = this._renderCopyUrl();
            var shareServicesNode = this._renderShareItemContainer();
            var _a = this.shareFeatures, shareServices = _a.shareServices, copyToClipboard = _a.copyToClipboard;
            var state = this.viewModel.state;
            return state === "ready" ? (widget_1.tsx("div", null,
                shareServicesNode,
                !copyToClipboard || !shareServices ? null : (widget_1.tsx("hr", { class: CSS.shareModal.main.mainHR })),
                copyUrlNode)) : (widget_1.tsx("calcite-loader", { active: true }));
        };
        Share.prototype._renderCopyIframe = function () {
            var _a = this.viewModel, embedCode = _a.embedCode, state = _a.state;
            return (widget_1.tsx("div", { class: CSS.shareModal.shareIframe.iframeInputContainer },
                widget_1.tsx("calcite-button", { bind: this, onclick: this._copyIframeInput, onkeydown: this._copyIframeInput },
                    widget_1.tsx("calcite-icon", { icon: "copy" })),
                state === "ready" ? (widget_1.tsx("input", { class: CSS.shareModal.shareIframe.iframeInput, type: "text", tabindex: 0, value: embedCode, bind: this, afterCreate: widget_1.storeNode, "data-node-ref": "_iframeInputNode", readOnly: true })) : (widget_1.tsx("div", { class: CSS.shareModal.main.mainUrl.linkGenerating }, i18n.generateLink))));
        };
        Share.prototype._renderEmbedMapContent = function () {
            var embedMap = this.shareFeatures.embedMap;
            var state = this.viewModel.state;
            var copyIframeCodeNode = this._renderCopyIframe();
            return embedMap ? (widget_1.tsx("div", { bind: this }, state === "ready" ? (widget_1.tsx("div", { key: "iframe-tab-section-container", class: CSS.shareModal.shareIframe.iframeTabSectionContainer },
                widget_1.tsx("h2", { class: CSS.shareModal.main.mainHeader }, i18n.clipboard),
                copyIframeCodeNode,
                widget_1.tsx("div", { class: CSS.shareModal.shareIframe.iframeContainer }, embedMap ? (state === "ready" ? (this.shareModalOpened ? (widget_1.tsx("iframe", { class: CSS.shareModal.shareIframe.iframePreview, src: this.shareUrl, tabIndex: "-1", scrolling: "no" })) : null) : null) : null))) : (widget_1.tsx("calcite-loader", { active: true })))) : null;
        };
        Share.prototype._setBeforeClose = function () {
            var _this = this;
            if (this._shareModal && !this._beforeCloseIsSet) {
                this._shareModal.beforeClose = function (node) {
                    return _this._beforeClose(node);
                };
                this._beforeCloseIsSet = true;
            }
        };
        Share.prototype._beforeClose = function (node) {
            var _this = this;
            return new Promise(function (resolve) {
                _this.shareModalOpened = false;
                node.removeAttribute("active");
                resolve();
            });
        };
        Share.prototype._renderFacebookIcon = function () {
            return (widget_1.tsx("svg", { class: this.classes(CSS.icons.facebook, CSS.icons.svgIcon) },
                widget_1.tsx("path", { d: "M2.2,0.5C1.6,0.5,1,1.1,1,1.8v20.5c0,0.7,0.6,1.3,1.3,1.3H13v-10h-3v-3h3V8.1\n\tc0.3-3,2.1-4.6,4.8-4.6C19,3.5,21,3.6,21,3.6v2.9h-2.4C17.1,6.7,17,8.4,17,8.4v2.1h3.3l-0.4,3H17v10h5.7c0.7,0,1.3-0.6,1.3-1.3V1.8\n\tc0-0.7-0.6-1.3-1.3-1.3L2.2,0.5L2.2,0.5z" })));
        };
        Share.prototype._renderTwitterIcon = function () {
            return (widget_1.tsx("svg", { class: this.classes(CSS.icons.twitter, CSS.icons.svgIcon) },
                widget_1.tsx("path", { d: "M24,4.3c-0.8,0.4-1.8,0.7-2.7,0.8c1-0.6,1.7-1.6,2.1-2.8c-0.9,0.6-1.9,1-3,1.2\n\tc-0.9-1-2.1-1.6-3.4-1.6c-2.6,0-4.7,2.3-4.7,5c0,0.4,0,0.8,0.1,1.2C8.4,7.9,4.9,5.9,2.6,2.8C2.2,3.6,2,4.5,2,5.4\n\tc0,1.8,0.8,3.3,2.1,4.2C3.3,9.6,2.6,9.3,1.9,9c0,0,0,0,0,0.1c0,2.4,1.6,4.5,3.8,5c-0.4,0.1-0.8,0.2-1.2,0.2c-0.3,0-0.6,0-0.9-0.1\n\tc0.6,2,2.3,3.5,4.4,3.5c-1.6,1.4-3.7,2.2-5.9,2.2c-0.4,0-0.8,0-1.1-0.1c2.1,1.4,4.6,2.3,7.2,2.3c8.7,0,13.4-7.7,13.4-14.4\n\tc0-0.2,0-0.4,0-0.7C22.6,6.2,23.4,5.3,24,4.3" })));
        };
        Share.prototype._renderLinkedInIcon = function () {
            return (widget_1.tsx("svg", { class: this.classes(CSS.icons.linkedIn, CSS.icons.svgIcon) },
                widget_1.tsx("path", { d: "M2.7,0.5C1.8,0.5,1,1.2,1,2.1v19.7c0,0.9,0.8,1.6,1.7,1.6h19.6c0.9,0,1.7-0.7,1.7-1.6V2.1\n\tc0-0.9-0.8-1.6-1.7-1.6H2.7z M6.2,3.9c1.2,0,1.9,0.8,1.9,1.8c0,1-0.8,1.8-2,1.8h0C5,7.5,4.3,6.7,4.3,5.7C4.3,4.7,5,3.9,6.2,3.9\n\tL6.2,3.9z M16.1,9.3c2.2,0,3.9,1.4,3.9,4.5v5.7h-3v-5.6c0-1.4-0.5-2.4-1.9-2.4c-1.1,0-1.7,0.7-2,1.3C13,13,13,13.4,13,13.7v5.8H9.6\n\tc0,0,0-9.1,0-10H13v1.4C13.5,10.2,14.3,9.3,16.1,9.3L16.1,9.3z M13,10.5C13,10.5,13,10.5,13,10.5L13,10.5L13,10.5z M5,9.5h3v10H5\n\tV8.9V9.5z" })));
        };
        Share.prototype._renderMailIcon = function () {
            return (widget_1.tsx("svg", { class: this.classes(CSS.icons.mail, CSS.icons.svgIcon) },
                widget_1.tsx("path", { d: "M14.8,11.7l9.1-7.3C24,4.7,24,4.9,24,5.1v14.6c0,0.3-0.1,0.6-0.3,0.9L14.8,11.7z M12,12.8l11.3-9.1\n\tc-0.3-0.2-0.6-0.3-0.9-0.3H1.6c-0.3,0-0.6,0.1-0.9,0.3L12,12.8z M14.1,12.4L12,14.1l-2.1-1.7l-8.9,8.9c0.2,0.1,0.4,0.1,0.6,0.1h20.9\n\tc0.2,0,0.4,0,0.6-0.1L14.1,12.4z M0.1,4.5C0.1,4.7,0,4.9,0,5.1v14.6c0,0.3,0.1,0.6,0.3,0.9l8.9-8.9L0.1,4.5z" })));
        };
        __decorate([
            decorators_1.aliasOf("viewModel.view"),
            decorators_1.property()
        ], Share.prototype, "view", void 0);
        __decorate([
            decorators_1.aliasOf("viewModel.shareModalOpened"),
            widget_1.renderable()
        ], Share.prototype, "shareModalOpened", void 0);
        __decorate([
            decorators_1.aliasOf("viewModel.shareItems"),
            widget_1.renderable()
        ], Share.prototype, "shareItems", void 0);
        __decorate([
            decorators_1.aliasOf("viewModel.shareFeatures"),
            widget_1.renderable()
        ], Share.prototype, "shareFeatures", void 0);
        __decorate([
            decorators_1.aliasOf("viewModel.shareUrl"),
            widget_1.renderable()
        ], Share.prototype, "shareUrl", void 0);
        __decorate([
            decorators_1.property()
        ], Share.prototype, "iconClass", void 0);
        __decorate([
            decorators_1.property()
        ], Share.prototype, "label", void 0);
        __decorate([
            decorators_1.property()
        ], Share.prototype, "theme", void 0);
        __decorate([
            widget_1.renderable([
                "viewModel.state",
                "viewModel.embedCode",
                "viewModel.shareFeatures"
            ]),
            decorators_1.property({
                type: ShareViewModel
            })
        ], Share.prototype, "viewModel", void 0);
        __decorate([
            widget_1.accessibleHandler()
        ], Share.prototype, "_toggleShareModal", null);
        __decorate([
            widget_1.accessibleHandler()
        ], Share.prototype, "_copyUrlInput", null);
        __decorate([
            widget_1.accessibleHandler()
        ], Share.prototype, "_copyIframeInput", null);
        __decorate([
            widget_1.accessibleHandler()
        ], Share.prototype, "_processShareItem", null);
        Share = __decorate([
            decorators_1.subclass("Share")
        ], Share);
        return Share;
    }(Widget));
    return Share;
});
//# sourceMappingURL=Share.js.map