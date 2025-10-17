// Comment Model - Estructura exacta como viene de Storage/MongoDB
export interface CommentModel {
  _id: string;
  contentId: string;
  userId: string;
  username: string;
  userAvatar?: string;
  text: string;
  likes: number;
  likedBy: string[]; // Array de IDs de usuarios que dieron like
  createdAt: string;
  updatedAt: string;
}
