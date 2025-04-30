import jwt from 'jsonwebtoken';
import db from '../models/index.js';

const User = db.user;

export const signup = async (userData) => {
    // Check if email already exists
    const existingUser = await User.findOne({ where: { email: userData.email } });
    if (existingUser) {
        throw new Error('Email already in use');
    }

    try {
        
        await User.build(userData).validate();
    } catch (validationError) {
        throw new Error(validationError.errors.map(err => err.message).join(', '));
    }


    const user = await User.create({
        ...userData,
        password: userData.password 
    });

    return user;
};

export const signin = async (email, password) => {
    const user = await User.findOne({ where: { email } });

    if (!user) {
        throw new Error('User not found');
    }

    if (password !== user.password) {
        throw new Error('Invalid password');
    }

    const token = jwt.sign({ id: user.id }, process.env.JWT_SECRET, {
        expiresIn: 86400 // 24 hours
    });

    return {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role,
        accessToken: token
    };
};

export const changePassword = async (userId, oldPassword, newPassword) => {
    const user = await User.findByPk(userId);
    if (!user) {
        throw new Error('User not found');
    }


    if (oldPassword !== user.password) {
        throw new Error('Invalid current password');
    }


    user.password = newPassword;
    await user.save();
};