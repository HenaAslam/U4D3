import sgMail from "@sendgrid/mail";
import { readPDFFile } from "./fs-tools.js";

sgMail.setApiKey(process.env.SENDGRID_API_KEY);

export const sendRegistrationEmail = async (recipientAddress) => {
  const msg = {
    to: recipientAddress,
    from: process.env.SENDER_EMAIL_ADDRESS,
    subject: "Blog posted",
    text: "Your blog is posted",
    html: "<strong>Congrats!!! Your blog is posted</strong>",
  };
  await sgMail.send(msg);
};

export const sendPDFViaEmail = async (recipientAddress) => {
  const pdf = await readPDFFile();

  const pdf64 = pdf.toString("base64");

  const msg = {
    to: recipientAddress,
    from: process.env.SENDER_EMAIL_ADDRESS,
    subject: "Blog posted",
    text: "Your blog is posted",
    html: "<strong>Congrats!!! Your blog is posted</strong>",
    attachments: [
      {
        content: pdf64,
        filename: `test.pdf`,
        type: "application/pdf",
        disposition: "attachment",
      },
    ],
  };
  await sgMail.send(msg);
};
