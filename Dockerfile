FROM node:18-slim

WORKDIR /app

# 先拷贝依赖文件并安装（利用 Docker 缓存层）
COPY package.json package-lock.json ./
RUN npm install --registry=https://mirrors.cloud.tencent.com/npm/ \
    --no-audit --no-fund --prefer-offline

# 再拷贝所有代码
COPY . .

# 编译 TypeScript → 生成 dist/index.js（--force 跳过缓存强制安装 @types/node）
RUN npm install --force && npm run build

# 时区设置（腾讯云要求上海时区）
ENV TZ=Asia/Shanghai
RUN ln -snf /usr/share/zoneinfo/$TZ /etc/localtime && echo $TZ > /etc/timezone

EXPOSE 3000

# 微信云托管从 /app/dist/index.js 启动
CMD ["node", "dist/index.js"]
