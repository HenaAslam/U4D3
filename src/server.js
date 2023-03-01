import Express from "express";
import authorRouter from "./api/authors/index.js";
import listEndpoints from "express-list-endpoints";
import blogsRouter from "./api/blogs/index.js";
import { badRequestHandler } from "./errorHandlers.js";
import { notFoundHandler } from "./errorHandlers.js";

const server = Express();
server.use(Express.json());
server.use("/authors", authorRouter);
server.use("/blogs", blogsRouter);

server.use(badRequestHandler);
server.use(notFoundHandler);
const port = 3001;
server.listen(port, () => {
  // console.table(listEndpoints(server));
  console.log(`server is running on port ${port}`);
});
