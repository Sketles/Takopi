/**
 * Meshy AI API Client
 * Cliente simple para la API de Meshy - Generación de modelos 3D
 * 
 * Documentación: https://docs.meshy.ai
 * 
 * Endpoints soportados:
 * - Text to 3D (v2): Preview + Refine
 * - Image to 3D (v1)
 * - Retexture (v1)
 * - Balance (v1)
 */

const MESHY_API_BASE = 'https://api.meshy.ai';

// ============ TYPES ============

export type MeshyStatus = 'PENDING' | 'IN_PROGRESS' | 'SUCCEEDED' | 'FAILED' | 'CANCELED';

export interface MeshyModelUrls {
  glb?: string;
  fbx?: string;
  obj?: string;
  usdz?: string;
  mtl?: string;
}

export interface MeshyTextureUrls {
  base_color?: string;
  metallic?: string;
  normal?: string;
  roughness?: string;
}

export interface MeshyTask {
  id: string;
  status: MeshyStatus;
  progress: number;
  prompt?: string;
  art_style?: string;
  model_urls?: MeshyModelUrls;
  thumbnail_url?: string;
  video_url?: string;
  texture_urls?: MeshyTextureUrls[];
  created_at: number;
  started_at: number;
  finished_at: number;
  preceding_tasks: number;
  task_error?: { message: string };
}

// Text to 3D Options
export interface TextTo3DPreviewOptions {
  prompt: string;
  art_style?: 'realistic' | 'sculpture';
  ai_model?: 'meshy-4' | 'meshy-5' | 'latest';
  topology?: 'quad' | 'triangle';
  target_polycount?: number;
  should_remesh?: boolean;
  symmetry_mode?: 'off' | 'auto' | 'on';
  seed?: number;
}

export interface TextTo3DRefineOptions {
  preview_task_id: string;
  enable_pbr?: boolean;
  texture_prompt?: string;
  ai_model?: 'meshy-4' | 'meshy-5' | 'latest';
}

// Image to 3D Options
export interface ImageTo3DOptions {
  image_url: string;
  ai_model?: 'meshy-4' | 'meshy-5' | 'latest';
  topology?: 'quad' | 'triangle';
  target_polycount?: number;
  should_remesh?: boolean;
  should_texture?: boolean;
  enable_pbr?: boolean;
  texture_prompt?: string;
}

// Retexture Options
export interface RetextureOptions {
  input_task_id?: string;
  model_url?: string;
  text_style_prompt?: string;
  image_style_url?: string;
  ai_model?: 'meshy-4' | 'meshy-5' | 'latest';
  enable_pbr?: boolean;
  enable_original_uv?: boolean;
}

// ============ ERROR CLASS ============

export class MeshyError extends Error {
  constructor(
    public status: number,
    message: string,
    public code?: string
  ) {
    super(message);
    this.name = 'MeshyError';
  }
}

// ============ HELPER FUNCTIONS ============

function getApiKey(): string {
  const key = process.env.MESHY_API_KEY;
  if (!key) {
    throw new MeshyError(500, 'MESHY_API_KEY no configurada');
  }
  return key;
}

async function meshyFetch<T>(
  endpoint: string,
  options: RequestInit = {}
): Promise<T> {
  const url = `${MESHY_API_BASE}${endpoint}`;
  
  const response = await fetch(url, {
    ...options,
    headers: {
      'Authorization': `Bearer ${getApiKey()}`,
      'Content-Type': 'application/json',
      ...options.headers,
    },
  });

  if (!response.ok) {
    const error = await response.json().catch(() => ({ message: 'Error desconocido' }));
    throw new MeshyError(response.status, error.message || `Error ${response.status}`);
  }

  // DELETE returns empty body
  if (response.status === 200 && options.method === 'DELETE') {
    return {} as T;
  }

  return response.json();
}

// ============ TEXT TO 3D API (v2) ============

/**
 * Crear tarea de preview (mesh sin textura)
 * Costo: 20 créditos (Meshy-6) / 5 créditos (otros)
 */
