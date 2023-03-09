import sgMail from "@sendgrid/mail";

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
