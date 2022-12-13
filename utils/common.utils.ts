/* eslint-disable @typescript-eslint/no-var-requires */
/* eslint-disable id-blacklist */
import * as dotenv from "dotenv";
const nodemailer = require("nodemailer");

dotenv.config();

export class Common {
    private transporter: any;

    public async getTransport(transporter: any) {
        if (transporter === undefined) {
            transporter = nodemailer.createTransport({
                host: process.env.AURA_HOST,
                port: process.env.AURA_PORT,
                secureConnection: true,
                tls: {
                    ciphers: "SSLv3",
                },
                auth: {
                    user: process.env.EMAIL_USER,
                    pass: process.env.EMAIL_PASSWORD,
                },
            });
        }
        return transporter;
    }

    public async sendEmail(to: string, subject: string, html: string) {
        try {
            this.transporter = await this.getTransport(this.transporter);
            await this.transporter.sendMail({
                from: process.env.AURA_EMAIL,
                to,
                subject,
                html,
            });
        } catch (error) {
            throw error;
        }
    }
}
