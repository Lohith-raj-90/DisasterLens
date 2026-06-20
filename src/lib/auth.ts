import jwt from 'jsonwebtoken';
import { cookies } from 'next/headers';

const JWT_SECRET = process.env.JWT_SECRET || 'disaster-lens-super-secret-key-2024';

export const signToken = (userId: string, role: string) => {
    return jwt.sign({ userId, role }, JWT_SECRET, { expiresIn: '1d' });
};

export const verifyToken = (token: string) => {
    try {
        return jwt.verify(token, JWT_SECRET) as { userId: string, role: string };
    } catch (e) {
        return null;
    }
};

export const getUserSession = async () => {
    const cookieStore = await cookies();
    const token = cookieStore.get('dl_token')?.value;
    if (!token) return null;
    return verifyToken(token);
};
