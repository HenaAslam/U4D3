import express from "express";

import {
  // deleteBlogCover,
  getBlogs,
  saveBlogCover,
  writeBlogs,
} from "../../lib/fs-tools.js";
import uniqid from "uniqid";

import createHttpError from "http-errors";
import {
  checkBlogSchema,
  checkCommentSchema,
  triggerBadRequest,
} from "./validator.js";
import multer from "multer";
import { extname } from "path";
import { get } from "https";
import { v2 as cloudinary } from "cloudinary";
import { CloudinaryStorage } from "multer-storage-cloudinary";

const blogsRouter = express.Router();
// /blogPosts?title=whatever
blogsRouter.get(
  "/",

  async (req, res, next) => {
    try {
      const blogsArray = await getBlogs();
      if (req.query && req.query.category) {
        const filteredBlogs = blogsArray.filter((blog) =>
          blog.category.toLowerCase().includes(req.query.category.toLowerCase())
        );
        res.send(filteredBlogs);
      } else if (req.query && req.query.title) {
        const filteredBlogs = blogsArray.filter((blog) =>
          blog.title.toLowerCase().includes(req.query.title.toLowerCase())
        );
        res.send(filteredBlogs);
      } else {
        res.send(blogsArray);
      }
    } catch (error) {
      next(error);
    }
  }
);

blogsRouter.get("/:blogId", async (req, res, next) => {
  try {
    const blogsArray = await getBlogs();
    const blog = blogsArray.find((blog) => blog.id === req.params.blogId);
    if (blog) {
      res.send(blog);
    } else {
      next(
        createHttpError(404, `Blog with id ${req.params.blogId} not found!`)
      );
    }
  } catch (error) {
    next(error);
  }
});

blogsRouter.post(
  "/",
  checkBlogSchema,
  triggerBadRequest,
  async (req, res, next) => {
    try {
      const newBlog = {
        ...req.body,
        createdAt: new Date(),
        updatedAt: new Date(),
        id: uniqid(),
        comments: [],
      };
      const blogsArray = await getBlogs();
      blogsArray.push(newBlog);

      await writeBlogs(blogsArray);
      res.status(201).send({ id: newBlog.id });
    } catch (error) {
      next(error);
    }
  }
);

blogsRouter.delete("/:blogId", async (req, res, next) => {
  try {
    const blogsArray = await getBlogs();
    const blog = blogsArray.find((b) => b.id === req.params.blogId);

    const remainingBlogs = blogsArray.filter(
      (blog) => blog.id !== req.params.blogId
    );
    if (blogsArray.length !== remainingBlogs.length) {
      // await deleteBlogCover(blog.cover);
      await writeBlogs(remainingBlogs);

      res.status(204).send();
    } else {
      next(
        createHttpError(404, `Blog with id ${req.params.blogId} not found!`)
      );
    }
  } catch (error) {
    next(error);
  }
});

blogsRouter.put("/:blogId", async (req, res, next) => {
  try {
    const blogsArray = await getBlogs();

    const index = blogsArray.findIndex((blog) => blog.id === req.params.blogId);
    if (index !== -1) {
      const oldBlog = blogsArray[index];
      const updatedBlog = { ...oldBlog, ...req.body, updatedAt: new Date() };
      blogsArray[index] = updatedBlog;
      await writeBlogs(blogsArray);
      res.send(updatedBlog);
    } else {
      next(
        createHttpError(404, `Blog with id ${req.params.blogId} not found!`)
      );
    }
  } catch (error) {
    next(error);
  }
});

blogsRouter.get("/:blogId/comments", async (req, res, next) => {
  try {
    const blogsArray = await getBlogs();
    const blog = blogsArray.find((blog) => blog.id === req.params.blogId);
    if (blog) {
      res.send(blog.comments);
    } else {
      next(
        createHttpError(404, `Blog with id ${req.params.blogId} not found!`)
      );
    }
  } catch (error) {
    next(error);
  }
});

