import {
  WebSocketGateway,
  WebSocketServer,
  OnGatewayConnection,
  OnGatewayDisconnect,
  OnGatewayInit,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { Injectable, Logger } from '@nestjs/common';
import { SocketService } from 'src/common/socket/socket.service';

@WebSocketGateway({
  cors: {
    origin: 'http://localhost:5173',
    credentials: true,
  },
})
@Injectable()
export class ConnectionGateway
  implements OnGatewayInit, OnGatewayConnection, OnGatewayDisconnect
{
  @WebSocketServer()
  server: Server;

  private readonly logger = new Logger('ConnectionGateway');

  constructor(private readonly socketService: SocketService) {}

  afterInit(server: Server) {
    this.socketService.setServer(server);
    this.logger.log('WebSocket server initialized');
  }

  handleConnection(client: Socket) {
    this.logger.log(`Cliente conectado: ${client.id}`);

    client.on('join-company', (companyId: number) => {
      this.socketService.joinCompany(client, companyId);
      this.logger.log(
        `Cliente ${client.id} entrou na room company-${companyId}`,
      );
    });

    client.on('join-client', (clientId: number) => {
      this.socketService.joinClient(client, clientId);
      this.logger.log(`Cliente ${client.id} entrou na room client-${clientId}`);
    });
  }

  handleDisconnect(client: Socket) {
    this.logger.log(`Cliente desconectado: ${client.id}`);
  }
}
