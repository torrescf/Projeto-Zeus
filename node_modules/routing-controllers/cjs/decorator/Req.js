"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Req = Req;
const index_1 = require("../index");
/**
 * Injects a Request object to the controller action parameter.
 * Must be applied on a controller action parameter.
 */
function Req() {
    return function (object, methodName, index) {
        (0, index_1.getMetadataArgsStorage)().params.push({
            type: 'request',
            object: object,
            method: methodName,
            index: index,
            parse: false,
            required: false,
        });
    };
}
//# sourceMappingURL=Req.js.map