
import { NextResponse } from 'next/server';
import pool from '@/lib/mysql-connector';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';

export async function POST(request: Request) {
  try {
    const { email, password } = await request.json();

    if (!email || !password) {
      return NextResponse.json({ message: 'Email and password are required' }, { status: 400 });
    }

    // Поиск пользователя в базе данных
    const [rows] = await pool.query('SELECT * FROM users WHERE email = ?', [email]);

    if (!Array.isArray(rows) || rows.length === 0) {
      return NextResponse.json({ message: 'Invalid credentials' }, { status: 401 });
    }

    const user = rows[0] as any;

    // Сравнение предоставленного пароля с хешем в базе
    const isPasswordValid = await bcrypt.compare(password, user.password);

    if (!isPasswordValid) {
      return NextResponse.json({ message: 'Invalid credentials' }, { status: 401 });
    }

    // Создание JWT-токена
    const token = jwt.sign(
      { userId: user.id, email: user.email },
      process.env.JWT_SECRET || 'your_default_secret_key', // Важно использовать секретный ключ из переменных окружения
      { expiresIn: '1h' } // Время жизни токена
    );

    // Возвращаем токен клиенту
    return NextResponse.json({ token }, { status: 200 });

  } catch (error) {
    console.error('Login error:', error);
    return NextResponse.json({ message: 'Internal Server Error' }, { status: 500 });
  }
}
