import { Injectable, Logger } from '@nestjs/common';
import { Server, Socket } from 'socket.io';

@Injectable()
export class SocketService {
  private server: Server | null = null;
  private readonly logger = new Logger('SocketService');

  setServer(server: Server) {
    this.server = server;
    this.logger.log('Socket server set in SocketService');
  }

  emitToCompany(companyId: number, event: string, payload: unknown) {
    if (!this.server) {
      this.logger.warn('Attempt to emit but socket server is not set');
      return;
    }

    // Clone payload to avoid accidental mutation / shared references that may
    // cause observed "payloads shifting" when multiple requests are processed.
    // Using JSON stringify/parse is simple and effective for POJOs.
    let payloadCopy: unknown;
    try {
      payloadCopy = JSON.parse(JSON.stringify(payload));
    } catch {
      // If payload isn't serializable, fall back to sending original but log warning
      this.logger.warn(
        'Failed to deep-clone payload for emit; sending original',
      );
      payloadCopy = payload;
    }

    const ts = new Date().toISOString();
    this.logger.log(`emit '${event}' -> company-${companyId} @ ${ts}`);
    this.server.to(`company-${companyId}`).emit(event, payloadCopy);
  }

  joinCompany(client: Socket, companyId: number) {
    // socket.io may return a Promise for join in some versions; use void to silence
    // promise-unhandled lint rule and intentionally ignore the return value.
    void client.join(`company-${companyId}`);
    this.logger.log(`Client ${client.id} joined company-${companyId}`);
  }

  // Expose the raw server if needed (read-only)
  getServer(): Server | null {
    return this.server;
  }
}
