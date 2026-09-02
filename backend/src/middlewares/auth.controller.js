const jwt = require("jsonwebtoken");

const env =
  require("../../config/env");

const asyncHandler =
  require("../../shared/utils/asyncHandler");

const ApiResponse =
  require("../../shared/responses/ApiResponse");

const ApiError =
  require("../../shared/errors/ApiError");

const sendEmail =
  require("../../shared/utils/sendEmail");

const authService =
  require("./auth.service");

const User =
  require("../users/user.model");

const getRefreshCookieOptions = () => {
  return {
    httpOnly: true,

    secure:
      env.NODE_ENV === "production",

    sameSite:
      env.NODE_ENV === "production"
        ? "none"
        : "lax",

    maxAge:
      7 * 24 * 60 * 60 * 1000,
  };
};

const register = asyncHandler(
  async (req, res) => {
    const {
      user,
      accessToken,
      refreshToken,
    } =
      await authService.registerUser(
        req.body
      );

    res
      .status(201)
      .cookie(
        "refreshToken",
        refreshToken,
        getRefreshCookieOptions()
      )
      .json(
        new ApiResponse(
          201,
          "User registered successfully",
          {
            user: {
              id: user._id,
              name: user.name,
              email: user.email,
            },
            accessToken,
          }
        )
      );
  }
);

const login = asyncHandler(
  async (req, res) => {
    const {
      user,
      accessToken,
      refreshToken,
    } =
      await authService.loginUser(
        req.body
      );

    res
      .status(200)
      .cookie(
        "refreshToken",
        refreshToken,
        getRefreshCookieOptions()
      )
      .json(
        new ApiResponse(
          200,
          "Login successful",
          {
            user: {
              id: user._id,
              name: user.name,
              email: user.email,
            },
            accessToken,
          }
        )
      );
  }
);

const logout = asyncHandler(
  async (req, res) => {
    await authService.logoutUser(
      req.user.userId
    );

    res
      .clearCookie(
        "refreshToken",
        getRefreshCookieOptions()
      )
      .status(200)
      .json(
        new ApiResponse(
          200,
          "Logout successful"
        )
      );
  }
);

const getMe = asyncHandler(
  async (req, res) => {
    const user =
      await authService.getCurrentUser(
        req.user.userId
      );

    res.status(200).json(
      new ApiResponse(
        200,
        "Current user fetched successfully",
        user
      )
    );
  }
);

const refreshToken = asyncHandler(
  async (req, res) => {
    const token =
      req.cookies.refreshToken;

    if (!token) {
      throw new ApiError(
        401,
        "Refresh token is required"
      );
    }

    let decoded;

    try {
      decoded =
        jwt.verify(
          token,
          env.JWT_REFRESH_SECRET
        );
    } catch (error) {
      throw new ApiError(
        401,
        "Invalid or expired refresh token"
      );
    }

    const user =
      await User.findById(
        decoded.userId
      ).select("+refreshToken");

    if (!user) {
      throw new ApiError(
        401,
        "User not found"
      );
    }

    if (
      user.refreshToken !== token
    ) {
      throw new ApiError(
        401,
        "Refresh token is invalid"
      );
    }

    const result =
      await authService.refreshAccessToken(
        user._id
      );

    res.status(200).json(
      new ApiResponse(
        200,
        "Access token refreshed successfully",
        result
      )
    );
  }
);

const forgotPassword = asyncHandler(
  async (req, res) => {
    const result =
      await authService.forgotPassword(
        req.body.email
      );

    if (result) {
      const {
        user,
        resetToken,
      } = result;

      const resetUrl =
        `${env.CLIENT_URL}` +
        `/reset-password/${resetToken}`;

      await sendEmail({
        to: user.email,

        subject:
          "Reset your StudySphere password",

        html: `
          <h2>Password Reset Request</h2>

          <p>
            You requested a password reset.
          </p>

          <p>
            Click below to reset your password.
          </p>

          <a href="${resetUrl}">
            Reset Password
          </a>

          <p>
            This link expires in 10 minutes.
          </p>
        `,
      });
    }

    res.status(200).json(
      new ApiResponse(
        200,
        "If an account exists with this email, a password reset link has been sent."
      )
    );
  }
);

const resetPassword = asyncHandler(
  async (req, res) => {
    await authService.resetPassword(
      req.params.token,
      req.body.password
    );

    res.status(200).json(
      new ApiResponse(
        200,
        "Password reset successfully. Please login again."
      )
    );
  }
);

module.exports = {
  register,
  login,
  logout,
  getMe,
  refreshToken,
  forgotPassword,
  resetPassword,
};