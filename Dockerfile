FROM node:18-slim

WORKDIR /app

# 安装系统依赖（CA证书 + 中文字体）
RUN apt-get update && apt-get install -y --no-install-recommends \
    ca-certificates fonts-wqy-zenhei \
    && update-ca-certificates \
    && rm -rf /var/lib/apt/lists/*

# 安装 npm 依赖
COPY package.json package-lock.json ./
RUN npm install --registry=https://mirrors.cloud.tencent.com/npm/ \
    --no-audit --no-fund --prefer-offline

# 拷贝中文字体（PDF生成用 — 提交在fonts/目录下）
COPY fonts/ /app/fonts/

# 拷贝所有代码
COPY . .

# 构建（生成 dist/index.js）
RUN npm run build

# 创建运行时目录
RUN mkdir -p /app/public/pdfs /app/uploads/evidence
VOLUME ["/app/uploads", "/app/public/pdfs"]

# 时区设置
ENV NODE_ENV=production TZ=Asia/Shanghai NODE_TLS_REJECT_UNAUTHORIZED=0
RUN ln -snf /usr/share/zoneinfo/$TZ /etc/localtime && echo $TZ > /etc/timezone

EXPOSE 3000

# 运行构建产物
CMD ["node", "dist/index.js"]