export async function createTextTo3DPreview(options: TextTo3DPreviewOptions): Promise<string> {
  const { result } = await meshyFetch<{ result: string }>('/openapi/v2/text-to-3d', {
    method: 'POST',
    body: JSON.stringify({
      mode: 'preview',
      prompt: options.prompt,
      art_style: options.art_style || 'realistic',
      ai_model: options.ai_model || 'latest',
      topology: options.topology || 'triangle',
      target_polycount: options.target_polycount || 30000,
      should_remesh: options.should_remesh ?? true,
      symmetry_mode: options.symmetry_mode || 'auto',
      ...(options.seed && { seed: options.seed }),
    }),
  });
  return result;
}

/**
 * Crear tarea de refine (aplicar texturas)
 * Costo: 10 créditos
 */
export async function createTextTo3DRefine(options: TextTo3DRefineOptions): Promise<string> {
  const { result } = await meshyFetch<{ result: string }>('/openapi/v2/text-to-3d', {
    method: 'POST',
    body: JSON.stringify({
      mode: 'refine',
      preview_task_id: options.preview_task_id,
      enable_pbr: options.enable_pbr ?? true,
      ai_model: options.ai_model || 'latest',
      ...(options.texture_prompt && { texture_prompt: options.texture_prompt }),
    }),
  });
  return result;
}

/**
 * Obtener estado de tarea Text to 3D
 */
export async function getTextTo3DTask(taskId: string): Promise<MeshyTask> {
  return meshyFetch<MeshyTask>(`/openapi/v2/text-to-3d/${taskId}`);
}

/**
 * Listar tareas Text to 3D
 */
export async function listTextTo3DTasks(pageSize = 10, pageNum = 1): Promise<MeshyTask[]> {
  return meshyFetch<MeshyTask[]>(`/openapi/v2/text-to-3d?page_size=${pageSize}&page_num=${pageNum}&sort_by=-created_at`);
}

/**
 * Eliminar tarea Text to 3D
 */
export async function deleteTextTo3DTask(taskId: string): Promise<void> {
  await meshyFetch(`/openapi/v2/text-to-3d/${taskId}`, { method: 'DELETE' });
}

// ============ IMAGE TO 3D API (v1) ============

/**
 * Crear tarea Image to 3D
 * Costo: 20-30 créditos según opciones
 */
export async function createImageTo3D(options: ImageTo3DOptions): Promise<string> {
  const { result } = await meshyFetch<{ result: string }>('/openapi/v1/image-to-3d', {
    method: 'POST',
    body: JSON.stringify({
      image_url: options.image_url,
      ai_model: options.ai_model || 'latest',
      topology: options.topology || 'triangle',
      target_polycount: options.target_polycount || 30000,
      should_remesh: options.should_remesh ?? true,
      should_texture: options.should_texture ?? true,
      enable_pbr: options.enable_pbr ?? false,
      ...(options.texture_prompt && { texture_prompt: options.texture_prompt }),
    }),
  });
  return result;
}

/**
 * Obtener estado de tarea Image to 3D
 */
export async function getImageTo3DTask(taskId: string): Promise<MeshyTask> {
  return meshyFetch<MeshyTask>(`/openapi/v1/image-to-3d/${taskId}`);
}

/**
 * Listar tareas Image to 3D
 */
export async function listImageTo3DTasks(pageSize = 10, pageNum = 1): Promise<MeshyTask[]> {
  return meshyFetch<MeshyTask[]>(`/openapi/v1/image-to-3d?page_size=${pageSize}&page_num=${pageNum}&sort_by=-created_at`);
}

/**
 * Eliminar tarea Image to 3D
 */
export async function deleteImageTo3DTask(taskId: string): Promise<void> {
  await meshyFetch(`/openapi/v1/image-to-3d/${taskId}`, { method: 'DELETE' });
}

// ============ RETEXTURE API (v1) ============

/**
 * Crear tarea de Retexture
 * Costo: 10 créditos
 */
