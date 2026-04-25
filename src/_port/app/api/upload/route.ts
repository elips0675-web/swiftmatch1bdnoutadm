
import { NextResponse } from 'next/server';
import { writeFile, mkdir } from 'fs/promises';
import path from 'path';
import { verifyToken } from '@/lib/jwt';

export async function POST(request: Request) {
  // 1. Проверяем, авторизован ли пользователь
  const authHeader = request.headers.get('authorization');
  const token = authHeader?.split(' ')?.[1];
  if (!token || !verifyToken(token)) {
    return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
  }

  try {
    // 2. Получаем данные формы, включая файл
    const data = await request.formData();
    const file: File | null = data.get('file') as unknown as File;

    if (!file) {
      return NextResponse.json({ message: 'Файл не был загружен' }, { status: 400 });
    }

    // 3. Конвертируем файл в буфер
    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);

    // 4. Создаем директорию для загрузок, если она не существует
    const uploadDir = path.join(process.cwd(), 'public', 'uploads');
    try {
      await mkdir(uploadDir, { recursive: true });
    } catch (e: any) {
      if (e.code !== 'EEXIST') {
        console.error('Не удалось создать директорию', e);
        return NextResponse.json({ message: 'Ошибка на сервере при создании директории' }, { status: 500 });
      }
    }

    // 5. Генерируем уникальное имя файла и полный путь
    const filename = `${Date.now()}-${file.name.replace(/\s+/g, '-')}`;
    const filePath = path.join(uploadDir, filename);

    // 6. Сохраняем файл на сервере
    await writeFile(filePath, buffer);

    // 7. Возвращаем публичный URL файла
    const fileUrl = `/uploads/${filename}`;
    
    return NextResponse.json({ success: true, url: fileUrl }, { status: 200 });

  } catch (error) {
    console.error('Ошибка загрузки файла:', error);
    return NextResponse.json({ message: 'Внутренняя ошибка сервера' }, { status: 500 });
  }
}
