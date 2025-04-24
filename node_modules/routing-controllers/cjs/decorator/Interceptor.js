"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Interceptor = Interceptor;
const index_1 = require("../index");
/**
 * Registers a global interceptor.
 */
function Interceptor(options) {
    return function (target) {
        (0, index_1.getMetadataArgsStorage)().interceptors.push({
            target: target,
            global: true,
            priority: options && options.priority ? options.priority : 0,
        });
    };
}
//# sourceMappingURL=Interceptor.js.map