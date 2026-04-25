
import { NextResponse } from 'next/server';
import pool from '@/lib/mysql-connector';
import { verifyToken } from '@/lib/jwt';

export async function PUT(request: Request) {
  try {
    const authHeader = request.headers.get('authorization');
    const token = authHeader?.split(' ')?.[1];

    if (!token) {
      return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
    }

    const decoded = verifyToken(token) as { userId: number };
    if (!decoded) {
        return NextResponse.json({ message: 'Invalid token' }, { status: 401 });
    }

    const { displayName, bio, interests, photos, gender, birthDate, location } = await request.json();

    const currentUserId = decoded.userId;

    // Формируем запрос на обновление только для предоставленных полей
    const fieldsToUpdate: { [key: string]: any } = {};
    if (displayName) fieldsToUpdate.displayName = displayName;
    if (bio) fieldsToUpdate.bio = bio;
    if (interests) fieldsToUpdate.interests = JSON.stringify(interests);
    if (photos) fieldsToUpdate.photos = JSON.stringify(photos);
    if (gender) fieldsToUpdate.gender = gender;
    if (birthDate) fieldsToUpdate.birthDate = birthDate;
    if (location) fieldsToUpdate.location = location;

    const fieldEntries = Object.entries(fieldsToUpdate);
    if (fieldEntries.length === 0) {
        return NextResponse.json({ message: 'No fields to update' }, { status: 400 });
    }

    const setClause = fieldEntries.map(([key]) => `${key} = ?`).join(', ');
    const values = fieldEntries.map(([, value]) => value);

    await pool.query(`UPDATE users SET ${setClause} WHERE id = ?`, [...values, currentUserId]);

    return NextResponse.json({ message: 'Profile updated successfully' }, { status: 200 });

  } catch (error) {
    console.error('Update Profile Error:', error);
    return NextResponse.json({ message: 'Internal Server Error' }, { status: 500 });
  }
}
