
import { NextResponse } from 'next/server';
import pool from '@/lib/mysql-connector';
import bcrypt from 'bcryptjs';

export async function POST(request: Request) {
  try {
    const { email, password, displayName } = await request.json();

    // Проверка на наличие email и пароля
    if (!email || !password) {
      return NextResponse.json({ message: 'Email and password are required' }, { status: 400 });
    }

    // Проверка, не существует ли уже пользователь с таким email
    const [rows] = await pool.query('SELECT * FROM users WHERE email = ?', [email]);
    if (Array.isArray(rows) && rows.length > 0) {
        return NextResponse.json({ message: 'User with this email already exists' }, { status: 409 });
    }

    // Хеширование пароля
    const hashedPassword = await bcrypt.hash(password, 10);

    // Сохранение нового пользователя в БД
    await pool.query('INSERT INTO users (email, password, displayName) VALUES (?, ?, ?)', [email, hashedPassword, displayName]);

    return NextResponse.json({ message: 'User registered successfully' }, { status: 201 });

  } catch (error) {
    console.error('Registration error:', error);
    return NextResponse.json({ message: 'Internal Server Error' }, { status: 500 });
  }
}
