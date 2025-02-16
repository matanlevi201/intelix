export const mockResponse = () =>
  ({ status: jest.fn().mockReturnThis(), send: jest.fn(), cookie: jest.fn(), clearCookie: jest.fn() } as any);
export const mockNext = jest.fn();
export const mockRequest = ({
  body,
  query,
  cookies,
  headers,
  currentUser,
  user, // oauth user data attachment
}: {
  body?: any;
  query?: any;
  cookies?: any;
  headers?: any;
  currentUser?: any;
  user?: any;
}) => ({ body, query, cookies, headers, currentUser, user } as any);
