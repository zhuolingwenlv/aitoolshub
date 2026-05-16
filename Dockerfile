FROM node:18-slim

WORKDIR /app

# 安装依赖（tsx 在 dependencies 里，用于直接运行 TS 源码）
COPY package.json package-lock.json ./
RUN npm install --registry=https://mirrors.cloud.tencent.com/npm/ \
    --no-audit --no-fund --prefer-offline

# 拷贝所有代码（含预构建的 dist/）
COPY . .

# 创建运行时目录
RUN mkdir -p /app/public/pdfs

# 时区设置（腾讯云要求上海时区）
ENV NODE_ENV=production TZ=Asia/Shanghai
RUN ln -snf /usr/share/zoneinfo/$TZ /etc/localtime && echo $TZ > /etc/timezone

EXPOSE 3000

# 直接运行预构建的 dist/index.js
CMD ["node", "dist/index.js"]
