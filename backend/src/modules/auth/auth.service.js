const bcrypt = require('bcryptjs');
const repo = require('./auth.repository');
const { generateToken } = require('../../utils/jwt');

const register = async (username, password, role = 'user') => {
  const exist = await repo.findByUsername(username);
  if (exist) throw new Error('Username already exists');

  // const hashed = await bcrypt.hash(password, 10);
  // return repo.createUser(username, hashed, role);
  return repo.createUser(username, password, role);
};

const login = async (username, password) => {
  const user = await repo.findByUsername(username);
  if (!user) throw new Error('User not found');

  // const valid = await bcrypt.compare(password, user.password);
  // if (!valid) throw new Error('Wrong password');

  return generateToken({
    id: user.id,
    username: user.username
  });
};

const getAllUsers = async () => {
  return await repo.findAll();
};

const getUserById = async (id) => {
  const user = await repo.findById(id);
  if (!user) throw new Error('User not found');
  return user;
};

const deleteUser = async (id) => {
  const user = await repo.findById(id);
  if (!user) throw new Error('User not found');
  
  await repo.deleteUser(id);
  return { message: 'User deleted successfully' };
};

const updateUser = async (id, username, password, role) => {
  const user = await repo.updateUser(id, username, password, role);
  if (!user) throw new Error('User not found');
  return user;
};

module.exports = {
  register,
  login,
  getAllUsers,
  getUserById,
  deleteUser,
  updateUser
};