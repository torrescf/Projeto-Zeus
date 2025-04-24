"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ResponseClassTransformOptions = ResponseClassTransformOptions;
const index_1 = require("../index");
/**
 * Options to be set to class-transformer for the result of the response.
 */
function ResponseClassTransformOptions(options) {
    return function (object, methodName) {
        (0, index_1.getMetadataArgsStorage)().responseHandlers.push({
            type: 'response-class-transform-options',
            value: options,
            target: object.constructor,
            method: methodName,
        });
    };
}
//# sourceMappingURL=ResponseClassTransformOptions.js.map