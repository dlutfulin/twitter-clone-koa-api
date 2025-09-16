import { Notification } from "../../domain/entities/notification.entity";

export interface INotificationRepository {
  sendLikeNotification(
    likerId: number,
    postOwnerId: number,
    postId: number,
    likerUsername: string
  ): Promise<void>;
  sendFollowNotification(
    followerId: number,
    followeeId: number,
    followerUsername: string
  ): Promise<void>;
  save(notification: Notification): Promise<Notification>;
  findByUserId(
    userId: number,
    limit?: number,
    offset?: number
  ): Promise<Notification[]>;
  findById(notificationId: number): Promise<Notification | null>;
  update(notification: Notification): Promise<Notification>;
  countUnreadByUserId(userId: number): Promise<number>;
}
