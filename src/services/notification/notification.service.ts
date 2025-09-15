import { inject, injectable } from "tsyringe";
import { Notification } from "../../domain/entities/notification.entity";
import { INotificationRepository } from "./notification.repository";
import { SNSService } from "../aws/sns.service";

@injectable()
export class NotificationService {
  constructor(
    @inject("INotificationRepository") private notificationRepository: INotificationRepository,
    @inject(SNSService) private snsService: SNSService
  ) {}

  async sendLikeNotification(
    postOwnerId: number,
    likerId: number,
    postId: number,
    likerUsername: string
  ): Promise<void> {
    // Не отправляем уведомление самому себе
    if (postOwnerId === likerId) return;

    // Создаем уведомление в базе
    const notification = Notification.createLikeNotification(
      postOwnerId,
      likerId,
      postId,
      likerUsername
    );

    await this.notificationRepository.save(notification);

    // Отправляем через SNS (асинхронно, не блокируем основной поток)
    this.snsService.sendLikeNotification(likerId, postOwnerId, postId, likerUsername)
      .catch(error => console.error("Failed to send SNS notification:", error));
  }

  async sendFollowNotification(
    followeeId: number,
    followerId: number,
    followerUsername: string
  ): Promise<void> {
    const notification = Notification.createFollowNotification(
      followeeId,
      followerId,
      followerUsername
    );

    await this.notificationRepository.save(notification);

    this.snsService.sendFollowNotification(followerId, followeeId, followerUsername)
      .catch(error => console.error("Failed to send SNS notification:", error));
  }

  async getUserNotifications(
    userId: number,
    limit = 20,
    offset = 0
  ): Promise<Notification[]> {
    return await this.notificationRepository.findByUserId(userId, limit, offset);
  }

  async markAsRead(notificationId: number, userId: number): Promise<void> {
    const notification = await this.notificationRepository.findById(notificationId);
    if (!notification || notification.userId !== userId) {
      throw new Error("Notification not found");
    }

    const readNotification = notification.markAsRead();
    await this.notificationRepository.update(readNotification);
  }

  async getUnreadCount(userId: number): Promise<number> {
    return await this.notificationRepository.countUnreadByUserId(userId);
  }
}