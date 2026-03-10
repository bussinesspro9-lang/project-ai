import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { PlatformCredential } from './entities/platform-credential.entity';

@Injectable()
export class PlatformIntegrationService {
  constructor(
    @InjectRepository(PlatformCredential)
    private readonly credentialRepo: Repository<PlatformCredential>,
  ) {}

  async findByUser(userId: number): Promise<PlatformCredential[]> {
    return this.credentialRepo.find({ where: { userId } });
  }

  async connect(
    userId: number,
    platform: string,
    data: {
      accessToken: string;
      refreshToken?: string;
      tokenExpiresAt?: Date;
      platformUserId?: string;
      platformPageId?: string;
      scopes?: string[];
      metadata?: Record<string, any>;
    },
  ): Promise<PlatformCredential> {
    let credential = await this.credentialRepo.findOne({
      where: { userId, platform },
    });

    if (credential) {
      Object.assign(credential, data, { isConnected: true, lastSyncedAt: new Date() });
    } else {
      credential = this.credentialRepo.create({
        userId,
        platform,
        ...data,
        isConnected: true,
        lastSyncedAt: new Date(),
      });
    }

    return this.credentialRepo.save(credential);
  }

  async disconnect(userId: number, platform: string): Promise<void> {
    const credential = await this.credentialRepo.findOne({
      where: { userId, platform },
    });
    if (!credential) throw new NotFoundException('Platform not connected');

    credential.isConnected = false;
    credential.accessToken = null;
    credential.refreshToken = null;
    await this.credentialRepo.save(credential);
  }
}
