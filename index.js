import express from "express";
import mongoose from "mongoose";
import path from "path";
import bodyParser from "body-parser";
import appRouter from "./routes";
import serveStatic from "serve-static";
import dataShopHelper from "./dataShopHelper";

const app = express();
const DATABASE_URL =
  process.env.DATABASE_URL || "mongodb://localhost:27017/test";
mongoose.connect(DATABASE_URL, { useNewUrlParser: true });
const db = mongoose.connection;
db.once("open", () => {
  console.log(`Database connection in ${DATABASE_URL}`);
});

app.use(serveStatic(path.join(__dirname, "./public/src")));
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());


app.use(function(req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
  next();
});

app.use(appRouter);

app.listen(3001, () => console.log("server is running in port 3001"));
