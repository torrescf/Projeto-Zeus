"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.OnUndefined = OnUndefined;
const index_1 = require("../index");
/**
 * Used to set specific HTTP status code when result returned by a controller action is equal to undefined.
 * Must be applied on a controller action.
 */
function OnUndefined(codeOrError) {
    return function (object, methodName) {
        (0, index_1.getMetadataArgsStorage)().responseHandlers.push({
            type: 'on-undefined',
            target: object.constructor,
            method: methodName,
            value: codeOrError,
        });
    };
}
//# sourceMappingURL=OnUndefined.js.map