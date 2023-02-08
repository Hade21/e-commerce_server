import express from "express";
import { config } from "dotenv";
import cors from "cors";
import helmet from "helmet";
import bodyParser from "body-parser";

function main() {
  const app = express();
  const port = process.env.PORT || 3000;

  app.use(cors());
  app.use(helmet());
  app.use(bodyParser.json({ limit: "50mb" }));
  app.use(bodyParser.urlencoded({ limit: "50mb", extended: true }));

  app.get("/", (req, res) => {
    res.send("Hello from Express + Typescript!");
  });
  app.listen(port, () => {
    console.log(`Example app listening on port ${port}!`);
  });
}

main();
