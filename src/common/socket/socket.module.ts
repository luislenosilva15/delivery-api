import { Global, Module } from '@nestjs/common';
import { SocketService } from './socket.service';
import { ConnectionGateway } from 'src/gateway/connection.gateway';

@Global()
@Module({
  providers: [SocketService, ConnectionGateway],
  exports: [SocketService],
})
export class SocketModule {}
