import 'reflect-metadata'
import { INestApplication } from '@nestjs/common'
import { NestFactory } from '@nestjs/core'
import { AppModule } from './app.module'
import { ExpressAdapter } from '@nestjs/platform-express'
import cookieParser from 'cookie-parser'
import helmet from 'helmet'
import compression from 'compression'
import { WebsocketAdapter } from './websockets/websocket.adapter'
import express from 'express'
import { Logger } from 'nestjs-pino'
import { ConfigService } from '@nestjs/config'
import bodyParser from 'body-parser'

async function bootstrap(): Promise<void> {
  const server = express()
  server.disable('x-powered-by')
  let app: INestApplication | undefined

  try {
    app = await NestFactory.create(AppModule, new ExpressAdapter(server), {
      bufferLogs: true
    })

    server.use(bodyParser.json({ limit: '10mb' }))
    server.use(bodyParser.urlencoded({ extended: true, limit: '10mb' }))

    const config = app.get(ConfigService)
    const logger = app.get(Logger)
    const host = config.getOrThrow<string>('app.http.host')
    const port = config.getOrThrow<number>('app.http.port')

    app.use(
      helmet({
        crossOriginResourcePolicy: { policy: 'cross-origin' },
        contentSecurityPolicy: {
          directives: {
            defaultSrc: ["'self'"],
            styleSrc: ["'self'", "'unsafe-inline'"],
            scriptSrc: ["'self'"],
            imgSrc: ["'self'", 'data:', 'https:']
          }
        },
        noSniff: true,
        xssFilter: true,
        frameguard: { action: 'deny' }
      })
    )

    app.use(
      compression({
        threshold: 1024,
        level: 6,
        filter: (req, res) => {
          if (req.headers['x-no-compression']) {
            return false
          }

          return compression.filter(req, res)
        }
      })
    )

    app.useLogger(logger)
    app.enableCors(config.get('app.cors'))
    app.use(cookieParser())
    server.set('trust proxy', 'loopback')
    app.enableShutdownHooks()

    
    const websocketAdapter = new WebsocketAdapter(app)
    await websocketAdapter.connectToRedis()
    app.useWebSocketAdapter(websocketAdapter)

    
    
    
    
    
    
    
    

    
    
    
    

    

    
    const gracefulShutdown = async (signal: string): Promise<void> => {
      logger.log(`Received ${signal}, shutting down gracefully...`)

      try {
        await websocketAdapter.close()
        await app?.close()

        logger.log('Application closed cleanly. Bye!')
        process.exit(0)
      } catch (error) {
        logger.error('Error during shutdown:', error)
        process.exit(1)
      }
    }

    process.on('SIGTERM', () => {
      void gracefulShutdown('SIGTERM')
    })
    process.on('SIGINT', () => {
      void gracefulShutdown('SIGINT')
    })

    
    await app.listen(port, host)
  } catch (error) {
    console.error('Application failed to start:', error)
    process.exit(1)
  }
}

void bootstrap()
