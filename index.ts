import express, { Express } from "express";
const app: Express = express();
import dotenv from "dotenv";
dotenv.config();
import * as database from "./config/database";
import route from "./routes/client/index.route";
import routeAdmin from "./routes/admin/index.route";
import methodOverride from "method-override";
import bodyParser from "body-parser";
const port: number | string = process.env.PORT || 3000;

// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: false }));
// parse application/json
app.use(bodyParser.json());

// method override
app.use(methodOverride("_method"));

//connect to database
database.connect();

//config template engine
app.set("views", "./views");
app.set("view engine", "pug");

//config static files
app.use(express.static("public"));

//Routes
route(app);
routeAdmin(app);

app.listen(port, () => {
  console.log(`App listening on port ${port}`);
});
