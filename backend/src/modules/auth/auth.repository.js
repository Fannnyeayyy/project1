const User = require('../../models/user.model');

const findAll = async () => {
  return await User.findAll({
    attributes: ['id', 'username','role', 'password' , 'createdAt', 'updatedAt']
  });
};

const findById = async (id) => {
  return await User.findByPk(id, {
    attributes: ['id', 'username', 'role', 'createdAt', 'updatedAt']
  });
};

const findByUsername = async (username) => {
  return User.findOne({ where: { username } });
};

const createUser = async (username, password, role) => {
  return User.create({ username, password, role });
};

module.exports = {
  findByUsername,
  createUser,
  findAll,
  findById
};
