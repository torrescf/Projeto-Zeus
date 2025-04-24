"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.All = All;
const index_1 = require("../index");
/**
 * Registers an action to be executed when a request comes on a given route.
 * Must be applied on a controller action.
 */
function All(route, options) {
    return function (object, methodName) {
        (0, index_1.getMetadataArgsStorage)().actions.push({
            type: 'all',
            target: object.constructor,
            method: methodName,
            route: route,
            options,
        });
    };
}
//# sourceMappingURL=All.js.map