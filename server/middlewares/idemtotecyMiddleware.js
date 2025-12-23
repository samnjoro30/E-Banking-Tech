module.exports = function idempotencyMiddleware(req, res, next) {
  const idempotencyKey = req.headers['idempotency-key'];

  if (!idempotencyKey) {
    return res.status(400).json({
      message: 'Idempotency-Key header is required',
    });
  }

  if (typeof idempotencyKey !== 'string' || idempotencyKey.length < 8) {
    return res.status(400).json({
      message: 'Invalid Idempotency-Key',
    });
  }

  req.idempotencyKey = idempotencyKey;

  next();
};
