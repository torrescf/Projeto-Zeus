"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.isPromiseLike = isPromiseLike;
/**
 * Checks if given value is a Promise-like object.
 */
function isPromiseLike(arg) {
    return arg != null && typeof arg === 'object' && typeof arg.then === 'function';
}
//# sourceMappingURL=isPromiseLike.js.map