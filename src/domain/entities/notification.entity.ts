export type NotificationType = "like" | "comment" | "follow" | "retweet";

export class Notification {
  constructor(
    public readonly id: number | null,
    public readonly type: NotificationType,
    public readonly userId: number,
    public readonly actorId: number,
    public readonly postId: number | null,
    public readonly message: string,
    public readonly isRead: boolean,
    public readonly createdAt: Date
  ) {}

  static createLikeNotification(
    userId: number,
    actorId: number,
    postId: number,
    actorUsername: string
  ): Notification {
    return new Notification(
      null,
      "like",
      userId,
      actorId,
      postId,
      `${actorUsername} liked your post`,
      false,
      new Date()
    );
  }

  static createFollowNotification(
    userId: number,
    actorId: number,
    actorUsername: string
  ): Notification {
    return new Notification(
      null,
      "follow",
      userId,
      actorId,
      null,
      `${actorUsername} started following you`,
      false,
      new Date()
    );
  }

  markAsRead(): Notification {
    return new Notification(
      this.id,
      this.type,
      this.userId,
      this.actorId,
      this.postId,
      this.message,
      true,
      this.createdAt
    );
  }

  static fromPersistence(props: {
    id: number;
    type: NotificationType;
    userId: number;
    actorId: number;
    postId: number;
    message: string;
    isRead: boolean;
    createdAt: Date;
  }): Notification {
    return new Notification(
      props.id,
      props.type,
      props.userId,
      props.actorId,
      props.postId,
      props.message,
      props.isRead,
      props.createdAt
    );
  }
}
