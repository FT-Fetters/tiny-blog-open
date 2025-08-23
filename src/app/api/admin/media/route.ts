import { NextRequest, NextResponse } from 'next/server';
import { withAdminAuth } from '@/lib/middleware';
import fs from 'fs';
import path from 'path';
import { writeFile } from 'fs/promises';

// 获取媒体文件列表
const handleGetMedia = withAdminAuth(async (request: NextRequest) => {
  try {
    const imagesDirectory = path.join(process.cwd(), 'content/images');
    
    if (!fs.existsSync(imagesDirectory)) {
      fs.mkdirSync(imagesDirectory, { recursive: true });
    }

    const files = fs.readdirSync(imagesDirectory);
    const mediaFiles = files
      .filter(file => /\.(jpg|jpeg|png|gif|webp|svg)$/i.test(file))
      .map(file => {
        const filePath = path.join(imagesDirectory, file);
        const stats = fs.statSync(filePath);
        
        return {
          name: file,
          path: `/api/images/${file}`,
          size: stats.size,
          createdAt: stats.birthtime.toISOString(),
          updatedAt: stats.mtime.toISOString(),
        };
      })
      .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());

    return NextResponse.json({
      success: true,
      data: mediaFiles
    });

  } catch (error) {
    console.error('获取媒体文件列表失败:', error);
    return NextResponse.json(
      { success: false, error: '获取媒体文件列表失败' },
      { status: 500 }
    );
  }
});

// 上传媒体文件
const handleUploadMedia = withAdminAuth(async (request: NextRequest) => {
  try {
    const formData = await request.formData();
    const file = formData.get('file') as File;

    if (!file) {
      return NextResponse.json(
        { success: false, error: '没有选择文件' },
        { status: 400 }
      );
    }

    // 验证文件类型
    const allowedTypes = ['image/jpeg', 'image/png', 'image/gif', 'image/webp', 'image/svg+xml'];
    if (!allowedTypes.includes(file.type)) {
      return NextResponse.json(
        { success: false, error: '不支持的文件类型' },
        { status: 400 }
      );
    }

    // 验证文件大小 (5MB)
    const maxSize = 5 * 1024 * 1024;
    if (file.size > maxSize) {
      return NextResponse.json(
        { success: false, error: '文件大小不能超过5MB' },
        { status: 400 }
      );
    }

    // 确保目录存在
    const imagesDirectory = path.join(process.cwd(), 'content/images');
    if (!fs.existsSync(imagesDirectory)) {
      fs.mkdirSync(imagesDirectory, { recursive: true });
    }

    // 生成安全的文件名
    const timestamp = Date.now();
    const originalName = file.name.replace(/[^a-zA-Z0-9.-]/g, '');
    const fileName = `${timestamp}-${originalName}`;
    const filePath = path.join(imagesDirectory, fileName);

    // 保存文件
    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);
    await writeFile(filePath, buffer);

    return NextResponse.json({
      success: true,
      message: '文件上传成功',
      data: {
        name: fileName,
        path: `/api/images/${fileName}`,
        size: file.size,
        type: file.type,
      }
    });

  } catch (error) {
    console.error('上传文件失败:', error);
    return NextResponse.json(
      { success: false, error: '上传文件失败' },
      { status: 500 }
    );
  }
});

export const GET = handleGetMedia;
export const POST = handleUploadMedia;