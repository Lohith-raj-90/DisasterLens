import { NextResponse } from 'next/server';
import bcrypt from 'bcryptjs';
import { signToken } from '@/lib/auth';
import { db } from '@/lib/db';
import { loginSchema } from '@/lib/validations';

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const parsed = loginSchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json({ error: parsed.error.issues[0]?.message || 'Validation error' }, { status: 400 });
    }

    const { name, password } = parsed.data;
    const user = await db.user.findFirst({ where: { name: { equals: name } } });

    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    const isValid = await bcrypt.compare(password, user.password);
    if (!isValid) {
      return NextResponse.json({ error: 'Invalid password' }, { status: 401 });
    }

    const token = signToken(user.id, user.role);
    const response = NextResponse.json({
      user: { id: user.id, name: user.name, role: user.role },
    });

    response.cookies.set('dl_token', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      path: '/',
    });

    return response;
  } catch {
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
