"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.State = State;
const index_1 = require("../index");
/**
 * Injects a State object to the controller action parameter.
 * Must be applied on a controller action parameter.
 */
function State(objectName) {
    return function (object, methodName, index) {
        (0, index_1.getMetadataArgsStorage)().params.push({
            type: 'state',
            object: object,
            method: methodName,
            index: index,
            name: objectName,
            parse: false, // it does not make sense for Session to be parsed
            required: true, // when we demand session object, it must exist (working session middleware)
            classTransform: undefined,
        });
    };
}
//# sourceMappingURL=State.js.map