"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Param = Param;
const index_1 = require("../index");
/**
 * Injects a request's route parameter value to the controller action parameter.
 * Must be applied on a controller action parameter.
 */
function Param(name) {
    return function (object, methodName, index) {
        (0, index_1.getMetadataArgsStorage)().params.push({
            type: 'param',
            object: object,
            method: methodName,
            index: index,
            name: name,
            parse: false, // it does not make sense for Param to be parsed
            required: true, // params are always required, because if they are missing router will not match the route
            classTransform: undefined,
        });
    };
}
//# sourceMappingURL=Param.js.map