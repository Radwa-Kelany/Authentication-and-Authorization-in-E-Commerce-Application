export interface loginDTO {
  email: string;
  password: string;
  device: string;
}
export interface sessionDTO {
  userId: number;
  device: string;
  expiresAt: Date;
}
