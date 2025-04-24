"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Res = Res;
const index_1 = require("../index");
/**
 * Injects a Response object to the controller action parameter.
 * Must be applied on a controller action parameter.
 */
function Res() {
    return function (object, methodName, index) {
        (0, index_1.getMetadataArgsStorage)().params.push({
            type: 'response',
            object: object,
            method: methodName,
            index: index,
            parse: false,
            required: false,
        });
    };
}
//# sourceMappingURL=Res.js.map