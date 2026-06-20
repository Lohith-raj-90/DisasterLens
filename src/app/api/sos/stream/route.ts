import { NextResponse } from 'next/server';
import { getDb } from '@/lib/db_json';
import { getUserSession } from '@/lib/auth';

export const dynamic = 'force-dynamic';

export async function GET() {
    try {
        const session = await getUserSession();
        if (!session || session.role !== 'RESCUER') {
            return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
        }

        const db = getDb();
        const activeSignals = db.signals
            .filter((s: any) => s.status !== 'RESOLVED')
            .map((s: any) => ({
                ...s,
                user: db.users.find((u: any) => u.id === s.userId) || { name: 'Unknown' }
            }))
            .sort((a: any, b: any) => b.priority_score - a.priority_score);

        return NextResponse.json({ signals: activeSignals });
    } catch (e) {
        return NextResponse.json({ error: 'Failed to fetch signals' }, { status: 500 });
    }
}
