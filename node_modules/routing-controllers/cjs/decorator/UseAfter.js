"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UseAfter = UseAfter;
const index_1 = require("../index");
/**
 * Specifies a given middleware to be used for controller or controller action AFTER the action executes.
 * Must be set to controller action or controller class.
 */
function UseAfter(...middlewares) {
    return function (objectOrFunction, methodName) {
        middlewares.forEach(middleware => {
            (0, index_1.getMetadataArgsStorage)().uses.push({
                target: methodName ? objectOrFunction.constructor : objectOrFunction,
                method: methodName,
                middleware: middleware,
                afterAction: true,
            });
        });
    };
}
//# sourceMappingURL=UseAfter.js.map