"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ContentType = ContentType;
const index_1 = require("../index");
/**
 * Sets response Content-Type.
 * Must be applied on a controller action.
 */
function ContentType(contentType) {
    return function (object, methodName) {
        (0, index_1.getMetadataArgsStorage)().responseHandlers.push({
            type: 'content-type',
            target: object.constructor,
            method: methodName,
            value: contentType,
        });
    };
}
//# sourceMappingURL=ContentType.js.map