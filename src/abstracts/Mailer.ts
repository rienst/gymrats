import nodemailer from 'nodemailer'

interface SendMailParameters {
  to: string
  subject: string
  text: string
  html?: string
}

export default class Mailer {
  transporter: nodemailer.Transporter

  constructor() {
    if (!process.env.MAILER_AUTH_USER || !process.env.MAILER_AUTH_PASSWORD) {
      throw new Error(
        'Not all required environment variables were found to initialize the mailer'
      )
    }

    this.transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: process.env.MAILER_AUTH_USER,
        pass: process.env.MAILER_AUTH_PASSWORD,
      },
    })
  }

  sendMail = async (mailOptions: SendMailParameters) => {
    const mailInfo = await this.transporter.sendMail({
      from: `Gymrats <${process.env.MAIL_USER}>`,
      to: mailOptions.to,
      subject: mailOptions.subject,
      text: mailOptions.text,
      html: mailOptions.html,
    })

    if (!mailInfo) {
      return false
    }

    return true
  }
}
