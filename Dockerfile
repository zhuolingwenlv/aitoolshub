FROM node:18-slim

WORKDIR /app

# 安装依赖
COPY package.json package-lock.json ./
RUN npm install --registry=https://mirrors.cloud.tencent.com/npm/ \
    --no-audit --no-fund --prefer-offline

# 拷贝所有代码
COPY . .

# 构建（生成 dist/index.js）
RUN npm run build

# 创建运行时目录
RUN mkdir -p /app/public/pdfs /app/uploads/evidence
VOLUME ["/app/uploads", "/app/public/pdfs"]

# 时区设置
ENV NODE_ENV=production TZ=Asia/Shanghai
RUN ln -snf /usr/share/zoneinfo/$TZ /etc/localtime && echo $TZ > /etc/timezone

EXPOSE 3000

# 运行构建产物
CMD ["node", "dist/index.js"]
