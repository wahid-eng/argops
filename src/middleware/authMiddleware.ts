import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';

export interface AuthRequest extends Request {
	userId?: string; // Optional userId property
}

const authMiddleware = (
	req: AuthRequest,
	res: Response,
	next: NextFunction
): any => {
	const token = req.headers['authorization']?.split(' ')[1];
	if (!token) return res.status(403).json({ message: 'No token provided' });

	jwt.verify(token, process.env.JWT_SECRET as string, (err, decoded) => {
		if (err) return res.status(401).json({ message: 'Unauthorized' });

		// Check if decoded is of type JwtPayload and has id property
		if (typeof decoded !== 'string' && decoded?.id) {
			req.userId = decoded.id; // Safely assign userId to request
			next();
		} else {
			return res.status(401).json({ message: 'Unauthorized' });
		}
	});
};

export default authMiddleware;
