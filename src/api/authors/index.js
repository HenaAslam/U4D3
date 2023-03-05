import Express from "express";
import { getAuthors, getBlogs, writeAuthors } from "../../lib/fs-tools.js";
import uniqid from "uniqid";
import { checkAuthorSchema } from "./validator.js";
import { triggerBadRequest } from "../blogs/validator.js";
import createHttpError from "http-errors";
import multer from "multer";
import { extname } from "path";
import { saveAuthorsAvatar } from "../../lib/fs-tools.js";

const authorRouter = Express.Router();

authorRouter.get("/", async (req, res, next) => {
  try {
    const authorArray = await getAuthors();
    res.send(authorArray);
  } catch (error) {
    next(error);
  }
});

authorRouter.get("/:userId", async (req, res, next) => {
  try {
    const authorArray = await getAuthors();
    const author = authorArray.find(
      (author) => author.id === req.params.userId
    );
    if (author) {
      res.send(author);
    } else {
      next(
        createHttpError(404, `author with id ${req.params.userId} is not found`)
      );
    }
  } catch (error) {
    next(error);
  }
});

authorRouter.post(
  "/",
  checkAuthorSchema,
  triggerBadRequest,
  async (req, res, next) => {
    try {
      const newAuthor = {
        ...req.body,
        createdAt: new Date(),
        updatedAt: new Date(),
        id: uniqid(),
      };

      const authorArray = await getAuthors();

      authorArray.push(newAuthor);
      await writeAuthors(authorArray);
      res.status(201).send({ id: newAuthor.id });
    } catch (error) {
      next(error);
    }
  }
);

authorRouter.delete("/:userId", async (req, res, next) => {
  try {
    const authorArray = await getAuthors();
    const remainingAuthors = authorArray.filter(
      (author) => author.id !== req.params.userId
    );
    if (authorArray.length !== remainingAuthors.length) {
      await writeAuthors(remainingAuthors);
      res.status(204).send();
    } else {
      next(
        createHttpError(404, `author with id ${req.params.userId} is not found`)
      );
    }
  } catch (error) {
    next(error);
  }
});

authorRouter.put("/:userId", async (req, res, next) => {
  try {
    const authorArray = await getAuthors();

    const index = authorArray.findIndex(
      (author) => author.id === req.params.userId
    );
    if (index !== -1) {
      const oldAuthor = authorArray[index];
      const updatedAuthor = {
        ...oldAuthor,
        ...req.body,
        updatedAt: new Date(),
      };
      authorArray[index] = updatedAuthor;
      await writeAuthors(authorArray);
      res.send(updatedAuthor);
    } else {
      next(
        createHttpError(404, `author with id ${req.params.userId} is not found`)
      );
    }
  } catch (error) {
    next(error);
  }
});

authorRouter.post("/checkEmail", async (req, res, next) => {
  try {
    const authorArray = await getAuthors();
    const newAuthor = {
      ...req.body,
      createdAt: new Date(),

      id: uniqid(),
    };
    const emailOfNewPost = req.body.email;

    const emailExists = authorArray.find(
      (author) => author.email === emailOfNewPost
    );
    // res.send(emailExists);
    if (emailExists) {
      res.send("email already exists");
    } else {
      authorArray.push(newAuthor);
      fs.writeFileSync(authorJSONPath, JSON.stringify(authorArray));
      res.status(201).send({ id: newAuthor.id });
    }
  } catch (error) {
    next(error);
  }
});

authorRouter.get("/:userId/blogPosts", async (req, res, next) => {
  try {
    const authorArray = await getAuthors();
    const author = authorArray.find((a) => a.id === req.params.userId);
    if (author) {
      const blogsArray = await getBlogs();
      const blogsOfAuthor = blogsArray.filter(
        (b) => b.author.name.toLowerCase() === author.name.toLowerCase()
      );
      res.send(blogsOfAuthor);
    } else {
      next(
        createHttpError(
          404,
          `author with id ${req.params.userId} does not exist`
        )
      );
    }
  } catch (error) {
    next(error);
  }
});

authorRouter.post(
  "/:userId/uploadAvatar",
  multer().single("avatar"),
  async (req, res, next) => {
    try {
      if (req.file) {
        console.log("FILE:", req.file);
        const originalFileExtension = extname(req.file.originalname);
        const fileName = req.params.userId + originalFileExtension;
        await saveAuthorsAvatar(fileName, req.file.buffer);
        const authorArray = await getAuthors();
        const index = authorArray.findIndex((a) => a.id === req.params.userId);
        if (index !== -1) {
          const oldAuthor = authorArray[index];
          const updatedAuthor = {
            ...oldAuthor,
            avatar: `http://localhost:3000/img/authors/${fileName}`,
          };
          authorArray[index] = updatedAuthor;
          await writeAuthors(authorArray);
        } else {
          next(
            createHttpError(404, {
              message: `Author with id ${req.params.userId} not found`,
            })
          );
        }
        res.send("uploaded");
      } else {
        next(createHttpError(400, { message: "Upload an image" }));
      }
    } catch (error) {
      next(error);
    }
  }
);

//

export default authorRouter;
