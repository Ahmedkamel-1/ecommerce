import nodemailer from 'nodemailer'

export const sendEmail = async({to , subject , html , attachments})=> {
     // sender
     const transporter = nodemailer.createTransport({
          host: "smtp.gmail.com",
          service: "gmail",
          port: 465,
          secure: true,
          auth: {
               user: process.env.EMAIL,
               pass: process.env.EMAIL_PASS
          },
          logger: true,  // <-- Add this
          debug: true    // <-- Add this
     });
     //receiver
     try {
          const emailinfo = await transporter.sendMail({
               from: `"Ecommerce App" <${process.env.EMAIL}>`,
               to,
               subject,
               text: "Please find your invoice attached.",
               html,
               attachments
          });
          console.log("📧 Email Sent Successfully:", emailinfo);
          return emailinfo.accepted.length > 0;
     } catch (error) {
          console.error("❌ Email Sending Faileddddd:", error);
          return false;
     }
}

