import { validationResult } from 'express-validator';

export function validate(req, res, next) {
  const result = validationResult(req);
  if (result.isEmpty()) return next();
  const errors = {};
  result.array().forEach((e) => {
    if (!errors[e.path]) errors[e.path] = e.msg;
  });
  return res.status(422).json({ success: false, message: 'Validation failed', errors });
}

export function notFound(req, res) {
  res.status(404).json({ success: false, message: `Route ${req.originalUrl} not found` });
}

// eslint-disable-next-line no-unused-vars
export function errorHandler(err, req, res, next) {
  console.error('[error]', err);
  if (err.code === 11000) {
    return res.status(409).json({ success: false, message: 'Already exists' });
  }
  res.status(err.status || 500).json({
    success: false,
    message: err.status ? err.message : 'Something went wrong. Please try again.',
  });
}

export const asyncHandler = (fn) => (req, res, next) => Promise.resolve(fn(req, res, next)).catch(next);
