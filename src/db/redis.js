/**
 * Redis 连接模块（微信云托管自带Redis）
 * 用途：AI队列、支付锁、限流、缓存
 */
import Redis from 'ioredis'

let redis = null
let redisAvailable = false

function getConfig() {
  return {
    host: process.env.REDIS_HOST || '127.0.0.1',
    port: Number(process.env.REDIS_PORT || '6379'),
    password: process.env.REDIS_PASSWORD || '',
    db: Number(process.env.REDIS_DB || '0'),
  }
}

export async function initRedis() {
  const cfg = getConfig()
  try {
    redis = new Redis({
      host: cfg.host,
      port: cfg.port,
      password: cfg.password || undefined,
      db: cfg.db,
      connectTimeout: 5000,
      maxRetriesPerRequest: 3,
      retryStrategy(times) {
        if (times > 3) {
          console.warn('[Redis] 连接失败，降级运行（无Redis模式）')
          return null
        }
        return Math.min(times * 500, 2000)
      },
      lazyConnect: true,
    })

    await redis.connect()
    await redis.ping()
    redisAvailable = true
    console.log('[Redis] ✅ 连接成功:', cfg.host + ':' + cfg.port)
    return redis
  } catch (e) {
    redisAvailable = false
    console.warn('[Redis] 连接失败，降级运行:', String(e))
    redis = null
    return null
  }
}

export function getRedis() {
  return redis
}

export function isRedisAvailable() {
  return redisAvailable && redis !== null
}

// ============ AI生成队列（Redis List，简单可靠） ============
const AI_QUEUE_KEY = 'qxt:ai:queue'
const AI_PROCESSING_KEY = 'qxt:ai:processing'

export async function enqueueAIJob(jobData) {
  if (!isRedisAvailable()) {
    console.warn('[AI Queue] Redis不可用，跳过入队')
    return null
  }
  const jobId = 'ai_' + Date.now() + '_' + Math.random().toString(36).slice(2, 8)
  const job = JSON.stringify({ id: jobId, ...jobData, enqueuedAt: Date.now() })
  await redis.lpush(AI_QUEUE_KEY, job)
  console.log('[AI Queue] 入队:', jobId)
  return jobId
}

export async function dequeueAIJob() {
  if (!isRedisAvailable()) return null
  const job = await redis.rpoplpush(AI_QUEUE_KEY, AI_PROCESSING_KEY)
  if (!job) return null
  try { return JSON.parse(job) } catch(e) { return null }
}

export async function completeAIJob(jobId) {
  if (!isRedisAvailable()) return
  await redis.lrem(AI_PROCESSING_KEY, 0, '*"' + jobId + '"*')
}

export async function getAIQueueLength() {
  if (!isRedisAvailable()) return 0
  return await redis.llen(AI_QUEUE_KEY)
}

// ============ 支付分布式锁（防重复扣款） ============
export async function acquirePayLock(userId, planId, ttlSeconds = 120) {
  if (!isRedisAvailable()) {
    // 降级：无Redis时用内存锁（单进程有效）
    if (!globalThis._payLocks) globalThis._payLocks = {}
    const key = userId + ':' + planId
    if (globalThis._payLocks[key]) return false
    globalThis._payLocks[key] = true
    setTimeout(() => { delete globalThis._payLocks[key] }, ttlSeconds * 1000)
    return true
  }
  const key = 'qxt:paylock:' + userId + ':' + planId
  const result = await redis.set(key, '1', 'EX', ttlSeconds, 'NX')
  return result === 'OK'
}

export async function releasePayLock(userId, planId) {
  const key = 'qxt:paylock:' + userId + ':' + planId
  if (isRedisAvailable()) {
    await redis.del(key)
  } else {
    if (globalThis._payLocks) delete globalThis._payLocks[userId + ':' + planId]
  }
}

// ============ 限流（Redis滑动窗口） ============
export async function checkRateLimit(userId, maxRequests = 30, windowSeconds = 60) {
  if (!isRedisAvailable()) return true // 降级：无Redis不限流

  const now = Date.now()
  const key = 'qxt:ratelimit:' + userId
  const windowStart = now - windowSeconds * 1000

  // 移除过期记录
  await redis.zremrangebyscore(key, 0, windowStart)
  // 计当前窗口请求数
  const count = await redis.zcard(key)
  if (count >= maxRequests) return false

  // 记录本次请求
  await redis.zadd(key, now, now + ':' + Math.random().toString(36).slice(2))
  await redis.expire(key, windowSeconds + 10)
  return true
}
