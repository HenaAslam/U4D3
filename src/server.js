import Express from "express";
import authorRouter from "./api/authors/index.js";
import listEndpoints from "express-list-endpoints";
import blogsRouter from "./api/blogs/index.js";
import createHttpError from "http-errors";

import { join } from "path";
import cors from "cors";
import {
  notFoundHandler,
  genericErrorHandler,
  badRequestHandler,
  unauthorizedHandler,
} from "./errorHandlers.js";
const server = Express();
const port = process.env.PORT || 3001;
const publicFolderPath = join(process.cwd(), "./public");
server.use(Express.static(publicFolderPath));
const whitelist = [process.env.FE_DEV_URL, process.env.FE_PROD_URL];
server.use(
  cors({
    origin: (currentOrigin, corsNext) => {
      if (!currentOrigin || whitelist.indexOf(currentOrigin) !== -1) {
        corsNext(null, true);
      } else {
        corsNext(
          createHttpError(
            400,
            `Origin ${currentOrigin} is not in the whitelist!`
          )
        );
      }
    },
  })
);
server.use(Express.json());
server.use("/authors", authorRouter);
server.use("/blogs", blogsRouter);

server.use(badRequestHandler);
server.use(unauthorizedHandler);
server.use(notFoundHandler);
server.use(genericErrorHandler);

server.listen(port, () => {
  // console.table(listEndpoints(server));
  console.log(`server is running on port ${port}`);
});
