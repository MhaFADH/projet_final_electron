import { describe, it, expect } from 'vitest';
import { z } from 'zod';
import { toErrorPayload } from './errors';
import { InsufficientStockError, ErrorCode } from '../entities/errors';

describe('toErrorPayload', () => {
  it('maps an AppError to its code and message', () => {
    expect(toErrorPayload(new InsufficientStockError('Stock bas'))).toEqual({
      code: ErrorCode.InsufficientStock,
      message: 'Stock bas',
    });
  });

  it('maps a ZodError to a validation payload', () => {
    const result = z.string().safeParse(1);
    expect(toErrorPayload(result.success ? null : result.error)).toEqual({
      code: ErrorCode.Validation,
      message: 'Données invalides',
    });
  });

  it('maps an unknown error to UNKNOWN', () => {
    expect(toErrorPayload(new Error('boom'))).toEqual({
      code: ErrorCode.Unknown,
      message: 'Erreur inattendue',
    });
  });
});
