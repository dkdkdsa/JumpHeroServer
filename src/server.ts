import express, {Application, Request, Response} from "express";
import nunjucks from "nunjucks";
import { lunchRouter } from "./LunchRouter";
import { userRouter } from "./UserRouter";
import { invenRouter } from "./InvenRouter";
import { tokenChacker } from "./MyJWT";
import { gameRouger } from "./GameRouter";

let app : Application = express();

app.set("view engine", "njk");
nunjucks.configure("views", {express: app, watch: true});

app.use(express.json());
app.use(express.urlencoded({extended:true}));
app.use(tokenChacker);

app.use(invenRouter);
app.use(lunchRouter);
app.use(gameRouger);
app.use(userRouter);

app.listen(9090, () => {

console.log("Start");
console.log("http://localhost:9090/");

});