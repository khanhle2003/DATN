export interface PersonDTO {
    id: number;
    username: string;
    email: string;
    phone: string;
    fullName: string;
    avatar: string;
    status: number;
    password: string;
    createdDate: string; // Hoặc Date nếu bạn muốn xử lý ngày
    updatedDate: string; // Hoặc Date nếu bạn muốn xử lý ngày
    identityCard: string;
    passport: string;
    dateOfBirth: string; // Hoặc Date nếu bạn muốn xử lý ngày
    nationality: string;
    roles: ERole[]; // Sử dụng enum cho vai trò
  }
  
export interface PersonCreateDTO {
    username: string;
    password: string;
    email: string;
    phone: string;
    fullName: string;
    identityCard: string;
    passport: string;
    dateOfBirth: string;
    nationality: string;
    avatar: string;
    roles: ERole[]; // Sử dụng enum cho vai trò
  }
  export enum ERole {
    ROLE_ADMIN = 'ROLE_ADMIN',
    ROLE_STAFF = 'ROLE_STAFF',
    ROLE_USER = 'ROLE_USER'
  }