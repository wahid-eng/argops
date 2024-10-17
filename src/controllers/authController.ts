import { Request, Response } from 'express';
import User from '../models/User';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { AuthRequest } from '../middleware/authMiddleware';

export const register = async (req: Request, res: Response): Promise<any> => {
	const { username, email, password } = req.body;

	const existingUser = await User.findOne({ email });
	if (existingUser) {
		return res.status(400).json({ message: 'User already exists' });
	}

	const hashedPassword = await bcrypt.hash(password, 10);
	const user = new User({ username, email, password: hashedPassword });

	await user.save();
	res.status(201).json({ message: 'User registered successfully' });
};

export const login = async (req: Request, res: Response): Promise<any> => {
	const { email, password } = req.body;

	const user = await User.findOne({ email });
	if (!user || !(await bcrypt.compare(password, user.password))) {
		return res.status(401).json({ message: 'Invalid credentials' });
	}

	const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET as string, {
		expiresIn: '1h',
	});
	res.json({ token });
};

export const getProfile = async (
	req: AuthRequest,
	res: Response
): Promise<any> => {
	try {
		const user = req.userId; // Assuming req.user is added via middleware

		if (!user) {
			res.status(404).json({ message: 'User not found' });
			return; // Exit early if no user found
		}

		res.json({ user });
	} catch (error) {
		res.status(500).json({ message: 'Server error' });
	}
};
