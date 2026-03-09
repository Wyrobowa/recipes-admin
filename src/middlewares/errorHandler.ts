import type { ErrorRequestHandler } from 'express';
import { AppError } from '../errors/AppError';

type PgError = {
  code?: string;
  detail?: string;
};

const errorHandler: ErrorRequestHandler = (error, _req, res, _next) => {
  if (error instanceof AppError) {
    return res.status(error.statusCode).json({
      error: {
        message: error.message,
        details: error.details,
      },
    });
  }

  const pgError = error as PgError;

  if (pgError.code === '23503') {
    return res.status(400).json({
      error: {
        message: 'Invalid relation reference',
        details: pgError.detail,
      },
    });
  }

  if (pgError.code === '23505') {
    return res.status(409).json({
      error: {
        message: 'Unique constraint violation',
        details: pgError.detail,
      },
    });
  }

  console.error(error);

  return res.status(500).json({
    error: {
      message: 'Internal server error',
    },
  });
};

export { errorHandler };