export async function createRetexture(options: RetextureOptions): Promise<string> {
  if (!options.input_task_id && !options.model_url) {
    throw new MeshyError(400, 'Se requiere input_task_id o model_url');
  }
  if (!options.text_style_prompt && !options.image_style_url) {
    throw new MeshyError(400, 'Se requiere text_style_prompt o image_style_url');
  }

  const { result } = await meshyFetch<{ result: string }>('/openapi/v1/retexture', {
    method: 'POST',
    body: JSON.stringify({
      ...(options.input_task_id && { input_task_id: options.input_task_id }),
      ...(options.model_url && { model_url: options.model_url }),
      ...(options.text_style_prompt && { text_style_prompt: options.text_style_prompt }),
      ...(options.image_style_url && { image_style_url: options.image_style_url }),
      ai_model: options.ai_model || 'latest',
      enable_pbr: options.enable_pbr ?? false,
      enable_original_uv: options.enable_original_uv ?? true,
    }),
  });
  return result;
}

/**
 * Obtener estado de tarea Retexture
 */
export async function getRetextureTask(taskId: string): Promise<MeshyTask> {
  return meshyFetch<MeshyTask>(`/openapi/v1/retexture/${taskId}`);
}

/**
 * Listar tareas Retexture
 */
export async function listRetextureTasks(pageSize = 10, pageNum = 1): Promise<MeshyTask[]> {
  return meshyFetch<MeshyTask[]>(`/openapi/v1/retexture?page_size=${pageSize}&page_num=${pageNum}&sort_by=-created_at`);
}

/**
 * Eliminar tarea Retexture
 */
export async function deleteRetextureTask(taskId: string): Promise<void> {
  await meshyFetch(`/openapi/v1/retexture/${taskId}`, { method: 'DELETE' });
}

// ============ BALANCE API (v1) ============

/**
 * Obtener balance de créditos
 */
export async function getBalance(): Promise<number> {
  const { balance } = await meshyFetch<{ balance: number }>('/openapi/v1/balance');
  return balance;
}

// ============ UNIFIED TASK GETTER ============

export type TaskType = 'text-to-3d' | 'image-to-3d' | 'retexture';

/**
 * Obtener cualquier tipo de tarea por ID y tipo
 */
export async function getTask(taskId: string, type: TaskType): Promise<MeshyTask> {
  switch (type) {
    case 'text-to-3d':
      return getTextTo3DTask(taskId);
    case 'image-to-3d':
      return getImageTo3DTask(taskId);
    case 'retexture':
      return getRetextureTask(taskId);
    default:
      throw new MeshyError(400, `Tipo de tarea no soportado: ${type}`);
  }
}

/**
 * Eliminar cualquier tipo de tarea
 */
export async function deleteTask(taskId: string, type: TaskType): Promise<void> {
  switch (type) {
    case 'text-to-3d':
      return deleteTextTo3DTask(taskId);
    case 'image-to-3d':
      return deleteImageTo3DTask(taskId);
    case 'retexture':
      return deleteRetextureTask(taskId);
    default:
      throw new MeshyError(400, `Tipo de tarea no soportado: ${type}`);
  }
}

// ============ EXPORTS ============

export const meshy = {
  // Text to 3D
  textTo3D: {
    createPreview: createTextTo3DPreview,
    createRefine: createTextTo3DRefine,
    get: getTextTo3DTask,
    list: listTextTo3DTasks,
    delete: deleteTextTo3DTask,
  },
  // Image to 3D
  imageTo3D: {
    create: createImageTo3D,
    get: getImageTo3DTask,
    list: listImageTo3DTasks,
    delete: deleteImageTo3DTask,
  },
  // Retexture
  retexture: {
    create: createRetexture,
    get: getRetextureTask,
    list: listRetextureTasks,
    delete: deleteRetextureTask,
  },
  // Balance
  getBalance,
  // Unified
  getTask,
  deleteTask,
};

export default meshy;
