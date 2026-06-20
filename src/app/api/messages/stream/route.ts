import { NextResponse } from 'next/server';
import { getDb } from '@/lib/db_json';
import { getUserSession } from '@/lib/auth';

export const dynamic = 'force-dynamic';

export async function GET(req: Request) {
    try {
        const session = await getUserSession();
        if (!session) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        const db = getDb();
        const messages = (db.messages || []).filter((m: any) => {
            // Show messages where user is sender or recipient, or broadcast messages (no recipientId)
            return m.senderId === session.userId || 
                   m.recipientId === session.userId || 
                   !m.recipientId;
        }).sort((a: any, b: any) => new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime());

        return NextResponse.json({ messages });
    } catch (error) {
        return NextResponse.json({ error: 'Failed to fetch messages' }, { status: 500 });
    }
}
