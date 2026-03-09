import type { RequestHandler } from 'express';
import type { ZodError, ZodType } from 'zod';
import { AppError } from '../errors/AppError';

type ValidationTarget = 'body' | 'params' | 'query';

const formatZodError = (error: ZodError) =>
  error.issues.map((issue) => ({
    path: issue.path.join('.'),
    message: issue.message,
  }));

const validate = (
  schema: ZodType,
  target: ValidationTarget = 'body',
): RequestHandler => {
  return (req, _res, next) => {
    const result = schema.safeParse(req[target]);

    if (!result.success) {
      return next(
        new AppError('Validation failed', 400, formatZodError(result.error)),
      );
    }

    req[target] = result.data;
    return next();
  };
};

export { validate };
