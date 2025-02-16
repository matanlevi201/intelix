import { Container } from "inversify";
import { IUserRepository, IEmailRepository, IBlacklistRepository, IDatabaseService, TYPES, IEmailService } from "./src/types/index";
import { UserRepository, EmailRepository, BlacklistRepository } from "./src/repositories";
import { Database } from "./src/database/database";
import { EmailService } from "./src/external";

const container = new Container();

export const bootstrap = () => {
  // Kernals
  container.bind<IDatabaseService>(TYPES.IDatabaseService).to(Database).inSingletonScope();
  // Repositories
  container.bind<IUserRepository>(TYPES.IUserRepository).to(UserRepository).inSingletonScope();
  container.bind<IEmailRepository>(TYPES.IEmailRepository).to(EmailRepository).inSingletonScope();
  container.bind<IBlacklistRepository>(TYPES.IBlacklistRepository).to(BlacklistRepository).inSingletonScope();
  // External services
  container.bind<IEmailService>(TYPES.IEmailService).to(EmailService).inSingletonScope();
};

export { container };
