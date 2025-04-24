"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CurrentUser = CurrentUser;
const index_1 = require("../index");
/**
 * Injects currently authorized user.
 * Authorization logic must be defined in routing-controllers settings.
 */
function CurrentUser(options) {
    return function (object, methodName, index) {
        (0, index_1.getMetadataArgsStorage)().params.push({
            type: 'current-user',
            object: object,
            method: methodName,
            index: index,
            parse: false,
            required: options ? options.required : undefined,
        });
    };
}
//# sourceMappingURL=CurrentUser.js.map