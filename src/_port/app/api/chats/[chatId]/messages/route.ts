
import { NextResponse } from 'next/server';
import pool from '@/lib/mysql-connector';
import { verifyToken } from '@/lib/jwt';

// Получение сообщений для чата
export async function GET(request: Request, { params }: { params: { chatId: string } }) {
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
    const chatId = parseInt(params.chatId, 10);

    // Проверка, что пользователь является участником этого чата
    const [chatRows] = await pool.query('SELECT user1_id, user2_id FROM chats WHERE id = ?', [chatId]);
    const chat = (chatRows as any)[0];

    if (!chat || (chat.user1_id !== currentUserId && chat.user2_id !== currentUserId)) {
        return NextResponse.json({ message: 'Forbidden' }, { status: 403 });
    }

    // Получаем сообщения
    const [messages] = await pool.query('SELECT id, sender_id, content, created_at FROM messages WHERE chat_id = ? ORDER BY created_at ASC', [chatId]);

    // Отмечаем сообщения как прочитанные (кроме своих)
    await pool.query('UPDATE messages SET is_read = 1 WHERE chat_id = ? AND sender_id != ?', [chatId, currentUserId]);

    return NextResponse.json(messages, { status: 200 });

  } catch (error) {
    console.error(`Error getting messages for chat ${params.chatId}:`, error);
    return NextResponse.json({ message: 'Internal Server Error' }, { status: 500 });
  }
}

// Отправка нового сообщения
export async function POST(request: Request, { params }: { params: { chatId: string } }) {
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
        const chatId = parseInt(params.chatId, 10);
        const { content } = await request.json();

        if (!content) {
            return NextResponse.json({ message: 'Message content is required' }, { status: 400 });
        }

        // Проверка, что пользователь является участником этого чата
        const [chatRows] = await pool.query('SELECT user1_id, user2_id FROM chats WHERE id = ?', [chatId]);
        const chat = (chatRows as any)[0];

        if (!chat || (chat.user1_id !== currentUserId && chat.user2_id !== currentUserId)) {
            return NextResponse.json({ message: 'Forbidden' }, { status: 403 });
        }

        // Сохраняем новое сообщение
        const [result] = await pool.query('INSERT INTO messages (chat_id, sender_id, content) VALUES (?, ?, ?)', [chatId, currentUserId, content]);
        
        const insertId = (result as any).insertId;
        
        // Получаем только что созданное сообщение, чтобы вернуть его клиенту
        const [messageRows] = await pool.query('SELECT * FROM messages WHERE id = ?', [insertId]);

        return NextResponse.json(messageRows[0], { status: 201 });

    } catch (error) {
        console.error(`Error sending message to chat ${params.chatId}:`, error);
        return NextResponse.json({ message: 'Internal Server Error' }, { status: 500 });
    }
}
