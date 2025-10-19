import {
  WebSocketGateway,
  WebSocketServer,
  SubscribeMessage,
  OnGatewayConnection,
  OnGatewayDisconnect,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';

@WebSocketGateway({
  cors: {
    origin: process.env.CLIENT_URL || 'http://localhost:3000',
    credentials: true,
  },
})
export class BookingGateway implements OnGatewayConnection, OnGatewayDisconnect {
  @WebSocketServer()
  server: Server;

  private connectedUsers = new Map<string, string>();

  handleConnection(client: Socket) {
    console.log(`Client connected: ${client.id}`);
  }

  handleDisconnect(client: Socket) {
    console.log(`Client disconnected: ${client.id}`);
    this.connectedUsers.delete(client.id);
  }

  @SubscribeMessage('join-user')
  handleJoinUser(client: Socket, userId: string) {
    this.connectedUsers.set(client.id, userId);
    client.join(`user-${userId}`);
  }

  notifyBookingUpdate(userId: string, booking: any) {
    this.server.to(`user-${userId}`).emit('booking-update', booking);
  }

  notifyPaymentStatus(userId: string, status: any) {
    this.server.to(`user-${userId}`).emit('payment-status', status);
  }
}