import { Injectable, HttpException } from '@nestjs/common';
import fetch from 'node-fetch';

@Injectable()
export class ZApiService {
  private readonly instanceId = process.env.ZAPI_INSTANCE_ID;
  private readonly token = process.env.ZAPI_TOKEN;
  private readonly clientToken = process.env.ZAPI_CLIENT_TOKEN;

  private get baseUrl() {
    return `https://api.z-api.io/instances/${this.instanceId}/token/${this.token}`;
  }

  async sendText(phone: string, message: string) {
    const response = await fetch(`${this.baseUrl}/send-text`, {
      method: 'POST',
      headers: {
        'content-type': 'application/json',
        'client-token': this.clientToken,
      },
      body: JSON.stringify({ phone, message }),
    });

    const data: unknown = await response.json();

    if (!response.ok) {
      throw new HttpException(data, response.status);
    }

    return data;
  }
}
