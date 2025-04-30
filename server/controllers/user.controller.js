import * as userService from '../services/user.services.js';

export const getAllUsers = async (req, res) => {
  try {
    const users = await userService.getAllUsers(req.query);
    res.status(200).send(users);
  } catch (error) {
    res.status(500).send({ message: error.message });
  }
};

export const getUser = async (req, res) => {
  try {
    const user = await userService.getUserById(req.params.id);
    res.status(200).send(user);
  } catch (error) {
    res.status(404).send({ message: error.message });
  }
};

export const createUser = async (req, res) => {
  try {
    const user = await userService.createUser(req.body);
    res.status(201).send(user);
  } catch (error) {
    res.status(400).send({ message: error.message });
  }
};

export const updateUser = async (req, res) => {
  try {
    const user = await userService.updateUser(req.params.id, req.body);
    res.status(200).send(user);
  } catch (error) {
    res.status(400).send({ message: error.message });
  }
};

export const deleteUser = async (req, res) => {
  try {
    await userService.deleteUser(req.params.id);
    res.status(200).send({ message: 'User deleted successfully' });
  } catch (error) {
    res.status(400).send({ message: error.message });
  }
};