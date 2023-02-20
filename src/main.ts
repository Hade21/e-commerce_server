import express from "express";
import cors from "cors";
import bodyParser from "body-parser";
import mongoose from "mongoose";
import config from "./config/config";
import { dbConnect } from "./config/dbConnect";

function app() {
  const app = express();
  const PORT = config.PORT;
  console.log(PORT);

  dbConnect();

  app.use(cors());
  app.use(bodyParser.json({ limit: "50mb" }));
  app.use(bodyParser.urlencoded({ limit: "50mb", extended: true }));
}

app();
