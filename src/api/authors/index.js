import Express from "express";
import fs from "fs";
import { fileURLToPath } from "url";
import { dirname, join } from "path";
import uniqid from "uniqid";

const authorRouter = Express.Router();
// console.log("the path is", dirname(fileURLToPath(import.meta.url)));
const authorJSONPath = join(
  dirname(fileURLToPath(import.meta.url)),
  "authors.json"
);
// console.log("path", authorJSONPath);

authorRouter.get("/", (req, res) => {
  try {
    // res.send({ message: "Hello!" });
    const fileContent = fs.readFileSync(authorJSONPath);
    const authorArray = JSON.parse(fileContent);
    // console.log("authors", authorArray);
    res.send(authorArray);
  } catch (error) {
    console.log(error);
  }
});

authorRouter.get("/:userId", (req, res) => {
  // res.send({ message: "Hello!" });
  // console.log(req.params.userId);
  const fileContent = fs.readFileSync(authorJSONPath);
  const authorArray = JSON.parse(fileContent);
  const author = authorArray.find((author) => author.id === req.params.userId);
  // console.log(author);
  res.send(author);
});

authorRouter.post("/", (req, res) => {
  try {
    // console.log("body", req.body);
    const newAuthor = {
      ...req.body,
      createdAt: new Date(),

      id: uniqid(),
    };
    const fileContent = fs.readFileSync(authorJSONPath);
    const authorArray = JSON.parse(fileContent);

    // const checkEmail = authorArray.find(
    //   (author) => author.email === newAuthor.email
    // );

    // if (checkEmail === undefined) {
    authorArray.push(newAuthor);
    fs.writeFileSync(authorJSONPath, JSON.stringify(authorArray));
    res.status(201).send({ id: newAuthor.id });
    // } else {
    // res.send("email id exists");
    // }

    // res.send({ message: "Hello!" });
  } catch (error) {
    console.log(error);
  }
});

authorRouter.delete("/:userId", (req, res) => {
  const fileContent = fs.readFileSync(authorJSONPath);
  const authorArray = JSON.parse(fileContent);
  const remainingAuthors = authorArray.filter(
    (author) => author.id !== req.params.userId
  );
  fs.writeFileSync(authorJSONPath, JSON.stringify(remainingAuthors));
  res.status(204).send();
});

authorRouter.put("/:userId", (req, res) => {
  const fileContent = fs.readFileSync(authorJSONPath);
  const authorArray = JSON.parse(fileContent);
  const index = authorArray.findIndex(
    (author) => author.id === req.params.userId
  );
  const oldAuthor = authorArray[index];
  const updatedAuthor = { ...oldAuthor, ...req.body };
  authorArray[index] = updatedAuthor;
  fs.writeFileSync(authorJSONPath, JSON.stringify(authorArray));
  res.send(updatedAuthor);
});

authorRouter.post("/checkEmail", (req, res) => {
  const fileContent = fs.readFileSync(authorJSONPath);
  const authorArray = JSON.parse(fileContent);
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
});
export default authorRouter;
