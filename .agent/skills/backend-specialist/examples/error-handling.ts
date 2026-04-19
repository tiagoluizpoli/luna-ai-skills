/**
 * STRUCTURED ERROR HANDLING SYSTEM
 * 
 * Demonstrates:
 * 1. Base Domain Error classes.
 * 2. Semantic Error Codes.
 * 3. Client-safe error formatting.
 * 4. Global error handling logic.
 */

// 1. SEMANTIC ERROR CODES
export enum ErrorCode {
  VALIDATION_FAILED = 'VALIDATION_FAILED',
  UNAUTHORIZED = 'UNAUTHORIZED',
  FORBIDDEN = 'FORBIDDEN',
  NOT_FOUND = 'NOT_FOUND',
  CONFLICT = 'CONFLICT',
  INTERNAL_ERROR = 'INTERNAL_ERROR',
  REPOSITORY_ERROR = 'REPOSITORY_ERROR',
}

// 2. BASE DOMAIN ERROR
export abstract class DomainError extends Error {
  constructor(
    public readonly code: ErrorCode,
    message: string,
    public readonly statusCode: number = 500,
    public readonly details?: Record<string, any>
  ) {
    super(message);
    this.name = this.constructor.name;
    Object.setPrototypeOf(this, new.target.prototype);
  }

  /**
   * Formats the error for safe public exposure (API responses).
   * Redacts stack traces and internal details.
   */
  toPublicResponse() {
    return {
      error: {
        code: this.code,
        message: this.message,
        details: this.details,
      },
    };
  }
}

// 3. CONCRETE ERROR CLASSES
export class ValidationError extends DomainError {
  constructor(message: string, details?: Record<string, any>) {
    super(ErrorCode.VALIDATION_FAILED, message, 400, details);
  }
}

export class NotFoundError extends DomainError {
  constructor(id: string, entity: string) {
    super(ErrorCode.NOT_FOUND, `${entity} with ID '${id}' was not found`, 404);
  }
}

export class UnauthorizedError extends DomainError {
  constructor(message: string = 'Authentication required') {
    super(ErrorCode.UNAUTHORIZED, message, 401);
  }
}

// 4. GLOBAL HANDLER EXAMPLE (e.g., for Express or TanStack Start)
export function handleGlobalError(error: unknown) {
  // If it's a domain error we already know how to handle it
  if (error instanceof DomainError) {
    console.warn(`[DomainError] ${error.code}: ${error.message}`);
    return error.toPublicResponse();
  }

  // Handle Unexpected Errors
  console.error('[CriticalError]', error);
  
  // Wrap in a generic Internal Error to avoid leaking system details
  const internalError = new InternalError('An unexpected error occurred');
  return internalError.toPublicResponse();
}

class InternalError extends DomainError {
  constructor(message: string) {
    super(ErrorCode.INTERNAL_ERROR, message, 500);
  }
}
