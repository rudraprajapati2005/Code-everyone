import nodemailer from "nodemailer";

export async function POST(request) {
  const { to, subject, text } = await request.json();
  console.log(`Email sent to ${to} with subject "${subject}"`);
  // Use environment variables for security
  const transporter = nodemailer.createTransport({
    host: "smtp.gmail.com",
    port: 465,
    secure: true, // Use SSL for port 465
    auth: {
      user: process.env.GMAIL_USER, // Use env variable
      pass: process.env.GMAIL_PASS, // Use env variable
    },
  });

  try {
    await transporter.sendMail({
      from: `"Code Everyone" <${process.env.GMAIL_USER}>`, // sender address matches authenticated user
      to,
      subject,
      text,
    });
    
    return new Response(JSON.stringify({ success: true }), { status: 200 });
  } catch (error) {
    return new Response(
      JSON.stringify({ success: false, error: error.message }),
      { status: 500 }
    );
  }
}
