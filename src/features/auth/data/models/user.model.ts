// User Model - Estructura de datos para usuarios
export interface UserModel {
  _id: string;
  username: string;
  email: string;
  password: string;
  role: string;
  avatar?: string;
  banner?: string;
  bio?: string;
  location?: string;
  createdAt: string;
  updatedAt: string;
  isActive?: boolean;
}

