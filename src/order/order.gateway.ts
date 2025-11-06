import {
  WebSocketGateway,
  WebSocketServer,
  OnGatewayConnection,
  OnGatewayDisconnect,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { Injectable, Logger } from '@nestjs/common';
import { Order } from '@prisma/client';

@WebSocketGateway({
  cors: {
    origin: 'http://localhost:5173', // front
    credentials: true,
  },
})
@Injectable()
export class OrderGateway implements OnGatewayConnection, OnGatewayDisconnect {
  @WebSocketServer()
  server: Server;

  private logger = new Logger('OrderGateway');

  handleConnection(client: Socket) {
    this.logger.log(`Cliente conectado: ${client.id}`);
    client.on('join-company', (companyId: number) => {
      client.join(`company-${companyId}`);
      this.logger.log(
        `Cliente ${client.id} entrou na room company-${companyId}`,
      );
    });
  }

  handleDisconnect(client: Socket) {
    this.logger.log(`Cliente desconectado: ${client.id}`);
  }

  sendNewOrder(order: Order) {
    this.server.to(`company-${order.companyId}`).emit('new-order', order);
    this.logger.log(`Pedido enviado para company-${order.companyId}`);
  }
}
