import jwt from 'jsonwebtoken';
import db from '../models/index.js';

export const verifyToken = (req, res, next) => {
  const token = req.headers['x-access-token'];

  if (!token) {
    return res.status(403).send({ message: 'No token provided!' });
  }

  jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
    if (err) {
      return res.status(401).send({ message: 'Unauthorized!' });
    }
    req.userId = decoded.id;
    next();
  });
};

export const isAdmin = async (req, res, next) => {
  try {
    const user = await db.user.findByPk(req.userId);
    if (user.role === 'admin') {
      next();
      return;
    }
    res.status(403).send({ message: 'Require Admin Role!' });
  } catch (error) {
    res.status(500).send({ message: error.message });
  }
};

export const isStoreOwner = async (req, res, next) => {
  try {
    const user = await db.user.findByPk(req.userId);
    if (user.role === 'store_owner') {
      next();
      return;
    }
    res.status(403).send({ message: 'Require Store Owner Role!' });
  } catch (error) {
    res.status(500).send({ message: error.message });
  }
};

export const isUser = async (req, res, next) => {
  try {
    const user = await db.user.findByPk(req.userId);
    if (user.role === 'user') {
      next();
      return;
    }
    res.status(403).send({ message: 'Require User Role!' });
  } catch (error) {
    res.status(500).send({ message: error.message });
  }
};