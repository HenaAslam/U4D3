import Express from "express";
import multer from "multer";
import { extname } from "path";
import { saveAuthorsAvatar, saveBlogCover } from "../../lib/fs-tools.js";

const filesRouter = Express.Router();

filesRouter.post(
  "/authors/:id/uploadAvatar",
  multer().single("avatar"),
  async (req, res, next) => {
    try {
      console.log("FILE:", req.file);

      const originalFileExtension = extname(req.file.originalname);
      const fileName = req.params.id + originalFileExtension;
      await saveAuthorsAvatar(fileName, req.file.buffer);

      res.send({ message: "file uploaded" });
    } catch (error) {
      next(error);
    }
  }
);

filesRouter.post(
  "/blogs/:id/uploadCover",
  multer().single("cover"),
  async (req, res, next) => {
    try {
      console.log("FILE:", req.file);

      const originalFileExtension = extname(req.file.originalname);
      const fileName = req.params.id + originalFileExtension;
      await saveBlogCover(fileName, req.file.buffer);

      res.send({ message: "file uploaded" });
    } catch (error) {
      next(error);
    }
  }
);

export default filesRouter;
