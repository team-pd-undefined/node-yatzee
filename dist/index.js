"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var app_1 = __importDefault(require("./app"));
// const test = new Test(2, null, 3);
// console.log(test);
var port = 8080;
app_1.default.listen(port, function () {
    console.log(port + " is running");
});
//# sourceMappingURL=index.js.map