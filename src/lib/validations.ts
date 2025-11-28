// Zod Schemas for API validation
import { z } from 'zod';

export const UserIdSchema = z.object({
  userId: z.string().min(1, 'ID de usuario requerido'),
});

export const ContentIdSchema = z.object({
  contentId: z.string().min(1, 'ID de contenido requerido'),
});

export const PaginationSchema = z.object({
  page: z.coerce.number().int().min(1, 'Página debe ser mayor a 0').optional().default(1),
  limit: z.coerce.number().int().min(1).max(100).optional().default(20),
  search: z.string().optional(),
  sort: z.enum(['newest', 'oldest', 'most-views', 'most-downloads']).optional(),
});

export const ToggleLikeSchema = z.object({
  contentId: z.string().min(1, 'ID de contenido requerido'),
  userId: z.string().min(1, 'ID de usuario requerido'),
});

export const TogglePinSchema = z.object({
  contentId: z.string().min(1, 'ID de contenido requerido'),
  userId: z.string().min(1, 'ID de usuario requerido'),
  isPublic: z.boolean().optional().default(false),
});

export const CreateCommentSchema = z.object({
  contentId: z.string().min(1, 'ID de contenido requerido'),
  text: z.string().min(1, 'Comentario no puede estar vacío').max(500, 'Máximo 500 caracteres'),
  parentId: z.string().optional(),
});

export type UserIdInput = z.infer<typeof UserIdSchema>;
export type ContentIdInput = z.infer<typeof ContentIdSchema>;
export type PaginationInput = z.infer<typeof PaginationSchema>;
export type ToggleLikeInput = z.infer<typeof ToggleLikeSchema>;
export type TogglePinInput = z.infer<typeof TogglePinSchema>;
export type CreateCommentInput = z.infer<typeof CreateCommentSchema>;
