import 'dotenv/config'

export const config = {
  env: process.env.NODE_ENV || 'development',
  port: parseInt(process.env.PORT || '3000'),
  host: process.env.HOST || '0.0.0.0',

  jwt: {
    secret: process.env.JWT_SECRET || 'qxt_jwt_dev_secret_2026',
    expiresIn: '7d',
  },

  llm: {
    // 优先使用硅基流动（DeepSeek模型，便宜）
    siliconFlow: {
      apiKey: process.env.SILICONFLOW_API_KEY || '',
      baseUrl: process.env.SILICONFLOW_BASE_URL || 'https://api.siliconflow.cn/v1',
      model: 'deepseek-ai/DeepSeek-V3-0324', // 性价比最高
    },
    // 备选 DeepSeek
    deepseek: {
      apiKey: process.env.DEEPSEEK_API_KEY || '',
      baseUrl: process.env.DEEPSEEK_BASE_URL || 'https://api.deepseek.com/v1',
      model: 'deepseek-chat',
    },
  },

  db: {
    host: process.env.DB_HOST || 'localhost',
    port: parseInt(process.env.DB_PORT || '3306'),
    user: process.env.DB_USER || 'root',
    password: process.env.DB_PASSWORD || '',
    name: process.env.DB_NAME || 'qxt_db',
  },
}
