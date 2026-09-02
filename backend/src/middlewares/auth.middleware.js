const jwt = require("jsonwebtoken");

const env =
  require("../config/env");

const ApiError =
  require("../shared/errors/ApiError");

const asyncHandler =
  require("../shared/utils/asyncHandler");

const protect = asyncHandler(
  async (req, res, next) => {
    let token;

    const authHeader =
      req.headers.authorization;

    if (
      authHeader &&
      authHeader.startsWith("Bearer ")
    ) {
      token =
        authHeader.split(" ")[1];
    }

    if (!token) {
      throw new ApiError(
        401,
        "Authentication token is required"
      );
    }

    try {
      const decoded =
        jwt.verify(
          token,
          env.JWT_ACCESS_SECRET
        );

      req.user = {
        userId: decoded.userId,
      };

      next();
    } catch (error) {
      throw new ApiError(
        401,
        "Invalid or expired access token"
      );
    }
  }
);

module.exports = {
  protect,
};