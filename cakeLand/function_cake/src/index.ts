import * as functions from 'firebase-functions';
import * as nodemailer from 'nodemailer';

// Create a transporter for nodemailer using your email service (e.g., Gmail, SMTP)
const transporter = nodemailer.createTransport({
  service: 'gmail', // Example for Gmail, change according to your service
  auth: {
    user: 'jbaldac02@gmail.com', // Your email address
    pass: 'v^An74xHGepjc@A#GdJ4#5ujP@nSGsM4SGMxyU%YtdRD9#f$vN$vG@',  // Your email password (or app-specific password)
  },
});

// Define the sendEmail function using https.onRequest for an HTTP endpoint
export const sendEmail = functions.https.onRequest(async (req, res) => {
  // Parse the request body for text and image URL
  const { text, imageUrl } = req.body;

  // Create email options
  const mailOptions = {
    from: 'jbaldac02@gmail.com',  // The sender's email address
    to: 'jbaldac02@gmail.com', // The recipient's email address
    subject: 'Test Email from Firebase', // Email subject
    html: `
      <p>${text}</p>
      <img src="${imageUrl}" alt="Test Image" style="width:100%;max-width:500px;" />
    `, // HTML content with text and image
  };

  try {
    // Send the email using nodemailer
    await transporter.sendMail(mailOptions);

    // Respond with a success message
    res.status(200).send({ success: true, message: 'Email sent successfully' });
  } catch (error) {
    // If there's an error, respond with a failure message
    console.error('Error sending email:', error);
    res.status(500).send({ success: false, error: error.message });
  }
});

//URL https://us-central1-oauthcakes.cloudfunctions.net/sendEmail
