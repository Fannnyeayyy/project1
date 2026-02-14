const repo = require('./auth.repository');
const { generateToken } = require('../../utils/jwt');

const register = async (username, password, role = 'user') => {
  const exist = await repo.findByUsername(username);
  if (exist) throw new Error('Username already exists');
  return repo.createUser(username, password, role);
};

const login = async (username, password) => {
  const user = await repo.findByUsername(username);
  if (!user) throw new Error('User not found');

  const access_token = generateToken({
    id: user.id,
    username: user.username,
    role: user.role
  });

  return {
    access_token,
    user: {
      id: user.id,
      name: user.username,
      role: user.role
    }
  }
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