import { createContext, useContext, useEffect, useState } from 'react'
import { io } from 'socket.io-client'
import PropTypes from 'prop-types'

const SocketIOContext = createContext(null)

export function SocketIOContextProvider({ children }) {
  const [socket, setSocket] = useState(null)

  useEffect(() => {
    const socketInstance = io(
      import.meta.env.VITE_BACKEND_URL.replace(/\/api\/v1\/?$/, ''),
    )

    socketInstance.on('connect', () => {
      console.log('Socket.io connected:', socketInstance.id)
    })

    socketInstance.on('disconnect', () => {
      console.log('Socket.io disconnected')
    })

    setSocket(socketInstance)

    return () => {
      socketInstance.disconnect()
    }
  }, [])

  return (
    <SocketIOContext.Provider value={socket}>
      {children}
    </SocketIOContext.Provider>
  )
}

export function useSocket() {
  return useContext(SocketIOContext)
}

SocketIOContextProvider.propTypes = {
  children: PropTypes.node.isRequired,
}
