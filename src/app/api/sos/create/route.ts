import { NextResponse } from 'next/server';
import { getDb, saveDb } from '@/lib/db_json';
import { getUserSession } from '@/lib/auth';

// Enhanced MCDM Prioritization Algorithm v2
// Factors: Battery, Disaster Type, Severity, Group Size, Time Decay
function calculatePriority(
    type: string, 
    severity: string, 
    battery: number, 
    groupSize: number,
    environment: string
) {
    let score = 0;
    const reasons: string[] = [];

    // ── Factor 1: Battery Level (Weight: ~25%) ──
    if (battery < 10) {
        score += 25;
        reasons.push(`⚡ CRITICAL battery at ${battery}% — imminent communication blackout.`);
    } else if (battery < 20) {
        score += 20;
        reasons.push(`⚡ Low battery (${battery}%). Estimated 15-30min survival window.`);
    } else if (battery < 40) {
        score += 10;
        reasons.push(`Battery at ${battery}%, monitoring drain curve.`);
    }

    // ── Factor 2: Disaster Type (Weight: ~30%) ──
    const typeScores: Record<string, number> = {
        'Trapped': 30,
        'Fire': 28,
        'Flood': 22,
        'Medical': 20,
        'Earthquake': 30,
        'Chemical': 28
    };
    const typeMessages: Record<string, string> = {
        'Trapped': '🏚️ Victim is physically trapped under structural collapse.',
        'Fire': '🔥 Active fire/smoke hazard. Risk of rapid spread.',
        'Flood': '🌊 Rising water levels. Potential drowning risk.',
        'Medical': '🩺 Requires immediate medical intervention.',
        'Earthquake': '🌍 Earthquake aftermath. Aftershock risk.',
        'Chemical': '☣️ Chemical exposure detected. HAZMAT protocol.'
    };
    score += typeScores[type] || 15;
    reasons.push(typeMessages[type] || `Emergency type: ${type}.`);

    // ── Factor 3: Severity Multiplier (Weight: ~20%) ──
    if (severity === 'Severe') {
        score += 20;
        reasons.push('🔴 Severity: CRITICAL — Life-threatening condition.');
    } else if (severity === 'Moderate') {
        score += 10;
        reasons.push('🟡 Severity: MODERATE — Requires prompt attention.');
    } else {
        score += 3;
        reasons.push('🟢 Severity: MINOR — Stable but needs assistance.');
    }

    // ── Factor 4: Group Size (Weight: ~15%) ──
    if (groupSize > 5) {
        score += 15;
        reasons.push(`👥 Group of ${groupSize} people. Mass casualty protocol.`);
    } else if (groupSize > 2) {
        score += 8;
        reasons.push(`👥 Group of ${groupSize} people at location.`);
    } else if (groupSize > 1) {
        score += 4;
        reasons.push(`👥 ${groupSize} people reported at location.`);
    }

    // ── Factor 5: Environmental Conditions (Weight: ~10%) ──
    if (environment === 'Night') {
        score += 8;
        reasons.push('🌙 Nighttime operation — reduced visibility, higher risk.');
    } else if (environment === 'Rain') {
        score += 6;
        reasons.push('🌧️ Heavy rain/storm conditions complicating rescue.');
    } else if (environment === 'Extreme_Heat') {
        score += 5;
        reasons.push('🌡️ Extreme heat — dehydration/heatstroke risk elevated.');
    }

    // Cap score at 100
    score = Math.min(score, 100);

    // Assign rank
    let rank = 'Low';
    if (score >= 70) rank = 'Critical';
    else if (score >= 45) rank = 'High';
    else if (score >= 25) rank = 'Medium';

    const explanation = reasons.join(' ');

    return { score, rank, explanation };
}

export async function POST(req: Request) {
    try {
        const session = await getUserSession();
        if (!session) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        const body = await req.json();
        const { 
            disaster_type, 
            injury_severity, 
            battery_level, 
            location_lat, 
            location_lng,
            group_size = 1,
            environment = 'Normal'
        } = body;

        const { score, rank, explanation } = calculatePriority(
            disaster_type, injury_severity, battery_level, group_size, environment
        );

        const db = getDb();
        const newSignal = {
            id: 'sig_' + Math.random().toString(36).substr(2, 9),
            userId: session.userId,
            disaster_type,
            injury_severity,
            battery_level,
            group_size,
            environment,
            priority_score: score,
            ai_explanation: `[MCDM Triage · Rank: ${rank} · Score: ${score}/100]\n${explanation}`,
            location_lat: location_lat || null,
            location_lng: location_lng || null,
            status: 'PENDING',
            createdAt: new Date().toISOString()
        };

        db.signals.push(newSignal);
        saveDb(db);

        return NextResponse.json({ success: true, signalId: newSignal.id, rank, score });
    } catch (error) {
        console.error(error);
        return NextResponse.json({ error: 'Failed to create SOS' }, { status: 500 });
    }
}
