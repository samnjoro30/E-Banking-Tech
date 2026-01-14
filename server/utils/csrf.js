const crypto = require('crypto');

const CSRF_COOKIE = 'XSRF-TOKEN';

function generateToken() {
  return crypto.randomBytes(32).toString('hex');
}

/**
 * Sets CSRF cookie if missing
 */
function csrfMiddleware(req, res, next) {
  let token = req.cookies['XSRF-TOKEN'];

  if (!token) {
    token = generateToken();
    res.cookie('XSRF-TOKEN', token, {
      httpOnly: false, // frontend must read
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'none',
      path: '/',
    });
  }
  req.csrfToken = token;
  next();
}

/**
 * Explicit endpoint for frontend to fetch token
 */
function csrfEndpoint(req, res) {
  res.json({ csrfToken: req.csrfToken });
}

/**
 * Verify token on state-changing requests
 */
function verifyCsrf(req, res, next) {

  const tokenFromHeader = req.headers['x-csrf-token'];
  const tokenFromCookie = req.cookies['XSRF-TOKEN'];

  if (!tokenFromHeader || tokenFromHeader !== tokenFromCookie) {
    return res.status(403).json({ message: 'Invalid CSRF token' });
  }

  next();
}

/**
 * Rotate CSRF token (used after login)
 */
function rotateCsrf(req, res) {
  const newToken = generateToken();

  res.cookie('XSRF-TOKEN', newToken, {
    httpOnly: false,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'none',
    path: '/',
  });

  return newToken;
}

module.exports = {
  csrfMiddleware,
  verifyCsrf,
  csrfEndpoint,
  rotateCsrf,
};
