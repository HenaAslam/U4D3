import fs from "fs-extra";
import { fileURLToPath } from "url";
import { dirname, join } from "path";

const { readJSON, writeJSON, writeFile, unlink, createReadStream } = fs;

const dataFolderPath = join(dirname(fileURLToPath(import.meta.url)), "../data");
const blogsJSONPath = join(dataFolderPath, "blogs.json");
const authorJSONPath = join(dataFolderPath, "authors.json");
const authorsPublicFolderPath = join(process.cwd(), "./public/img/authors");
const blogsPublicFolderPath = join(process.cwd(), "./public/img/blogs");

export const getBlogs = () => readJSON(blogsJSONPath);
export const writeBlogs = (blogsArray) => writeJSON(blogsJSONPath, blogsArray);
export const getAuthors = () => readJSON(authorJSONPath);
export const writeAuthors = (authorsArray) =>
  writeJSON(authorJSONPath, authorsArray);

export const saveAuthorsAvatar = (fileName, fileContentAsBuffer) =>
  writeFile(join(authorsPublicFolderPath, fileName), fileContentAsBuffer);

export const saveBlogCover = (fileName, fileContentAsBuffer) =>
  writeFile(join(blogsPublicFolderPath, fileName), fileContentAsBuffer);

// export const deleteBlogCover = (img) =>
//   unlink(join(blogsPublicFolderPath, "../..", img));

export const getBlogsJSONReadableStream = () => createReadStream(blogsJSONPath);
