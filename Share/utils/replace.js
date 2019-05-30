define(["require", "exports"], function (require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    var TEMPLATE_REGEX = /\{([^\}]+)\}/g;
    function replace(template, map) {
        return template.replace(TEMPLATE_REGEX, typeof map === "object" ? function (_, k) { return map[k]; } : function (_, k) { return map(k); });
    }
    exports.replace = replace;
});
//# sourceMappingURL=replace.js.map