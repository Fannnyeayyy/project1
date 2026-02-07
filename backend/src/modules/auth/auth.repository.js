const User = require('../../models/user.model');

const findByUsername = async (username) => {
  return await User.findOne({ where: { username } });
};

const createUser = async (username, password, role) => {
  return await User.create({ username, password, role });
};

const findAll = async () => {
  return await User.findAll();
};

const findById = async (id) => {
  return await User.findByPk(id);
};

const deleteUser = async (id) => {
  return await User.destroy({ where: { id } });
};

const updateUser = async (id, username, password, role) => {
  const user = await User.findByPk(id);
  if (!user) return null;
  
  const updateData = { username, role };
  if (password && password.trim() !== "") {
    updateData.password = password;
  }
  
  return await user.update(updateData);
};

module.exports = {
  findByUsername,
  createUser,
  findAll,
  findById,
  deleteUser,
  updateUser
};