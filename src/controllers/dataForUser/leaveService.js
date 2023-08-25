const ldap = require('ldapjs');
const nodemailer = require('nodemailer');

async function sendEmail() {
  const transporter = nodemailer.createTransport({
    service: 'Gmail',
    auth: {
      user: 'your.email@gmail.com', // อีเมล์ผู้ส่ง
      pass: 'your-email-password'   // รหัสผ่านอีเมล์ผู้ส่ง
    }
  });

  // กำหนดค่าของผู้รับและเนื้อหาของอีเมล์
  const mailOptions = {
    from: 'your.email@gmail.com', // อีเมล์ผู้ส่ง
    to: 'recipient@example.com',  // อีเมล์ผู้รับ
    subject: 'Test Email',        // หัวข้ออีเมล์
    text: 'This is a test email sent from Node.js using nodemailer.' // เนื้อหาอีเมล์
  };

  try {
    // ส่งอีเมล์
    const info = await transporter.sendMail(mailOptions);
    console.log('Email sent:', info.response);
  } catch (error) {
    console.error('Error sending email:', error);
  }
}

// เรียกใช้งานฟังก์ชั่นสำหรับการส่งอีเมล์
sendEmail();
