const service = require('./auth.service');

const register = async (req, res) => {
  try {
    const { username, password, role } = req.body;
    await service.register(username, password, role);
    res.json({ message: 'Register success' });
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

const login = async (req, res) => {
  try {
    const { username, password } = req.body;
    console.log(username, password);
    const token = await service.login(username, password);
    res.json({ token });
  } catch (err) {
    res.status(401).json({ message: err.message });
  }
};

const getAllUsers = async (req, res) => {
  try {
    const users = await service.getAllUsers();
    res.json(users);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

const getUserById = async (req, res) => {
  try {
    const user = await service.getUserById(req.params.id);
    res.json(user);
  } catch (err) {
    res.status(404).json({ message: err.message });
  }
};

const deleteUser = async (req, res) => {
  try {
    await service.deleteUser(req.params.id);
    res.json({ message: 'User deleted successfully' });
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

const updateUser = async (req, res) => {
  try {
    const { username, password, role } = req.body;
    const user = await service.updateUser(req.params.id, username, password, role);
    res.json({ message: 'User updated successfully', user });
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

module.exports = { 
  register, 
  login, 
  getAllUsers, 
  getUserById, 
  deleteUser,
  updateUser
};