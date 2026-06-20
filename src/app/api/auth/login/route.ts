import { NextResponse } from 'next/server';
import { getDb } from '@/lib/db_json';
import bcrypt from 'bcryptjs';
import { signToken } from '@/lib/auth';

export async function POST(req: Request) {
    try {
        const { name, password } = await req.json();
        const db = getDb();
        
        const user = db.users.find((u: any) => u.name.toLowerCase() === name.toLowerCase());

        if (!user) {
            return NextResponse.json({ error: 'User not found' }, { status: 404 });
        }

        const isValid = await bcrypt.compare(password, user.password);
        
        if (!isValid) {
            return NextResponse.json({ error: 'Invalid password' }, { status: 401 });
        }

        const token = signToken(user.id, user.role);

        const response = NextResponse.json({
            user: { id: user.id, name: user.name, role: user.role }
        });

        response.cookies.set('dl_token', token, {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: 'strict',
            path: '/'
        });

        return response;

    } catch (error) {
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
    }
}
