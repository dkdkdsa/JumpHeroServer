"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
let app = (0, express_1.default)();
app.get("/lunch", (req, res) => {
    const data = "20230703";
    const url = `https://ggm.hs.kr/lunch.view?data=${data}`;
    res.json({ id: 1, msg: "ASDF222333444" });
});
app.listen(9090, () => {
    console.log("Start");
    console.log("http://localhost:9090/");
});
