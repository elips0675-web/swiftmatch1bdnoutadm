
import { NextResponse } from 'next/server';
import pool from '@/lib/mysql-connector';
import { verifyToken } from '@/lib/jwt';

// Обработка лайков и создание совпадений (matches)
export async function POST(request: Request) {
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
    const { to_user_id, status }: { to_user_id: number; status: 'liked' | 'disliked' } = await request.json();

    if (!to_user_id || !status) {
      return NextResponse.json({ message: 'Missing required fields' }, { status: 400 });
    }

    const connection = await pool.getConnection();

    try {
      await connection.beginTransaction();

      // 1. Записываем действие (лайк или дизлайк)
      await connection.query(
        'INSERT INTO likes (from_user_id, to_user_id, status) VALUES (?, ?, ?)',
        [currentUserId, to_user_id, status]
      );

      let match = false;

      // 2. Если это лайк, проверяем на взаимность
      if (status === 'liked') {
        const [rows] = await connection.query(
          'SELECT id FROM likes WHERE from_user_id = ? AND to_user_id = ? AND status = \'liked\'',
          [to_user_id, currentUserId]
        );

        const reciprocalLike = (rows as any[])[0];

        if (reciprocalLike) {
          // 3. Взаимный лайк найден! Создаем совпадение (match) и чат.
          match = true;

          // Создаем запись в таблице matches
          const [matchResult] = await connection.query(
            'INSERT INTO matches (user1_id, user2_id) VALUES (?, ?)',
            [currentUserId, to_user_id]
          );
          const matchId = (matchResult as any).insertId;

          // Создаем новый чат для этой пары
          const [chatResult] = await connection.query(
            'INSERT INTO chats (match_id, created_at) VALUES (?, NOW())',
            [matchId]
          );
          const chatId = (chatResult as any).insertId;
          
          // Добавляем обоих пользователей в чат
          await connection.query('INSERT INTO chat_participants (chat_id, user_id) VALUES (?, ?), (?, ?)', [chatId, currentUserId, chatId, to_user_id]);
        }
      }

      await connection.commit();

      return NextResponse.json({ success: true, match }, { status: 200 });

    } catch (error) {
      await connection.rollback();
      throw error;
    } finally {
      connection.release();
    }

  } catch (error) {
    console.error('Error processing like/dislike:', error);
    return NextResponse.json({ message: 'Internal Server Error' }, { status: 500 });
  }
}
