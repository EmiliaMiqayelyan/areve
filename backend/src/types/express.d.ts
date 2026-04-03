declare namespace Express {
  interface Request {
    admin?: {
      id: string;
      email: string;
      role: string;
      name: string;
    };
  }
}
