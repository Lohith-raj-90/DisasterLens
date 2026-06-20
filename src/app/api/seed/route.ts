import { NextResponse } from 'next/server';
import { getDb, saveDb } from '@/lib/db_json';
import bcrypt from 'bcryptjs';

export async function GET() {
  try {
    const db = getDb();
    db.signals = [];
    db.users = [];
    
    const passwordHash = await bcrypt.hash('disaster123', 10);
    const usersData = [
      { id: 'u1', name: 'Cmdr. Lohith', role: 'RESCUER', lat: 12.9716, lng: 77.5946 },
      { id: 'u2', name: 'Cmdr. Rakshith', role: 'RESCUER', lat: 12.9716, lng: 77.5946 },
      { id: 'u3', name: 'Chandana', role: 'VICTIM', lat: 12.9345, lng: 77.6265 },
      { id: 'u4', name: 'Sindhu', role: 'VICTIM', lat: 12.9915, lng: 77.5925 },
      { id: 'u5', name: 'Shalini', role: 'VICTIM', lat: 12.9141, lng: 77.5843 },
      { id: 'u6', name: 'Keerthi', role: 'VICTIM', lat: 12.9354, lng: 77.5348 },
      { id: 'u7', name: 'Madan', role: 'VICTIM', lat: 12.9784, lng: 77.6408 },
      { id: 'u8', name: 'Meghana', role: 'VICTIM', lat: 12.9081, lng: 77.6476 },
      { id: 'u9', name: 'Keertana', role: 'VICTIM', lat: 12.9850, lng: 77.5539 },
      { id: 'u10', name: 'Maanya', role: 'VICTIM', lat: 13.0279, lng: 77.5409 }
    ];

    for (const u of usersData) {
      db.users.push({ 
        id: u.id, 
        name: u.name, 
        role: u.role, 
        password: passwordHash, 
        location_lat: u.lat, 
        location_lng: u.lng 
      });
    }
    saveDb(db);
    return NextResponse.json({ success: true, message: 'Seeded Indian User/Rescuer Data Successfully' });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to seed db' }, { status: 500 });
  }
}
