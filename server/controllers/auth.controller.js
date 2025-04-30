import * as authService from '../services/auth.services.js';

export const signup = async (req, res) => {
  try {
    const user = await authService.signup(req.body);
    res.status(201).send({ message: 'User registered successfully!' });
  } catch (error) {
    res.status(400).send({ message: error.message });
  }
};

export const signin = async (req, res) => {
  try {
    const { email, password } = req.body;
    const result = await authService.signin(email, password);
    res.status(200).send(result);
  } catch (error) {
    res.status(401).send({ message: error.message });
  }
};

export const changePassword = async (req, res) => {
  try {
    const userId = req.userId;
    const { oldPassword, newPassword } = req.body;
    await authService.changePassword(userId, oldPassword, newPassword);
    res.status(200).send({ message: 'Password changed successfully' });
  } catch (error) {
    res.status(400).send({ message: error.message });
  }
};