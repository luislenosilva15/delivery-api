export type JwtPayload = {
  user: {
    id: string;
    email: string;
    companyId: string;
  };
};
