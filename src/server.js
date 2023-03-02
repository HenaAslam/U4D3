import Express from "express";
import authorRouter from "./api/authors/index.js";
import listEndpoints from "express-list-endpoints";
import blogsRouter from "./api/blogs/index.js";
import filesRouter from "./api/files/index.js";
import cors from "cors";
import {
  notFoundHandler,
  genericErrorHandler,
  badRequestHandler,
  unauthorizedHandler,
} from "./errorHandlers.js";
const server = Express();
const port = 3001;
server.use(cors());
server.use(Express.json());
server.use("/authors", authorRouter);
server.use("/blogs", blogsRouter);
server.use("/files", filesRouter);

server.use(badRequestHandler);
server.use(unauthorizedHandler);
server.use(notFoundHandler);
server.use(genericErrorHandler);

server.listen(port, () => {
  // console.table(listEndpoints(server));
  console.log(`server is running on port ${port}`);
});
