import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, FindOptionsWhere } from 'typeorm';
import { EngagementInteraction } from './entities/engagement-interaction.entity';
import {
  InteractionType,
  InteractionDirection,
  ResponseStatus,
} from '../common/enums';
import { RealtimeService } from '../realtime/realtime.service';
import { PaginationDto, paginate } from '../common/dto/pagination.dto';

@Injectable()
export class EngagementService {
  constructor(
    @InjectRepository(EngagementInteraction)
    private readonly interactionRepo: Repository<EngagementInteraction>,
    private readonly realtimeService: RealtimeService,
  ) {}

  async createIncoming(
    userId: number,
    data: {
      platform: string;
      interactionType: InteractionType;
      externalId?: string;
      authorName?: string;
      authorProfileUrl?: string;
      originalContent: string;
      sentiment?: string;
      aiResponse?: string;
      relatedContentId?: number;
      metadata?: Record<string, any>;
    },
  ): Promise<EngagementInteraction> {
    const interaction = this.interactionRepo.create({
      userId,
      platform: data.platform,
      interactionType: data.interactionType,
      direction: InteractionDirection.INBOUND,
      externalId: data.externalId,
      authorName: data.authorName,
      authorProfileUrl: data.authorProfileUrl,
      originalContent: data.originalContent,
      sentiment: data.sentiment,
      aiResponse: data.aiResponse,
      relatedContentId: data.relatedContentId,
      metadata: data.metadata,
      responseStatus: ResponseStatus.PENDING,
    });

    const saved = await this.interactionRepo.save(interaction);

    this.realtimeService.engagementNew(userId, saved.id, data.interactionType);

    return saved;
  }

  async findAll(
    userId: number,
    query: PaginationDto & {
      platform?: string;
      interactionType?: InteractionType;
      sentiment?: string;
      responseStatus?: ResponseStatus;
    },
  ) {
    const where: FindOptionsWhere<EngagementInteraction> = { userId };

    if (query.platform) where.platform = query.platform;
    if (query.interactionType) where.interactionType = query.interactionType;
    if (query.sentiment) where.sentiment = query.sentiment;
    if (query.responseStatus) where.responseStatus = query.responseStatus;

    return paginate(this.interactionRepo, query, {
      where,
      order: { createdAt: 'DESC' },
    });
  }

  async respond(
    userId: number,
    id: number,
    finalResponse: string,
  ): Promise<EngagementInteraction> {
    const interaction = await this.interactionRepo.findOne({
      where: { id, userId },
    });
    if (!interaction) throw new NotFoundException('Interaction not found');

    interaction.finalResponse = finalResponse;
    interaction.responseStatus = ResponseStatus.MANUALLY_RESPONDED;
    interaction.respondedAt = new Date();

    const saved = await this.interactionRepo.save(interaction);
    this.realtimeService.engagementResponded(userId, saved.id);
    return saved;
  }

  async skip(userId: number, id: number): Promise<void> {
    const interaction = await this.interactionRepo.findOne({
      where: { id, userId },
    });
    if (!interaction) throw new NotFoundException('Interaction not found');

    interaction.responseStatus = ResponseStatus.SKIPPED;
    await this.interactionRepo.save(interaction);
  }

  /**
   * Create a suggested outbound comment (auto-commenting feature).
   * This only creates a SUGGESTED entry; the user must approve before posting.
   */
  async createSuggestedComment(
    userId: number,
    data: {
      platform: string;
      targetPostUrl: string;
      suggestedComment: string;
      targetAccountName?: string;
      relatedContentId?: number;
      metadata?: Record<string, any>;
    },
  ): Promise<EngagementInteraction> {
    const interaction = this.interactionRepo.create({
      userId,
      platform: data.platform,
      interactionType: InteractionType.SUGGESTED_COMMENT,
      direction: InteractionDirection.OUTBOUND,
      originalContent: data.targetPostUrl,
      aiResponse: data.suggestedComment,
      authorName: data.targetAccountName,
      relatedContentId: data.relatedContentId,
      metadata: {
        ...data.metadata,
        targetPostUrl: data.targetPostUrl,
        requiresApproval: true,
      },
      responseStatus: ResponseStatus.SUGGESTED,
    });

    const saved = await this.interactionRepo.save(interaction);
    this.realtimeService.engagementNew(userId, saved.id, InteractionType.SUGGESTED_COMMENT);
    return saved;
  }

  /**
   * Approve a suggested comment for posting
   */
  async approveSuggested(
    userId: number,
    id: number,
    editedComment?: string,
  ): Promise<EngagementInteraction> {
    const interaction = await this.interactionRepo.findOne({
      where: { id, userId, interactionType: InteractionType.SUGGESTED_COMMENT },
    });
    if (!interaction) throw new NotFoundException('Suggested comment not found');

    interaction.finalResponse = editedComment || interaction.aiResponse;
    interaction.responseStatus = ResponseStatus.POSTED;
    interaction.respondedAt = new Date();

    return this.interactionRepo.save(interaction);
  }

  async getStats(userId: number) {
    const total = await this.interactionRepo.count({ where: { userId } });
    const pending = await this.interactionRepo.count({
      where: { userId, responseStatus: ResponseStatus.PENDING },
    });
    const responded = await this.interactionRepo.count({
      where: [
        { userId, responseStatus: ResponseStatus.MANUALLY_RESPONDED },
        { userId, responseStatus: ResponseStatus.AUTO_RESPONDED },
      ],
    });
    const suggested = await this.interactionRepo.count({
      where: { userId, responseStatus: ResponseStatus.SUGGESTED },
    });

    return { total, pending, responded, suggested };
  }
}
