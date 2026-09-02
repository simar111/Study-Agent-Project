const crypto = require("crypto");

const ApiError = require(
  "../../shared/errors/ApiError"
);

const {
  generateAccessToken,
  generateRefreshToken,
} = require(
  "../../shared/utils/token"
);

const {
  findUserByEmail,
  findUserById,
  createUser,
  updateUserById,
} = require(
  "./auth.repository"
);

const registerUser = async ({
  name,
  email,
  password,
}) => {
  const existingUser =
    await findUserByEmail(email);

  if (existingUser) {
    throw new ApiError(
      409,
      "User already exists with this email"
    );
  }

  const user =
    await createUser({
      name,
      email,
      password,
    });

  const accessToken =
    generateAccessToken(user._id);

  const refreshToken =
    generateRefreshToken(user._id);

  user.refreshToken =
    refreshToken;

  await user.save();

  return {
    user,
    accessToken,
    refreshToken,
  };
};

const loginUser = async ({
  email,
  password,
}) => {
  const user =
    await findUserByEmail(email, {
      selectPassword: true,
    });

  if (!user) {
    throw new ApiError(
      401,
      "Invalid email or password"
    );
  }

  const isPasswordValid =
    await user.comparePassword(
      password
    );

  if (!isPasswordValid) {
    throw new ApiError(
      401,
      "Invalid email or password"
    );
  }

  const accessToken =
    generateAccessToken(user._id);

  const refreshToken =
    generateRefreshToken(user._id);

  user.refreshToken =
    refreshToken;

  await user.save({
    validateBeforeSave: false,
  });

  return {
    user,
    accessToken,
    refreshToken,
  };
};

const logoutUser = async (userId) => {
  await updateUserById(
    userId,
    {
      refreshToken: null,
    }
  );
};

const refreshAccessToken = async (
  userId
) => {
  const user =
    await findUserById(userId);

  if (!user) {
    throw new ApiError(
      401,
      "User not found"
    );
  }

  const accessToken =
    generateAccessToken(user._id);

  return {
    accessToken,
  };
};

const getCurrentUser = async (
  userId
) => {
  const user =
    await findUserById(userId);

  if (!user) {
    throw new ApiError(
      404,
      "User not found"
    );
  }

  return user;
};

const forgotPassword = async (
  email
) => {
  const user =
    await findUserByEmail(email, {
      selectPassword: false,
    });

  // Security:
  // Don't reveal whether an email exists
  if (!user) {
    return null;
  }

  const resetToken =
    crypto.randomBytes(32)
      .toString("hex");

  const hashedToken =
    crypto
      .createHash("sha256")
      .update(resetToken)
      .digest("hex");

  user.passwordResetToken =
    hashedToken;

  user.passwordResetExpires =
    new Date(
      Date.now() +
        10 * 60 * 1000
    );

  await user.save({
    validateBeforeSave: false,
  });

  return {
    user,
    resetToken,
  };
};

const resetPassword = async (
  token,
  password
) => {
  const hashedToken =
    crypto
      .createHash("sha256")
      .update(token)
      .digest("hex");

  const user =
    await require("../users/user.model")
      .findOne({
        passwordResetToken:
          hashedToken,

        passwordResetExpires: {
          $gt: Date.now(),
        },
      })
      .select(
        "+passwordResetToken +passwordResetExpires"
      );

  if (!user) {
    throw new ApiError(
      400,
      "Reset token is invalid or expired"
    );
  }

  user.password = password;

  user.passwordResetToken = null;

  user.passwordResetExpires = null;

  user.refreshToken = null;

  await user.save();

  return user;
};

module.exports = {
  registerUser,
  loginUser,
  logoutUser,
  refreshAccessToken,
  getCurrentUser,
  forgotPassword,
  resetPassword,
};