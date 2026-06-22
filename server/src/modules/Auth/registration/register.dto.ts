export interface UserDTO {
  verified_token: string;
  email: string;
  firstName: string;
  lastName: string;
  phone: string;
  password: string;
  userTypeId: number;
  roleId?: number;
}

export interface CustomerDTO extends UserDTO {
  dob: Date;
  gender: string;
}
export interface SellerDTO extends UserDTO {
  storeName: string;
  storeSlug: string;
  businessName: string;
  businessNumber: string;
  taxNumber: string;
}
