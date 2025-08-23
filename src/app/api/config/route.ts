import { NextRequest, NextResponse } from 'next/server';
import { loadServerSiteConfig as getSiteConfigServer, saveServerSiteConfig, validateSiteConfig } from '@/lib/config.server';
import { extractTokenFromRequest, verifyToken } from '@/lib/auth';
import { SiteConfig } from '@/types';

// 强制动态渲染，禁用缓存
export const dynamic = 'force-dynamic';
export const revalidate = 0;

export async function GET() {
  try {
    const config = getSiteConfigServer();
    
    const response = NextResponse.json({
      success: true,
      data: config
    });
    
    // 禁用缓存，确保每次都获取最新配置
    response.headers.set('Cache-Control', 'no-store, no-cache, must-revalidate, proxy-revalidate');
    response.headers.set('Pragma', 'no-cache');
    response.headers.set('Expires', '0');
    response.headers.set('Surrogate-Control', 'no-store');
    
    return response;
  } catch (error) {
    console.error('❌ 配置API错误:', error);
    return NextResponse.json(
      { 
        success: false,
        error: '获取配置失败', 
        details: String(error) 
      },
      { status: 500 }
    );
  }
}

export async function PUT(request: NextRequest) {
  try {
    // 使用完整的权限验证逻辑
    const token = extractTokenFromRequest(request);
    
    if (!token) {
      return NextResponse.json(
        { 
          success: false, 
          error: '未授权访问',
          message: '需要管理员权限才能修改配置'
        },
        { status: 401 }
      );
    }

    const payload = verifyToken(token);
    
    if (!payload || payload.role !== 'admin') {
      return NextResponse.json(
        { 
          success: false, 
          error: '未授权访问',
          message: '需要管理员权限才能修改配置'
        },
        { status: 401 }
      );
    }

    const body = await request.json();
    const config = body as Partial<SiteConfig>;

    // 验证配置数据
    const validationErrors = validateSiteConfig(config);
    if (validationErrors.length > 0) {
      return NextResponse.json(
        { 
          success: false, 
          error: '配置验证失败',
          errors: validationErrors
        },
        { status: 400 }
      );
    }

    // 保存配置
    const completeConfig = config as SiteConfig;
    saveServerSiteConfig(completeConfig);
    
    const response = NextResponse.json({
      success: true,
      data: completeConfig,
      message: '配置保存成功'
    });
    
    // 禁用缓存
    response.headers.set('Cache-Control', 'no-store, no-cache, must-revalidate, proxy-revalidate');
    response.headers.set('Pragma', 'no-cache');
    response.headers.set('Expires', '0');
    response.headers.set('Surrogate-Control', 'no-store');
    
    return response;
  } catch (error) {
    console.error('❌ 配置保存API错误:', error);
    return NextResponse.json(
      { 
        success: false,
        error: '保存配置失败', 
        details: String(error) 
      },
      { status: 500 }
    );
  }
}