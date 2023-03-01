import Express from "express";
import fs from "fs";
import { fileURLToPath } from "url";
import { dirname, join } from "path";
import uniqid from "uniqid";
import httpErrors from "http-errors";
import { checkBlogSchema, triggerBadRequest } from "./validator.js";

const { NotFound } = httpErrors;
const blogsRouter = Express.Router();
const blogsJSONPath = join(
  dirname(fileURLToPath(import.meta.url)),
  "blogs.json"
);
const getBlogs = () => JSON.parse(fs.readFileSync(blogsJSONPath));
const writeBlogs = (array) =>
  fs.writeFileSync(blogsJSONPath, JSON.stringify(array));

blogsRouter.get("/", (req, res, next) => {
  try {
    const blogsArray = getBlogs();
    res.send(blogsArray);
  } catch (error) {
    next(error);
  }
});

blogsRouter.get("/:blogId", (req, res, next) => {
  try {
    const blogsArray = getBlogs();
    const blog = blogsArray.find((blog) => blog.id === req.params.blogId);
    if (blog) {
      res.send(blog);
    } else {
      next(NotFound(`Blog with id ${req.params.blogId} is not found!`));
    }
  } catch (error) {
    next(error);
  }
});

blogsRouter.post("/", checkBlogSchema, triggerBadRequest, (req, res, next) => {
  try {
    const newBlog = {
      ...req.body,
      createdAt: new Date(),
      updatedAt: new Date(),
      id: uniqid(),
    };
    const blogsArray = getBlogs();
    blogsArray.push(newBlog);

    writeBlogs(blogsArray);
    res.status(201).send({ id: newBlog.id });
  } catch (error) {
    next(error);
  }
});
blogsRouter.delete("/:blogId", (req, res, next) => {
  try {
    const blogsArray = getBlogs();

    const remainingBlogs = blogsArray.filter(
      (blog) => blog.id !== req.params.blogId
    );
    writeBlogs(remainingBlogs);
    res.status(204).send();
  } catch (error) {
    next(error);
  }
});

blogsRouter.put("/:blogId", (req, res, next) => {
  try {
    const blogsArray = getBlogs();

    const index = blogsArray.findIndex((blog) => blog.id === req.params.blogId);
    if (index !== -1) {
      const oldBlog = blogsArray[index];
      const updatedBlog = { ...oldBlog, ...req.body, updatedAt: new Date() };
      blogsArray[index] = updatedBlog;
      writeBlogs(blogsArray);
      res.send(updatedBlog);
    } else {
      next(NotFound(`Blog with id ${req.params.blogId} is not found!`));
    }
  } catch (error) {
    next(error);
  }
});

export default blogsRouter;