blogsRouter.post(
  "/:blogId/comments",
  checkCommentSchema,
  triggerBadRequest,
  async (req, res, next) => {
    try {
      const blogsArray = await getBlogs();
      const blog = blogsArray.find((blog) => blog.id === req.params.blogId);
      if (blog) {
        // res.send(blog.comments);
        const newComment = {
          ...req.body,
          createdAt: new Date(),
          updatedAt: new Date(),
          id: uniqid(),
        };
        blog.comments.push(newComment);
        await writeBlogs(blogsArray);
        res.status(201).send({ id: newComment.id });
      } else {
        next(
          createHttpError(404, `Blog with id ${req.params.blogId} not found!`)
        );
      }
    } catch (error) {
      next(error);
    }
  }
);

blogsRouter.put("/:blogId/comments/:commentId", async (req, res, next) => {
  try {
    const blogsArray = await getBlogs();
    const blog = blogsArray.find((b) => b.id === req.params.blogId);
    if (blog) {
      const commentArray = blog.comments;
      const index = commentArray.findIndex(
        (c) => c.id === req.params.commentId
      );
      if (index !== -1) {
        const oldComment = commentArray[index];
        const updatedComment = {
          ...oldComment,
          ...req.body,
          updatedAt: new Date(),
        };
        commentArray[index] = updatedComment;
        await writeBlogs(blogsArray);
        res.send(updatedComment);
      } else {
        next(
          createHttpError(
            404,
            `comment with id ${req.params.commentId} is not found`
          )
        );
      }
    } else {
      next(
        createHttpError(404, `blog with id ${req.params.blogId} is not found`)
      );
    }
  } catch (error) {
    next(error);
  }
});

blogsRouter.delete("/:blogId/comments/:commentId", async (req, res, next) => {
  try {
    const blogsArray = await getBlogs();
    const blog = blogsArray.find((b) => b.id === req.params.blogId);
    if (blog) {
      const commentArray = blog.comments;
      const remainingComments = commentArray.filter(
        (c) => c.id !== req.params.commentId
      );
      if (commentArray.length !== remainingComments.length) {
        blog.comments = remainingComments;
        await writeBlogs(blogsArray);
        res.status(204).send();
      } else {
        next(
          createHttpError(
            404,
            `comment with id ${req.params.commentId} is not found`
          )
        );
      }
    } else {
      next(
        createHttpError(404, `blog with id ${req.params.blogId} is not found`)
      );
    }
  } catch (error) {
    next(error);
  }
});
const cloudinaryUploader = multer({
  storage: new CloudinaryStorage({
    cloudinary,
    params: {
      folder: "blogs/cover",
    },
  }),
}).single("cover");

blogsRouter.post(
  "/:blogId/uploadCover",
  cloudinaryUploader,
  // multer().single("cover"),
  async (req, res, next) => {
    try {
      if (req.file) {
        console.log("FILE:", req.file);
        // const originalFileExtension = extname(req.file.originalname);
        // const fileName = req.params.blogId + originalFileExtension;
        // await saveBlogCover(fileName, req.file.buffer);
        const blogsArray = await getBlogs();
        const index = blogsArray.findIndex((b) => b.id === req.params.blogId);
        if (index !== -1) {
          const oldBlog = blogsArray[index];
          const updatedBlog = {
            ...oldBlog,
            // cover: `http://localhost:3001/img/blogs/${fileName}`,
            cover: req.file.path,
          };
          blogsArray[index] = updatedBlog;
          await writeBlogs(blogsArray);
        } else {
          next(
            createHttpError(404, `blog with id ${req.params.blogId} not found`)
          );
        }

        res.send("uploaded");
      } else {
        next(createHttpError(400, "upload an image"));
      }
    } catch (error) {
      next(error);
    }
  }
);
blogsRouter.get(":/blogId/pdf", async (req, res, next) => {
  try {
  } catch (error) {
    next(error);
  }
});
// filesRouter.get("/:pdf", async (req, res, next) => {
//   res.setHeader("Content-Disposition", "attachment; filename=test.pdf")

//   const books = await getBooks()
//   const source = getPDFReadableStream(books)
//   const destination = res
//   pipeline(source, destination, err => {
//     if (err) console.log(err)
//   })
// })

export default blogsRouter;
