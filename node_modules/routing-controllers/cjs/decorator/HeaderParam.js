"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.HeaderParam = HeaderParam;
const index_1 = require("../index");
/**
 * Injects a request's http header value to the controller action parameter.
 * Must be applied on a controller action parameter.
 */
function HeaderParam(name, options) {
    return function (object, methodName, index) {
        (0, index_1.getMetadataArgsStorage)().params.push({
            type: 'header',
            object: object,
            method: methodName,
            index: index,
            name: name,
            parse: options ? options.parse : false,
            required: options ? options.required : undefined,
            classTransform: options ? options.transform : undefined,
            explicitType: options ? options.type : undefined,
            validate: options ? options.validate : undefined,
        });
    };
}
//# sourceMappingURL=HeaderParam.js.map