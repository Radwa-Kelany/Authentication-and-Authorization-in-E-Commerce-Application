export interface UserDTO {
  firstName: string;
  lastName: string;
  email: string;
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
