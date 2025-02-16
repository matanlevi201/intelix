export const mockEmailService = {
  provider: { init: jest.fn() } as any,
  init: jest.fn(),
  resolve: jest.fn(),
  sendEmail: jest.fn(),
  getEmailById: jest.fn(),
};
