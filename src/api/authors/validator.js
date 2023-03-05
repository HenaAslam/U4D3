import { checkSchema } from "express-validator";

const authorSchema = {
  name: {
    in: ["body"],
    isString: {
      errorMessage: "name is a mandatory field and needs to be a string",
    },
  },
  surname: {
    in: ["body"],
    isString: {
      errorMessage: "surname is a mandatory field and needs to be a string",
    },
  },
  email: {
    in: ["body"],
    isString: {
      errorMessage: "email is a mandatory field and needs to be a string",
    },
  },
  dateOfBirth: {
    in: ["body"],
    isString: {
      errorMessage: "dateOfBirth is a mandatory field and needs to be a string",
    },
  },
  avatar: {
    in: ["body"],
    isString: {
      errorMessage: "avatar is a mandatory field and needs to be a string",
    },
  },
};

export const checkAuthorSchema = checkSchema(authorSchema);
