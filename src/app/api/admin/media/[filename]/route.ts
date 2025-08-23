import { NextRequest, NextResponse } from 'next/server';
import { withAdminAuth } from '@/lib/middleware';
import fs from 'fs';
import path from 'path';

// 删除媒体文件
const handleDeleteMedia = withAdminAuth(async (request: NextRequest, { params }: { params: { filename: string } }) => {
  try {
    const { filename } = params;
    
    if (!filename) {
      return NextResponse.json(
        { success: false, error: '文件名不能为空' },
        { status: 400 }
      );
    }

    // 验证文件名安全性
    if (filename.includes('../') || filename.includes('..\\')) {
      return NextResponse.json(
        { success: false, error: '非法的文件名' },
        { status: 400 }
      );
    }

    const imagesDirectory = path.join(process.cwd(), 'content/images');
    const filePath = path.join(imagesDirectory, filename);

    if (!fs.existsSync(filePath)) {
      return NextResponse.json(
        { success: false, error: '文件不存在' },
        { status: 404 }
      );
    }

    // 删除文件
    fs.unlinkSync(filePath);

    return NextResponse.json({
      success: true,
      message: '文件删除成功'
    });

  } catch (error) {
    console.error('删除文件失败:', error);
    return NextResponse.json(
      { success: false, error: '删除文件失败' },
      { status: 500 }
    );
  }
});

export const DELETE = handleDeleteMedia;