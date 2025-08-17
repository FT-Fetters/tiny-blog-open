# 使用官方 Node.js 运行时作为基础镜像
FROM node:18-alpine AS base

# 用户权限参数
ARG USER_ID=1001
ARG GROUP_ID=1001

# 安装依赖阶段
FROM base AS deps
# 检查 https://github.com/nodejs/docker-node/tree/b4117f9333da4138b03a546ec926ef50a31506c3#nodealpine
# 以了解为什么可能需要 libc6-compat
RUN apk add --no-cache libc6-compat
WORKDIR /app

# 安装依赖
COPY package.json pnpm-lock.yaml* ./
RUN corepack enable pnpm && pnpm i --frozen-lockfile

# 构建阶段
FROM base AS builder
WORKDIR /app
COPY --from=deps /app/node_modules ./node_modules
COPY . .

# 设置环境变量
ENV NEXT_TELEMETRY_DISABLED 1
ENV BUILD_STANDALONE 1

# 构建应用
RUN corepack enable pnpm && pnpm build

# 生产镜像，复制所有文件并运行 Next.js
FROM base AS runner
WORKDIR /app

# 安装必要工具：bash 和 su-exec（Alpine 原生的 gosu 替代品）
RUN apk add --no-cache bash su-exec

# 传递用户权限参数
ARG USER_ID=1001
ARG GROUP_ID=1001

ENV NODE_ENV production
ENV NEXT_TELEMETRY_DISABLED 1
ENV USER_ID=${USER_ID}
ENV GROUP_ID=${GROUP_ID}

# 创建用户组和用户（使用动态 ID）
RUN addgroup --system --gid ${GROUP_ID} nodejs
RUN adduser --system --uid ${USER_ID} --ingroup nodejs nextjs

# 复制构建产物
COPY --from=builder /app/public ./public

# 保留原始配置文件作为备份（用于首次初始化）并设置权限
RUN mkdir -p /app/config.original .next && \
    chown nextjs:nodejs .next

COPY --from=builder /app/config/site.config.json /app/config.original/site.config.json

# 复制构建产物
COPY --from=builder --chown=nextjs:nodejs /app/.next/standalone ./
COPY --from=builder --chown=nextjs:nodejs /app/.next/static ./.next/static

# 复制启动脚本
COPY --from=builder --chmod=755 /app/docker/docker-entrypoint.sh /app/docker-entrypoint.sh

# 创建必要的目录结构
RUN mkdir -p /app/content/posts /app/content/pages /app/config /app/public/images && \
    chown -R nextjs:nodejs /app/content /app/config /app/public

# 不再使用特定用户，由 entrypoint 脚本处理权限
# USER nextjs

EXPOSE 3000

ENV PORT 3000
ENV HOSTNAME "0.0.0.0"

# 使用启动脚本处理权限和初始化
ENTRYPOINT [ "/app/docker-entrypoint.sh" ]
CMD ["node", "server.js"]