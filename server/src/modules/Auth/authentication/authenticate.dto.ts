export interface loginDTO {
  email: string;
  password: string;
}
export interface sessionDTO {
  userId: number;
  expiresAt: Date;
}
