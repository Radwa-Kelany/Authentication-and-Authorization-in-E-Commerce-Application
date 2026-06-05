export interface loginDTO {
  email: string;
  password: string;
}
export interface sessionDTO {
  userId: number;
  refreshToken: string;
  expiresAt: Date;
}
