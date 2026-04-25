
import { NextResponse } from 'next/server';
import pool from '@/lib/mysql-connector';
import { verifyToken } from '@/lib/jwt';

export async function GET(request: Request) {
  try {
    const authHeader = request.headers.get('authorization');
    const token = authHeader?.split(' ')?.[1];

    if (!token) {
      return NextResponse.json({ message: 'Unauthorized: No token provided' }, { status: 401 });
    }

    const decoded = verifyToken(token) as { userId: number };
    if (!decoded) {
        return NextResponse.json({ message: 'Unauthorized: Invalid token' }, { status: 401 });
    }

    const currentUserId = decoded.userId;

    const [rows] = await pool.query('SELECT id, email, displayName, bio, interests, photos, gender, birthDate, location, createdAt FROM users WHERE id = ?', [currentUserId]);

    if (!Array.isArray(rows) || rows.length === 0) {
        return NextResponse.json({ message: 'User not found' }, { status: 404 });
    }

    const userProfile = rows[0];

    // Парсим JSON поля, если они не null
    if (userProfile.interests) {
        userProfile.interests = JSON.parse(userProfile.interests);
    } else {
        userProfile.interests = [];
    }
    if (userProfile.photos) {
        userProfile.photos = JSON.parse(userProfile.photos);
    } else {
        userProfile.photos = [];
    }

    return NextResponse.json(userProfile, { status: 200 });

  } catch (error) {
    console.error('Get My Profile Error:', error);
    // Специальная обработка ошибок парсинга JSON
    if (error instanceof SyntaxError) {
        return NextResponse.json({ message: 'Failed to parse user data' }, { status: 500 });
    }
    return NextResponse.json({ message: 'Internal Server Error' }, { status: 500 });
  }
}
