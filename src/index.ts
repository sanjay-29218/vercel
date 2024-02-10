import express from "express";
import cors from "cors";
import simpleGit from "simple-git";
import path from "path";
import { generate, getAllFiles } from "./utils";
import { uploadFile } from "./aws";
import { createClient } from "redis";
const publisher = createClient();
publisher.on("error", (err) => console.log("Redis Client Error", err));
publisher.connect();
const subscriber = createClient();
subscriber.connect();
require("dotenv").config();

const app = express();

app.use(cors());
app.use(express.json());
// exptract repourl
console.log(__dirname);

app.post("/deploy", async (req, res) => {
  const repoUrl = req.body.repoUrl;
  const id = generate();

  //dirname gives absolute path
  await simpleGit().clone(repoUrl, path.join(__dirname, `output/${id}`));
  const allFiles = getAllFiles(path.join(__dirname, `output/${id}`));
  const allPromises = allFiles.map(async (localFilePath) => {
    let str = localFilePath.split("/output");
    let fileName = "output".concat(str[1]);

    await uploadFile(fileName, localFilePath);
  });

  await Promise.all(allPromises.filter((x) => x !== undefined));

  publisher.lPush("build-queue", id);
  publisher.hSet("status", id, "uploaded");
  const status = await publisher.hGet("status", id);
  res.json({ id });
});

app.get("/status", (req, res) => {
  const id = req?.query.id;
  const status = subscriber.hGet("status", id as string);
  res.json({ status });
});

app.listen(3000, () => {
  console.log("listening at 3000");
});
