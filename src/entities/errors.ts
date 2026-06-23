export const ErrorCode = {
  Validation: 'VALIDATION',
  InsufficientStock: 'INSUFFICIENT_STOCK',
  ProductNotFound: 'PRODUCT_NOT_FOUND',
  Unknown: 'UNKNOWN',
} as const;

export type ErrorCode = (typeof ErrorCode)[keyof typeof ErrorCode];

export class AppError extends Error {
  constructor(
    readonly code: ErrorCode,
    message: string,
  ) {
    super(message);
    this.name = new.target.name;
  }
}

export class InsufficientStockError extends AppError {
  constructor(message: string) {
    super(ErrorCode.InsufficientStock, message);
  }
}

export class ProductNotFoundError extends AppError {
  constructor(message: string) {
    super(ErrorCode.ProductNotFound, message);
  }
}
