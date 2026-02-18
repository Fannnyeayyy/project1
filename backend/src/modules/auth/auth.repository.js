const User = require('../../models/user.model');
const bcrypt = require('bcryptjs');

const SALT_ROUNDS = 10;

const findByUsername = async (username) => {
  return await User.findOne({ where: { username } });
};

const createUser = async (username, password, role) => {
  // Hash password sebelum disimpan
  const hashedPassword = await bcrypt.hash(password, SALT_ROUNDS);
  return await User.create({ username, password: hashedPassword, role });
};

const verifyPassword = async (plain, hashed) => {
  return await bcrypt.compare(plain, hashed);
};

const findAll = async () => {
  return await User.findAll({ attributes: ['id', 'username', 'role', 'createdAt'] });
};

const findById = async (id) => {
  return await User.findByPk(id, { attributes: ['id', 'username', 'role', 'createdAt'] });
};

const deleteUser = async (id) => {
  return await User.destroy({ where: { id } });
};

const updateUser = async (id, username, password, role) => {
  const user = await User.findByPk(id);
  if (!user) return null;

  const updateData = { username, role };
  if (password && password.trim() !== "") {
    updateData.password = await bcrypt.hash(password, SALT_ROUNDS);
  }

  return await user.update(updateData);
};

module.exports = {
  findByUsername,
  createUser,
  verifyPassword,
  findAll,
  findById,
  deleteUser,
  updateUser
};