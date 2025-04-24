"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Redirect = Redirect;
const index_1 = require("../index");
/**
 * Sets Redirect header with given value to the response.
 * Must be applied on a controller action.
 */
function Redirect(url) {
    return function (object, methodName) {
        (0, index_1.getMetadataArgsStorage)().responseHandlers.push({
            type: 'redirect',
            target: object.constructor,
            method: methodName,
            value: url,
        });
    };
}
//# sourceMappingURL=Redirect.js.map