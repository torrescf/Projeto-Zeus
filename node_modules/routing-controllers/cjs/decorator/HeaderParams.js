"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.HeaderParams = HeaderParams;
const index_1 = require("../index");
/**
 * Injects all request's http headers to the controller action parameter.
 * Must be applied on a controller action parameter.
 */
function HeaderParams() {
    return function (object, methodName, index) {
        (0, index_1.getMetadataArgsStorage)().params.push({
            type: 'headers',
            object: object,
            method: methodName,
            index: index,
            parse: false,
            required: false,
        });
    };
}
//# sourceMappingURL=HeaderParams.js.map