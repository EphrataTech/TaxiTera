import { useEffect, useRef } from 'react';
import { io, Socket } from 'socket.io-client';
import { useAuth } from '@/context/AuthContext';

export function useWebSocket() {
  const socketRef = useRef<Socket | null>(null);
  const { user } = useAuth();

  useEffect(() => {
    if (user) {
      socketRef.current = io(process.env.NEXT_PUBLIC_WS_URL || 'http://localhost:3001');
      
      socketRef.current.emit('join-user', user.userId);

      socketRef.current.on('booking-update', (booking) => {
        console.log('Booking updated:', booking);
        // Trigger UI update
        window.dispatchEvent(new CustomEvent('booking-update', { detail: booking }));
      });

      socketRef.current.on('payment-status', (status) => {
        console.log('Payment status:', status);
        window.dispatchEvent(new CustomEvent('payment-status', { detail: status }));
      });

      return () => {
        socketRef.current?.disconnect();
      };
    }
  }, [user]);

  return socketRef.current;
}