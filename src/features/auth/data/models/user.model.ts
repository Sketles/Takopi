// User Model - Estructura exacta como viene de Storage/MongoDB
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

