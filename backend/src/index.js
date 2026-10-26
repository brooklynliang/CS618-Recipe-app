import dotenv from 'dotenv'
dotenv.config()

import { createServer } from 'node:http'
import { Server } from 'socket.io'
import { initDatabase } from './db/init.js'
import { app, registerRecipeRoutes } from './app.js'

const httpServer = createServer(app)

const io = new Server(httpServer, {
  cors: {
    origin: '*',
  },
})

registerRecipeRoutes(io)

io.on('connection', (socket) => {
  console.info('Socket.io client connected:', socket.id)

  socket.on('disconnect', () => {
    console.info('Socket.io client disconnected:', socket.id)
  })
})

try {
  await initDatabase()
  const PORT = process.env.PORT
  httpServer.listen(PORT)
  console.info(`express server running on http://localhost:${PORT}`)
} catch (err) {
  console.error('error connecting to database:', err)
}

export { io }
