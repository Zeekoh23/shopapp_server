import dotenv from 'dotenv';
dotenv.config({ path: './config.env' });
import nodemailer from 'nodemailer';
import Mail from 'nodemailer/lib/mailer';
import { IUserDoc } from '../models/userModel';
import ejs from 'ejs';
import htmlToText from 'html-to-text';
import path from 'path';

import CatchAsync from './CatchAsync';

const myuser: any = process.env.EMAIL_USERNAME;
const mypass: any = process.env.EMAIL_PASSWORD;
const myhost: any = process.env.EMAIL_HOST;
const myport: any = process.env.EMAIL_PORT;
const emailfrom: any = process.env.EMAIL_FROM;
const nodeenv: any = process.env.NODE_ENV;
const sendgriduser: any = process.env.SENDGRID_USERNAME;
const sendgridpass: any = process.env.SENDGRID_PASS;

export class Email {
  to: string;

  url: string;
  from: string;

  constructor(user: IUserDoc, url: string) {
    this.to = user.email;

    this.url = url;
    this.from = `Isaac Eze<${emailfrom}>`;
  }

  newTransport() {
    return nodemailer.createTransport({
      service: 'SendGrid',
      auth: {
        user: sendgriduser,
        pass: sendgridpass,
      },
    });
  }

  async send(template: any, subject: string) {
    const html: any = await ejs.renderFile(
      path.join(__dirname, `/../views/emails/${template}.ejs`),
      {
        to: this.to,

        url: this.url,
        subject,
      }
    );

    const mailoptions: any = {
      from: this.from,
      to: this.to,
      subject,
      html,
      text: htmlToText.fromString(html),
    };

    await this.newTransport().sendMail(mailoptions);
  }

  async sendWelcome() {
    await this.send('welcome', 'Welcome to the natours family!');
  }

  async sendPasswordReset() {
    await this.send('PasswordReset', 'YOUR PASSWORD RESET TOKEN');
  }
}
