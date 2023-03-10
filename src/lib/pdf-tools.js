import PdfPrinter from "pdfmake";
import imageToBase64 from "image-to-base64";
import { getPDFWritableStream } from "./fs-tools.js";
import { pipeline } from "stream";
import { promisify } from "util";

export const getPDFReadableStream = async (blog) => {
  const fonts = {
    Courier: {
      normal: "Courier",
      bold: "Courier-Bold",
      italics: "Courier-Oblique",
      bolditalics: "Courier-BoldOblique",
    },
    Helvetica: {
      normal: "Helvetica",
      bold: "Helvetica-Bold",
      italics: "Helvetica-Oblique",
      bolditalics: "Helvetica-BoldOblique",
    },
  };

  const printer = new PdfPrinter(fonts);
  const coverBase64 = await imageToBase64(blog.cover);
  const content = [
    { text: blog.title, style: "header" },
    { text: blog.category, style: "subheader" },
    { text: blog.content, style: "subheader" },
    { text: blog.author.name, style: "subheader" },

    { image: `data:image/jpeg;base64,${coverBase64}`, width: 150 },

    "\n\n",
  ];

  const docDefinition = {
    content: [...content],
    defaultStyle: {
      font: "Helvetica",
    },
    styles: {
      header: {
        fontSize: 18,
        bold: true,
        font: "Courier",
      },
      subheader: {
        fontSize: 15,
        bold: false,
      },
    },
  };

  const pdfReadableStream = printer.createPdfKitDocument(docDefinition);
  pdfReadableStream.end();

  return pdfReadableStream;
};
export const asyncPDFGeneration = async (blog) => {
  const source = await getPDFReadableStream(blog);
  const destination = getPDFWritableStream(`test.pdf`);

  const promiseBasedPipeline = promisify(pipeline);

  await promiseBasedPipeline(source, destination);
};
