FROM node:18-slim

WORKDIR /app

# 拷贝 package.json 和 lockfile
COPY package.json package-lock.json ./
# 安装依赖（tsx 在 dependencies 里，用于直接运行 TS 源码）
RUN npm install --registry=https://mirrors.cloud.tencent.com/npm/ \
    --no-audit --no-fund --prefer-offline

# 拷贝所有代码（包含已编译的 dist/，也包含 src/ 源码）
COPY . .

# 时区设置（腾讯云要求上海时区）
ENV TZ=Asia/Shanghai
RUN ln -snf /usr/share/zoneinfo/$TZ /etc/localtime && echo $TZ > /etc/timezone

EXPOSE 3000

# 直接运行源码（tsx 运行时编译，无需预编译）
CMD ["node", "dist/index.js"]
