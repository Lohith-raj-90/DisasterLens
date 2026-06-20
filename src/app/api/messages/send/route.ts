import { NextResponse } from 'next/server';
import { getDb, saveDb } from '@/lib/db_json';
import { getUserSession } from '@/lib/auth';

export async function POST(req: Request) {
    try {
        const session = await getUserSession();
        if (!session) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        const { recipientId, content, signalId } = await req.json();

        const db = getDb();
        const sender = db.users.find((u: any) => u.id === session.userId);

        const message = {
            id: 'msg_' + Math.random().toString(36).substr(2, 9),
            senderId: session.userId,
            senderName: sender?.name || 'Unknown',
            senderRole: session.role,
            recipientId: recipientId || null,
            signalId: signalId || null,
            content,
            timestamp: new Date().toISOString(),
            read: false
        };

        if (!db.messages) db.messages = [];
        db.messages.push(message);
        saveDb(db);

        return NextResponse.json({ success: true, message });
    } catch (error) {
        return NextResponse.json({ error: 'Failed to send message' }, { status: 500 });
    }
}
