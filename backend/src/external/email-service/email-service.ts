import { MessageData, MessageDetails } from "@trycourier/courier/api";
import { CourierEmailService } from "./impl/courier-email-service";
import { IEmailService } from "../../types/index";
import { logger } from "../../utils";
import { env } from "../../config";

export class EmailService implements IEmailService {
  private provider: CourierEmailService;

  constructor() {
    this.resolve();
  }

  async init() {
    await this.provider.init();
    logger.info(`[Container] ${EmailService.name} added successfully`);
  }

  resolve() {
    switch (env.EMAIL_SERVICE) {
      case CourierEmailService.name:
        this.provider = new CourierEmailService();
        break;
      default:
        break;
    }
  }

  async sendEmail(to: string, templateId: string, data: MessageData): Promise<string | null> {
    try {
      return await this.provider.sendEmail(to, templateId, data);
    } catch (error) {
      return null;
    }
  }

  async getEmailById(id: string): Promise<MessageDetails | null> {
    try {
      return await this.provider.getEmailById(id);
    } catch (error) {
      return null;
    }
  }
}
