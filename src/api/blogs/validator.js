import { checkSchema, validationResult } from "express-validator";
import createHttpError from "http-errors";

const blogSchema = {
  category: {
    in: ["body"],
    isString: {
      errorMessage: "Category is a mandatory field and needs to be a string",
    },
  },
  title: {
    in: ["body"],
    isString: {
      errorMessage: "Title is a mandatory field and needs to be a string",
    },
  },
  cover: {
    in: ["body"],
    isString: {
      errorMessage: "Cover is a mandatory field and needs to be a string",
    },
  },
  content: {
    in: ["body"],
    isString: {
      errorMessage: "Content is a mandatory field and needs to be a string",
    },
  },

  "readTime.value": {
    in: ["body"],
    isDecimal: {
      errorMessage:
        "readTime value is a mandatory field and needs to be a number",
    },
  },
  "readTime.unit": {
    in: ["body"],
    isString: {
      errorMessage:
        "readTime unit is a mandatory field and needs to be a string",
    },
  },
  "author.name": {
    in: ["body"],
    isString: {
      errorMessage: "author name is a mandatory field and needs to be a string",
    },
  },
  "author.avatar": {
    in: ["body"],
    isString: {
      errorMessage:
        "author avatar is a mandatory field and needs to be a string",
    },
  },
};

export const checkBlogSchema = checkSchema(blogSchema);

export const triggerBadRequest = (req, res, next) => {
  const errors = validationResult(req);

  //   console.log(errors.array());

  if (!errors.isEmpty()) {
    next(
      createHttpError(400, "Errors during post validation", {
        errorsList: errors.array(),
      })
    );
  } else {
    next();
  }
};
