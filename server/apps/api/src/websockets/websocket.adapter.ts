import { INestApplicationContext } from '@nestjs/common'
import { IoAdapter } from '@nestjs/platform-socket.io'
import { createAdapter } from '@socket.io/redis-adapter'
import { parse } from 'cookie'
import Redis from 'ioredis'
import { ServerOptions, Server, Socket } from 'socket.io'
import { generateRoomPaymentId, generateRoomUserDevice, generateRoomUserId } from '@shared/helpers'
import { RedisService } from '@shared/services/redis.service'
import { TokenService } from '@shared/services/token.service'

const namespaces = ['/', 'payment', 'chat']

export class WebsocketAdapter extends IoAdapter {
  private readonly tokenService: TokenService
  private readonly redisService: RedisService
  private adapterConstructor?: ReturnType<typeof createAdapter>
  private pubClient?: Redis
  private subClient?: Redis

  constructor(app: INestApplicationContext) {
    super(app)
    this.tokenService = app.get(TokenService)
    this.redisService = app.get(RedisService)
  }

  async connectToRedis(): Promise<void> {
    try {
      const redisClient = this.redisService.getClient()

      this.pubClient = redisClient
      this.subClient = redisClient.duplicate()
      this.adapterConstructor = createAdapter(this.pubClient, this.subClient)

      console.log('Redis adapter connected successfully using RedisService')
    } catch (error) {
      console.error('Failed to connect Redis adapter:', error)
      console.log('Continuing without Redis adapter for WebSocket')
    }
  }

  async close(): Promise<void> {
    try {
      await this.subClient?.quit()
      console.log('Redis adapter disconnected successfully')
    } catch (error) {
      console.error('Failed to disconnect Redis adapter:', error)
    }
  }

  createIOServer(port: number, options?: ServerOptions): Server {
    const server: Server = super.createIOServer(port, {
      ...options,
      cors: {
        origin: '*',
        credentials: true
      }
    })

    if (this.adapterConstructor) {
      server.adapter(this.adapterConstructor)
      console.log('Redis adapter applied to WebSocket server')
    } else {
      console.log('WebSocket server running without Redis adapter')
    }

    server.use((socket, next) => {
      void this.authMiddleware(socket, next)
    })

    server.of(/.*/).use((socket, next) => {
      void this.authMiddleware(socket, next)
    })

    namespaces.forEach((namespace) => {
      server.of(namespace).use((socket, next) => {
        void this.authMiddleware(socket, next)
      })
    })

    server.on('connection', (socket) => {
      console.log(`WebSocket client connected: ${socket.id}`)

      socket.on('disconnect', (reason) => {
        console.log(`WebSocket client disconnected: ${socket.id}, reason: ${reason}`)
      })
    })

    namespaces.forEach((namespace) => {
      server.of(namespace).on('connection', (socket) => {
        console.log(`WebSocket client connected to namespace ${namespace}: ${socket.id}`)

        socket.on('disconnect', (reason) => {
          console.log(`WebSocket client disconnected from namespace ${namespace}: ${socket.id}, reason: ${reason}`)
        })

        socket.on('error', (error) => {
          console.error(`WebSocket error in namespace ${namespace}:`, error)
        })
      })
    })

    server.on('error', (error) => {
      console.error('WebSocket server error:', error)
    })

    return server
  }

  async authMiddleware(socket: Socket, next: (err?: Error) => void): Promise<void> {
    try {
      const { authorization, cookie } = socket.handshake.headers
      let accessToken: string | undefined

      if (authorization) {
        accessToken = authorization.split(' ')[1]
      }

      if (!accessToken && cookie) {
        const cookies = parse(cookie)
        accessToken = cookies.access_token
      }

      if (!accessToken) {
        next(new Error('Access token is required for WebSocket connection.'))
        return
      }

      const { userId, deviceId } = await this.tokenService.verifyAccessToken(accessToken)

      await socket.join(generateRoomUserDevice(userId, deviceId))
      await socket.join(generateRoomUserId(userId))

      const { paymentId } = socket.handshake.query
      if (paymentId && typeof paymentId === 'string') {
        const roomName = generateRoomPaymentId(parseInt(paymentId, 10))
        await socket.join(roomName)
        console.log(`User ${userId} (Device: ${deviceId}) joined payment room: ${roomName}`)
      }

      console.log(`User ${userId} (Device: ${deviceId}) authenticated for WebSocket connection`)
      next()
    } catch (error) {
      console.error('WebSocket authentication failed:', error)
      next(error instanceof Error ? error : new Error('WebSocket authentication failed.'))
    }
  }
}
