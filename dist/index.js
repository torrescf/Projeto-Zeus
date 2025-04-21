"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
require("reflect-metadata");
const express_1 = __importDefault(require("express"));
const data_source_1 = require("./src/config/data-source");
const member_routes_1 = __importDefault(require("./src/routes/member.routes"));
const auth_routes_1 = __importDefault(require("./src/routes/auth.routes"));
const budget_routes_1 = __importDefault(require("./src/routes/budget.routes"));
data_source_1.AppDataSource.initialize()
    .then(() => {
    const app = (0, express_1.default)();
    app.use(express_1.default.json());
    app.use("/auth", auth_routes_1.default);
    app.use("/members", member_routes_1.default);
    app.use("/budgets", budget_routes_1.default);
    const port = parseInt(process.env.PORT || "3000", 10);
    app.listen(port, () => {
        console.log(`Server running on port ${port}`);
    });
})
    .catch((error) => {
    console.error("Error during Data Source initialization", error);
});
//# sourceMappingURL=index.js.map