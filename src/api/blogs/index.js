import Express from "express";
import fs from "fs";
import { fileURLToPath } from "url";
import { dirname, join } from "path";
import uniqid from "uniqid";

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
    console.log(error);
  }
});

blogsRouter.get("/:blogId", (req, res, next) => {
  try {
    const blogsArray = getBlogs();
    const blog = blogsArray.find((blog) => blog.id === req.params.blogId);
    res.send(blog);
  } catch (error) {
    console.log(error);
  }
});

blogsRouter.post("/", (req, res, next) => {
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
    console.log(error);
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
    console.log(error);
  }
});

blogsRouter.put("/:blogId", (req, res, next) => {
  try {
    const blogsArray = getBlogs();
    const index = blogsArray.findIndex((blog) => blog.id === req.params.blogId);
    const oldBlog = blogsArray[index];
    const updatedBlog = { ...oldBlog, ...req.body, updatedAt: new Date() };
    blogsArray[index] = updatedBlog;
    writeBlogs(updatedBlog);
    res.send(updatedBlog);
  } catch (error) {
    console.log(error);
  }
});

export default blogsRouter;
