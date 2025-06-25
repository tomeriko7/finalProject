// utils/generateToken.js
import jwt from 'jsonwebtoken';

// Generate access token (short-lived)
const generateToken = (userId) => {
  return jwt.sign(
    { 
      userId,
      type: 'access'
    }, 
    process.env.JWT_SECRET || 'flower-shop-secret-key-2024', 
    {
      expiresIn: process.env.JWT_EXPIRE || '7d',
      issuer: 'flower-shop',
      audience: 'flower-shop-users'
    }
  );
};

// Generate refresh token (long-lived)
const generateRefreshToken = (userId) => {
  return jwt.sign(
    { 
      userId,
      type: 'refresh'
    }, 
    process.env.REFRESH_TOKEN_SECRET || 'flower-shop-refresh-secret-2024', 
    {
      expiresIn: process.env.REFRESH_TOKEN_EXPIRE || '30d',
      issuer: 'flower-shop',
      audience: 'flower-shop-users'
    }
  );
};

// Verify access token
const verifyToken = (token) => {
  try {
    const decoded = jwt.verify(
      token, 
      process.env.JWT_SECRET || 'flower-shop-secret-key-2024',
      {
        issuer: 'flower-shop',
        audience: 'flower-shop-users'
      }
    );

    // Check if it's an access token
    if (decoded.type !== 'access') {
      throw new Error('Invalid token type');
    }

    return decoded;
  } catch (error) {
    if (error.name === 'TokenExpiredError') {
      throw new Error('Token has expired');
    } else if (error.name === 'JsonWebTokenError') {
      throw new Error('Invalid token');
    } else if (error.name === 'NotBeforeError') {
      throw new Error('Token not yet valid');
    } else {
      throw new Error('Token verification failed');
    }
  }
};

// Verify refresh token
const verifyRefreshToken = (token) => {
  try {
    const decoded = jwt.verify(
      token, 
      process.env.REFRESH_TOKEN_SECRET || 'flower-shop-refresh-secret-2024',
      {
        issuer: 'flower-shop',
        audience: 'flower-shop-users'
      }
    );

    // Check if it's a refresh token
    if (decoded.type !== 'refresh') {
      throw new Error('Invalid token type');
    }

    return decoded;
  } catch (error) {
    if (error.name === 'TokenExpiredError') {
      throw new Error('Refresh token has expired');
    } else if (error.name === 'JsonWebTokenError') {
      throw new Error('Invalid refresh token');
    } else if (error.name === 'NotBeforeError') {
      throw new Error('Refresh token not yet valid');
    } else {
      throw new Error('Refresh token verification failed');
    }
  }
};

// Generate both tokens at once
const generateTokenPair = (userId) => {
  const accessToken = generateToken(userId);
  const refreshToken = generateRefreshToken(userId);
  
  return {
    accessToken,
    refreshToken,
    expiresIn: process.env.JWT_EXPIRE || '7d'
  };
};

// Decode token without verification (useful for getting info)
const decodeToken = (token) => {
  try {
    return jwt.decode(token, { complete: true });
  } catch (error) {
    throw new Error('Failed to decode token');
  }
};

// Check if token is expired (without verification)
const isTokenExpired = (token) => {
  try {
    const decoded = jwt.decode(token);
    if (!decoded || !decoded.exp) {
      return true;
    }
    
    const currentTime = Math.floor(Date.now() / 1000);
    return decoded.exp < currentTime;
  } catch (error) {
    return true;
  }
};

// Get token expiration time
const getTokenExpiration = (token) => {
  try {
    const decoded = jwt.decode(token);
    if (!decoded || !decoded.exp) {
      return null;
    }
    
    return new Date(decoded.exp * 1000);
  } catch (error) {
    return null;
  }
};

// Generate token for email verification
const generateEmailVerificationToken = (userId, email) => {
  return jwt.sign(
    { 
      userId,
      email,
      type: 'email_verification'
    }, 
    process.env.EMAIL_VERIFICATION_SECRET || 'flower-shop-email-secret-2024', 
    {
      expiresIn: '24h',
      issuer: 'flower-shop',
      audience: 'flower-shop-email-verification'
    }
  );
};

// Generate token for password reset
const generatePasswordResetToken = (userId, email) => {
  return jwt.sign(
    { 
      userId,
      email,
      type: 'password_reset',
      timestamp: Date.now() // Add timestamp for extra security
    }, 
    process.env.PASSWORD_RESET_SECRET || 'flower-shop-reset-secret-2024', 
    {
      expiresIn: '1h', // Short expiration for security
      issuer: 'flower-shop',
      audience: 'flower-shop-password-reset'
    }
  );
};

// Verify email verification token
const verifyEmailVerificationToken = (token) => {
  try {
    const decoded = jwt.verify(
      token, 
      process.env.EMAIL_VERIFICATION_SECRET || 'flower-shop-email-secret-2024',
      {
        issuer: 'flower-shop',
        audience: 'flower-shop-email-verification'
      }
    );

    if (decoded.type !== 'email_verification') {
      throw new Error('Invalid token type');
    }

    return decoded;
  } catch (error) {
    throw new Error('Invalid email verification token');
  }
};

// Verify password reset token
const verifyPasswordResetToken = (token) => {
  try {
    const decoded = jwt.verify(
      token, 
      process.env.PASSWORD_RESET_SECRET || 'flower-shop-reset-secret-2024',
      {
        issuer: 'flower-shop',
        audience: 'flower-shop-password-reset'
      }
    );

    if (decoded.type !== 'password_reset') {
      throw new Error('Invalid token type');
    }

    return decoded;
  } catch (error) {
    throw new Error('Invalid password reset token');
  }
};

export {
  // Main token functions
  generateToken,
  generateRefreshToken,
  verifyToken,
  verifyRefreshToken,
  generateTokenPair,
  
  // Utility functions
  decodeToken,
  isTokenExpired,
  getTokenExpiration,
  
  // Special purpose tokens
  generateEmailVerificationToken,
  generatePasswordResetToken,
  verifyEmailVerificationToken,
  verifyPasswordResetToken
};