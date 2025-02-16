import { CustomError } from "./custom.error";

export class FailedEmailError extends CustomError {
  statusCode = 502;

  constructor(public message: string) {
    super(message);

    Object.setPrototypeOf(this, FailedEmailError.prototype);
  }

  serializeErrors() {
    return [{ message: this.message }];
  }
}
