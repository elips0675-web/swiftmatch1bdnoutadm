
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

    // Сложный запрос для получения чатов, информации о собеседнике и последнего сообщения
    const query = `
      SELECT 
        c.id AS chat_id,
        other_user.id AS user_id,
        other_user.displayName AS name,
        other_user.photos AS avatar,
        last_message.content AS last_message,
        last_message.created_at AS last_message_timestamp,
        (SELECT COUNT(*) FROM messages m WHERE m.chat_id = c.id AND m.is_read = 0 AND m.sender_id != ?) AS unread_count
      FROM chats c
      JOIN users other_user ON (CASE WHEN c.user1_id = ? THEN c.user2_id ELSE c.user1_id END) = other_user.id
      LEFT JOIN (
          SELECT 
              m.chat_id, 
              m.content, 
              m.created_at
          FROM messages m
          INNER JOIN (
              SELECT chat_id, MAX(created_at) AS max_created_at FROM messages GROUP BY chat_id
          ) AS latest_msgs ON m.chat_id = latest_msgs.chat_id AND m.created_at = latest_msgs.max_created_at
      ) AS last_message ON c.id = last_message.chat_id
      WHERE c.user1_id = ? OR c.user2_id = ?
      ORDER BY last_message_timestamp DESC;
    `;

    const [rows] = await pool.query(query, [currentUserId, currentUserId, currentUserId, currentUserId]);

    // Обрабатываем результат, чтобы фото было строкой, а не JSON
    const chats = (rows as any[]).map(chat => {
        let avatar = null;
        if (chat.avatar) {
            try {
                const photos = JSON.parse(chat.avatar);
                if (Array.isArray(photos) && photos.length > 0) {
                    avatar = photos[0];
                }
            } catch (e) { /* оставляем avatar null, если парсинг не удался */ }
        }
        return { ...chat, avatar };
    });

    return NextResponse.json(chats, { status: 200 });

  } catch (error) {
    console.error('Get Chats Error:', error);
    return NextResponse.json({ message: 'Internal Server Error' }, { status: 500 });
  }
}
