import { ZodError } from 'zod';
import { AppError, ErrorCode } from '../entities/errors';

export interface ErrorPayload {
  code: ErrorCode;
  message: string;
}

export type IpcResult<T> =
  | { ok: true; value: T }
  | { ok: false; error: ErrorPayload };

export const toErrorPayload = (error: unknown): ErrorPayload => {
  if (error instanceof AppError) {
    return { code: error.code, message: error.message };
  }
  if (error instanceof ZodError) {
    return { code: ErrorCode.Validation, message: 'Données invalides' };
  }
  return { code: ErrorCode.Unknown, message: 'Erreur inattendue' };
};

export class ClientError extends Error {
  constructor(
    readonly code: ErrorCode,
    message: string,
  ) {
    super(message);
    this.name = 'ClientError';
  }
}
