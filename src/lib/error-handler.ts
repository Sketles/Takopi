// Error handler utility for API routes
import { NextResponse } from 'next/server';
import { AppError, isAppError } from './errors';
import { logger } from './logger';
import { ZodError } from 'zod';

export interface ErrorResponse {
  error: {
    code: string;
    message: string;
    statusCode: number;
    fields?: Record<string, string>;
    timestamp: string;
  };
}

export function handleApiError(error: unknown): NextResponse<ErrorResponse> {
  const timestamp = new Date().toISOString();

  // App Errors (personalizados)
  if (isAppError(error)) {
    logger.error('API Error', {
      code: error.code,
      message: error.message,
      statusCode: error.statusCode,
    });

    return NextResponse.json(
      {
        error: {
          code: error.code,
          message: error.message,
          statusCode: error.statusCode,
          fields: error instanceof AppError && 'fields' in error ? (error as any).fields : undefined,
          timestamp,
        },
      },
      { status: error.statusCode }
    );
  }

  // Zod Validation Errors
  if (error instanceof ZodError) {
    const fields = error.flatten().fieldErrors;
    const fieldMap = Object.entries(fields).reduce(
      (acc, [field, messages]) => {
        acc[field] = messages?.join(', ') || 'Invalid value';
        return acc;
      },
      {} as Record<string, string>
    );

    logger.warn('Validation Error', { fields: fieldMap });

    return NextResponse.json(
      {
        error: {
          code: 'VALIDATION_ERROR',
          message: 'Validación fallida',
          statusCode: 400,
          fields: fieldMap,
          timestamp,
        },
      },
      { status: 400 }
    );
  }

  // Generic Errors
  const message = error instanceof Error ? error.message : 'Error desconocido';
  logger.error('Unhandled Error', { message, error });

  return NextResponse.json(
    {
      error: {
        code: 'INTERNAL_ERROR',
        message: 'Error interno del servidor',
        statusCode: 500,
        timestamp,
      },
    },
    { status: 500 }
  );
}
