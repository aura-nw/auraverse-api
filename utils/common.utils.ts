/* eslint-disable id-blacklist */
// eslint-disable-next-line @typescript-eslint/no-var-requires
const nodemailer = require("nodemailer");

export class Common {
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

    public async sendEmail(to: string, subject: string, html: string, transporter: any) {
        try {
            transporter = await this.getTransport(transporter);
            await transporter.sendMail({
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
