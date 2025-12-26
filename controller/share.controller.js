
import dotenv from "dotenv";
dotenv.config();
import mongoose from "mongoose";
import nodemailer from "nodemailer";
import { sharedModel } from "../model/share.model.js";


export const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST,
  port: Number(process.env.SMTP_PORT),
  secure: false, // port 587
  auth: {
    user: process.env.SMTP_EMAIL,
    pass: process.env.SMTP_PASSWORD,
  },
});

const generateEmailHTML = ({ downloadLink, expireDate }) => {
  return `
    <!DOCTYPE html>
    <html>
      <body style="margin:0;padding:0;background-color:#f4f6f8;font-family:Arial,Helvetica,sans-serif;">
        <table width="100%" cellpadding="0" cellspacing="0" style="padding:20px;">
          <tr>
            <td align="center">
              <table width="600" cellpadding="0" cellspacing="0"
                style="background:#ffffff;border-radius:8px;padding:24px;">
                
                <!-- Header -->
                <tr>
                  <td style="text-align:center;padding-bottom:20px;">
                    <h2 style="margin:0;color:#333;">File Shared With You</h2>
                  </td>
                </tr>
  
                <!-- Content -->
                <tr>
                  <td style="color:#555;font-size:14px;line-height:1.6;">
                    <p>Hello,</p>
                    <p>
                      A file has been shared with you. Click the button below to download it.
                    </p>
                  </td>
                </tr>
  
                <!-- Download Button -->
                <tr>
                  <td align="center" style="padding:20px 0;">
                    <a href="${downloadLink}"
                       style="
                        background-color:#4f46e5;
                        color:#ffffff;
                        text-decoration:none;
                        padding:12px 24px;
                        border-radius:6px;
                        font-size:14px;
                        display:inline-block;
                       ">
                      ⬇ Download File
                    </a>
                  </td>
                </tr>
  
                <!-- Direct Link -->
                <tr>
                  <td style="font-size:13px;color:#666;">
                    <p>
                      Or copy and paste this link into your browser:
                    </p>
                    <a href={downloadLink} download style="word-break:break-all;color:#4f46e5;">
                      ${downloadLink}
                    </a>
                  </td>
                </tr>
  
                <!-- Expiry Info -->
                <tr>
                  <td style="padding-top:16px;font-size:13px;color:#b91c1c;">
                    ⏰ <strong>Link Expiry Date:</strong> ${expireDate}
                  </td>
                </tr>
  
                <!-- Footer -->
                <tr>
                  <td style="padding-top:24px;font-size:12px;color:#999;text-align:center;">
                    If you did not request this file, please ignore this email.
                  </td>
                </tr>
  
              </table>
            </td>
          </tr>
        </table>
      </body>
    </html>
    `;
};


export const sharedFile = async (req, res) => {
  try {

    const { email, fileId } = req.body

    const downloadLink = `http://localhost:8000/file/download/${fileId}`
    const expireDate = new Date(); // or future date


    const htmlContent = generateEmailHTML({
      downloadLink,
      expireDate,
    });

    await transporter.sendMail({
      from: process.env.SMTP_EMAIL,
      to: email,
      subject: "Your File Download Link",
      html: htmlContent,
    });

    const payload = {
      user: req.user.id,
      recieverEmail: email,
      file: fileId

    }

    await sharedModel.create(payload)

    return res.status(200).json({
      success: true,
      message: "Email sent with download link",
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};




export const getSharedFile = async (req, res) => {
  try {
    // Find all shared files for the logged-in user
    const result = await sharedModel
      .find({ user: req.user.id })
      .populate({
        path: "file",
        select: "filename path size type"
      });

    res.status(200).json({
      success: true,
      data: result
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

