import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { createClient, SupabaseClient } from '@supabase/supabase-js';

@Injectable()
export class StorageService {
  private readonly client: SupabaseClient;

  constructor() {
    this.client = createClient(
      process.env.SUPABASE_URL,
      process.env.SUPABASE_KEY,
    );
  }

  async upload(bucket: string, file: Express.Multer.File, path: string) {
    const { data, error } = await this.client.storage
      .from(bucket)
      .upload(Date.now() + path + file.originalname, file.buffer, {
        contentType: file.mimetype,
        upsert: false,
      });

    if (error) throw new InternalServerErrorException(error.message);
    return data;
  }

  async replace(bucket: string, file: Express.Multer.File, path: string) {
    const { data, error } = await this.client.storage
      .from(bucket)
      .upload(path, file.buffer, {
        contentType: file.mimetype,
        upsert: true,
      });

    if (error) throw new InternalServerErrorException(error.message);
    return data;
  }

  async delete(bucket: string, path: string) {
    const { data, error } = await this.client.storage
      .from(bucket)
      .remove([path]);

    if (error) throw new InternalServerErrorException(error.message);
    return data;
  }

  getPublicUrl(bucket: string, path: string) {
    return this.client.storage.from(bucket).getPublicUrl(path).data.publicUrl;
  }
}
