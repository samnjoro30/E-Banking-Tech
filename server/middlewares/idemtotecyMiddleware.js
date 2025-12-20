const redis = require('redis');
const client = redis.createClient();

const idempotencyMiddleware = async (req, res, next) => {
  const key = req.headers['idempotency-key'];

  if (!key) return next();

  try {
    const cachedResponse = await client.get(key);
    if (cachedResponse) {
      const { status, body } = JSON.parse(cachedResponse);
      return res.status(status).json(body);
    }

    const originalSend = res.send;
    res.send = function (body) {
      client.setEx(
        key,
        86400,
        JSON.stringify({ status: res.statusCode, body: JSON.parse(body) })
      );
      originalSend.call(this, body);
    };

    next();
  } catch (err) {
    next(err);
  }
};

module.exports = idempotencyMiddleware;
