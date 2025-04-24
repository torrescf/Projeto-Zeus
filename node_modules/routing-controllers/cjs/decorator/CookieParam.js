"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CookieParam = CookieParam;
const index_1 = require("../index");
/**
 * Injects a request's cookie value to the controller action parameter.
 * Must be applied on a controller action parameter.
 */
function CookieParam(name, options) {
    return function (object, methodName, index) {
        (0, index_1.getMetadataArgsStorage)().params.push({
            type: 'cookie',
            object: object,
            method: methodName,
            index: index,
            name: name,
            parse: options ? options.parse : false,
            required: options ? options.required : undefined,
            explicitType: options ? options.type : undefined,
            classTransform: options ? options.transform : undefined,
            validate: options ? options.validate : undefined,
        });
    };
}
//# sourceMappingURL=CookieParam.js.map