
import { NextResponse } from 'next/server';
import pool from '@/lib/mysql-connector';
import { verifyToken } from '@/lib/jwt';

export async function GET(request: Request, { params }: { params: { chatId: string } }) {
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
    const chatId = parseInt(params.chatId, 10);

    // 1. Проверяем, является ли пользователь участником чата, и получаем идентификатор другого пользователя
    const [chatRows]: [any[], any] = await pool.query(
      'SELECT user1_id, user2_id FROM chats WHERE id = ? AND (user1_id = ? OR user2_id = ?)',
      [chatId, currentUserId, currentUserId]
    );

    if (chatRows.length === 0) {
      return NextResponse.json({ message: 'Chat not found or access denied' }, { status: 404 });
    }

    const chat = chatRows[0];
    const partnerId = chat.user1_id === currentUserId ? chat.user2_id : chat.user1_id;

    // 2. Получаем информацию о профиле партнера
    const [partnerRows]: [any[], any] = await pool.query(
      'SELECT id as user_id, displayName as name, photos as avatar FROM users WHERE id = ?',
      [partnerId]
    );
    
    if (partnerRows.length === 0) {
        return NextResponse.json({ message: 'Chat partner not found' }, { status: 404 });
    }

    const partner = partnerRows[0];

    // Фотографии хранятся в виде JSON-строки '["url1", "url2"]'
    // Фронтенд ожидает одну URL-строку аватара.
    try {
        const photos = JSON.parse(partner.avatar);
        partner.avatar = photos.length > 0 ? photos[0] : null;
    } catch (e) {
        partner.avatar = null; // или дефолтный аватар
    }
    
    partner.chat_id = chatId;

    return NextResponse.json(partner, { status: 200 });

  } catch (error) {
    console.error(`Error fetching chat details for chat ${params.chatId}:`, error);
    return NextResponse.json({ message: 'Internal Server Error' }, { status: 500 });
  }
}
