
import { NextResponse } from 'next/server';
import pool from '@/lib/mysql-connector';
import { verifyToken } from '@/lib/jwt';

export async function GET(request: Request, { params }: { params: { userId: string } }) {
  try {
    const authHeader = request.headers.get('authorization');
    const token = authHeader?.split(' ')?.[1];

    if (!token) {
      return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
    }

    const decoded = verifyToken(token);
    if (!decoded) {
        return NextResponse.json({ message: 'Invalid token' }, { status: 401 });
    }

    const { userId } = params;

    const [rows] = await pool.query('SELECT id, displayName, bio, interests, photos, gender, birthDate, location FROM users WHERE id = ?', [userId]);

    if (!Array.isArray(rows) || rows.length === 0) {
        return NextResponse.json({ message: 'User not found' }, { status: 404 });
    }

    const userProfile = rows[0];

    return NextResponse.json(userProfile, { status: 200 });

  } catch (error) {
    console.error('Get Profile Error:', error);
    return NextResponse.json({ message: 'Internal Server Error' }, { status: 500 });
  }
}
