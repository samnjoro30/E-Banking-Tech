const crypto = require('crypto');

const CSRF_COOKIE = 'XSRF-TOKEN';

function generateToken() {
  return crypto.randomBytes(32).toString('hex');
}

function csrfMiddleware(req, res, next) {
  let token = req.cookies[CSRF_COOKIE];

  if (!token) {
    token = generateToken();
    res.cookie(CSRF_COOKIE, token, {
      httpOnly: false, // MUST be readable by frontend
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
    });
  }

  req.csrfToken = token;
  next();
}

function verifyCsrf(req, res, next) {
  const tokenFromHeader = req.headers['x-csrf-token'];
  const tokenFromCookie = req.cookies[CSRF_COOKIE];

  if (!tokenFromHeader || tokenFromHeader !== tokenFromCookie) {
    return res.status(403).json({ message: 'Invalid CSRF token' });
  }

  next();
}

module.exports = { csrfMiddleware, verifyCsrf };
