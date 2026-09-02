const User = require("../users/user.model");

const findUserByEmail = async (
  email,
  options = {}
) => {
  let query = User.findOne({ email });

  if (options.selectPassword) {
    query = query.select("+password");
  }

  return query;
};

const findUserById = async (
  userId,
  options = {}
) => {
  let query = User.findById(userId);

  if (options.selectSensitiveFields) {
    query = query.select(
      "+password +refreshToken +passwordResetToken +passwordResetExpires"
    );
  }

  return query;
};

const createUser = async (userData) => {
  return User.create(userData);
};

const updateUserById = async (
  userId,
  updateData
) => {
  return User.findByIdAndUpdate(
    userId,
    updateData,
    {
      new: true,
      runValidators: true,
    }
  );
};

module.exports = {
  findUserByEmail,
  findUserById,
  createUser,
  updateUserById,
};