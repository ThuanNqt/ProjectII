import express, { Express, Request, Response } from "express";
import dotenv from "dotenv";
dotenv.config();
import * as database from "./config/database";
import route from "./routes/client/index.route";
import routeAdmin from "./routes/admin/index.route";
import methodOverride from "method-override";
import bodyParser from "body-parser";
const port: number | string = process.env.PORT || 3000;

import flash from "express-flash";
import cookieParser from "cookie-parser";
import session from "express-session";
const app: Express = express();
const path = require("path");
import moment from "moment"

// App locals variables
app.locals.moment = moment;

// config tinymce
app.use(
  "/tinymce",
  express.static(path.join(__dirname, "node_modules", "tinymce"))
);

//Connect flash notification
app.use(cookieParser("KeyRandom"));
app.use(
  session({
    secret: "YourSecretKey", // Thêm thuộc tính secret
    cookie: { maxAge: 60000 },
    resave: false, // Thêm để tránh lỗi cảnh báo
    saveUninitialized: true, // Thêm để tránh lỗi cảnh báo
  })
);
app.use(flash());

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

app.get("*", (req:Request, res:Response) => {
  res.render("client/pages/errors/404", {
    pageTitle: "404 Not Found",
  });
});

app.listen(port, () => {
  console.log(`App listening on port ${port}`);
});
