
import { NextResponse } from 'next/server';
import pool from '@/lib/mysql-connector';
import { verifyToken } from '@/lib/jwt';

// Получение пользователей для страницы поиска
export async function GET(request: Request) {
  try {
    const authHeader = request.headers.get('authorization');
    const token = authHeader?.split(' ')?.[1];

    if (!token) {
      return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
    }

    const decoded = verifyToken(token) as { userId: number };
    if (!decoded) {
      return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
    }

    const currentUserId = decoded.userId;

    // Этот запрос выбирает пользователей, которых текущий пользователь еще не лайкал/дизлайкал
    // В реальном приложении здесь будет более сложная логика подбора (по геолокации, интересам и т.д.)
    const [rows] = await pool.query(`
        SELECT u.id, u.name, u.bio, u.age, u.city, 
               (SELECT url FROM photos WHERE user_id = u.id ORDER BY created_at DESC LIMIT 1) as avatar
        FROM users u
        LEFT JOIN likes l ON (l.from_user_id = ? AND l.to_user_id = u.id)
        WHERE u.id != ? AND l.id IS NULL
        LIMIT 50
    `, [currentUserId, currentUserId]);

    return NextResponse.json(rows, { status: 200 });

  } catch (error) {
    console.error('Error fetching users for search:', error);
    return NextResponse.json({ message: 'Internal Server Error' }, { status: 500 });
  }
}
