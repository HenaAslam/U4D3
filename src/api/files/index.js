import express from "express";
const filesRouter = express.Router();
import { getBlogsJSONReadableStream } from "../../lib/fs-tools.js";
import { pipeline } from "stream";
import { Transform } from "@json2csv/node";

filesRouter.get("/csv", (req, res, next) => {
  try {
    const source = getBlogsJSONReadableStream();
    const destination = res;
    const transform = new Transform({ fields: ["id", "title", "category"] });
    res.setHeader("Content-Disposition", "attachment; filename=blogs.csv");
    pipeline(source, transform, destination, (err) => {
      if (err) {
        console.log(err);
      }
    });
  } catch (error) {
    next(error);
  }
});
export default filesRouter;
