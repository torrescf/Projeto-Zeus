"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CookieParams = CookieParams;
const index_1 = require("../index");
/**
 * Injects all request's cookies to the controller action parameter.
 * Must be applied on a controller action parameter.
 */
function CookieParams() {
    return function (object, methodName, index) {
        (0, index_1.getMetadataArgsStorage)().params.push({
            type: 'cookies',
            object: object,
            method: methodName,
            index: index,
            parse: false,
            required: false,
        });
    };
}
//# sourceMappingURL=CookieParams.js.map