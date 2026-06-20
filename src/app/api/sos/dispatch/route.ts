import { NextResponse } from 'next/server';
import { getDb, saveDb } from '@/lib/db_json';
import { getUserSession } from '@/lib/auth';

export async function POST(req: Request) {
    try {
        const session = await getUserSession();
        if (!session || session.role !== 'RESCUER') {
            return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
        }

        const { signalId, action } = await req.json();
        // action can be 'DISPATCHED' or 'RESOLVED'

        const db = getDb();
        const signalIndex = db.signals.findIndex((s: any) => s.id === signalId);

        if (signalIndex === -1) {
            return NextResponse.json({ error: 'Signal not found' }, { status: 404 });
        }

        db.signals[signalIndex].status = action;

        // If dispatched, auto-add a message to the victim
        const signal = db.signals[signalIndex];
        const rescuer = db.users.find((u: any) => u.id === session.userId);
        if (!db.messages) db.messages = [];

        if (action === 'DISPATCHED') {
            db.messages.push({
                id: 'msg_' + Math.random().toString(36).substr(2, 9),
                senderId: session.userId,
                senderName: rescuer?.name || 'Rescue Command',
                senderRole: 'RESCUER',
                recipientId: signal.userId,
                signalId: signalId,
                content: `🚁 Rescue unit has been dispatched to your location. Hold on, help is en route. Keep your device powered on.`,
                timestamp: new Date().toISOString(),
                read: false
            });
        } else if (action === 'RESOLVED') {
            db.messages.push({
                id: 'msg_' + Math.random().toString(36).substr(2, 9),
                senderId: session.userId,
                senderName: rescuer?.name || 'Rescue Command',
                senderRole: 'RESCUER',
                recipientId: signal.userId,
                signalId: signalId,
                content: `✅ Your SOS has been resolved. Rescue operation marked as complete. Stay safe.`,
                timestamp: new Date().toISOString(),
                read: false
            });
        }

        saveDb(db);
        return NextResponse.json({ success: true, status: action });
    } catch (error) {
        return NextResponse.json({ error: 'Failed to update signal' }, { status: 500 });
    }
}
