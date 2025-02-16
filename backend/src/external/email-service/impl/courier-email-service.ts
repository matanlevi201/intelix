import { CourierClient } from "@trycourier/courier";
import { MessageData } from "@trycourier/courier/api";
import { env } from "../../../config";

export class CourierEmailService {
  client: CourierClient;

  constructor() {}

  async init() {
    this.client = new CourierClient({ authorizationToken: env.COURIER_AUTH_TOKEN });
    try {
      await this.client.brands.list();
    } catch (error) {
      throw new Error(error.message);
    }
  }

  async sendEmail(to: string, templateId: string, data: MessageData): Promise<string> {
    const { requestId } = await this.client.send({
      message: {
        to: { email: to },
        template: templateId,
        data,
      },
    });
    return requestId;
  }

  async getEmailById(id: string) {
    const email = await this.client.messages.get(id);
    return email;
  }
}
