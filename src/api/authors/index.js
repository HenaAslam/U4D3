import Express from "express";
import { getAuthors, writeAuthors } from "../../lib/fs-tools.js";
import uniqid from "uniqid";

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

    res.send(author);
  } catch (error) {}
});

authorRouter.post("/", async (req, res, next) => {
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
});

authorRouter.delete("/:userId", async (req, res, next) => {
  try {
    const authorArray = await getAuthors();
    const remainingAuthors = authorArray.filter(
      (author) => author.id !== req.params.userId
    );
    await writeAuthors(remainingAuthors);
    res.status(204).send();
  } catch (error) {
    next(error);
  }
});

authorRouter.put("/:userId", async (req, res, next) => {
  try {
    const authorArray = await getAuthors();
    console.log(authorArray);
    const index = authorArray.findIndex(
      (author) => author.id === req.params.userId
    );
    const oldAuthor = authorArray[index];
    const updatedAuthor = { ...oldAuthor, ...req.body, updatedAt: new Date() };
    authorArray[index] = updatedAuthor;
    await writeAuthors(authorArray);
    res.send(updatedAuthor);
  } catch (error) {
    next(error);
  }
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
