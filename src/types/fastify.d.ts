import 'fastify'
import 'fastify/jwt'

declare module 'fastify' {
  interface FastifyInstance {
    authenticate: (request: any, reply: any) => Promise<void>
  }
  interface FastifyRequest {
    user: {
      id: string
      phone: string
      memberLevel: number
    }
  }
}

declare module 'fastify/jwt' {
  interface FastifyJWT {
    payload: {
      id: string
      phone: string
      memberLevel: number
    }
    user: {
      id: string
      phone: string
      memberLevel: number
    }
  }
}
