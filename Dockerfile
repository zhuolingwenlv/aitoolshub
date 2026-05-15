FROM node:18-slim

WORKDIR /app

# 拷贝 package.json 和 lockfile
COPY package.json package-lock.json ./
# 安装依赖（tsx 在 dependencies 里，用于直接运行 TS 源码）
RUN npm install --registry=https://mirrors.cloud.tencent.com/npm/ \
    --no-audit --no-fund --prefer-offline

# 拷贝所有代码（包含 src/ 和已编译的 dist/）
COPY . .

# 编译 TypeScript → 生成 dist/index.js（esbuild，无类型检查，秒级完成）
# mysql2/sql-escaper/node:buffer 必须 external，否则 sql-escaper 内的动态 require 会打包失败
RUN npm install @types/node && npm run build

# 创建运行时目录
RUN mkdir -p /app/public/pdfs

# 时区设置（腾讯云要求上海时区）
ENV NODE_ENV=production TZ=Asia/Shanghai
RUN ln -snf /usr/share/zoneinfo/$TZ /etc/localtime && echo $TZ > /etc/timezone

EXPOSE 3000

# 直接运行源码（tsx 运行时编译，无需预编译）
CMD ["node", "dist/index.js"]
