import { PublishCommand } from "@aws-sdk/client-sns";
import { snsClient, AWS_CONFIG } from "../../shared/aws/aws.config";
import { injectable } from "tsyringe";

export interface NotificationPayload {
  type: "like" | "comment" | "follow" | "retweet";
  userId: number;
  targetUserId: number;
  postId?: number;
  message: string;
  metadata?: Record<string, any>;
}

@injectable()
export class SNSService {
  async publishNotification(payload: NotificationPayload): Promise<void> {
    try {
      const message = JSON.stringify({
        default: payload.message,
        notification: {
          title: this.getNotificationTitle(payload.type),
          body: payload.message,
          data: {
            type: payload.type,
            userId: payload.userId,
            targetUserId: payload.targetUserId,
            postId: payload.postId,
            ...payload.metadata,
          },
        },
      });

      const command = new PublishCommand({
        TopicArn: AWS_CONFIG.SNS_TOPIC_ARN,
        Message: message,
        MessageStructure: "json",
        MessageAttributes: {
          type: {
            DataType: "String",
            StringValue: payload.type,
          },
          targetUserId: {
            DataType: "Number",
            StringValue: payload.targetUserId.toString(),
          },
        },
      });

      await snsClient.send(command);
    } catch (error) {
      console.error("Failed to publish notification:", error);
      throw new Error(`Failed to send notification: ${error}`);
    }
  }

  async sendLikeNotification(
    likerId: number, 
    postOwnerId: number, 
    postId: number,
    likerUsername: string
  ): Promise<void> {
    if (likerId === postOwnerId) return;

    await this.publishNotification({
      type: "like",
      userId: likerId,
      targetUserId: postOwnerId,
      postId,
      message: `${likerUsername} liked your post`,
      metadata: {
        likerUsername,
      },
    });
  }

  async sendCommentNotification(
    commenterId: number,
    postOwnerId: number,
    postId: number,
    commenterUsername: string
  ): Promise<void> {
    if (commenterId === postOwnerId) return;

    await this.publishNotification({
      type: "comment",
      userId: commenterId,
      targetUserId: postOwnerId,
      postId,
      message: `${commenterUsername} commented on your post`,
      metadata: {
        commenterUsername,
      },
    });
  }

  async sendFollowNotification(
    followerId: number,
    followeeId: number,
    followerUsername: string
  ): Promise<void> {
    await this.publishNotification({
      type: "follow",
      userId: followerId,
      targetUserId: followeeId,
      message: `${followerUsername} started following you`,
      metadata: {
        followerUsername,
      },
    });
  }

  async sendRetweetNotification(
    retweeterId: number,
    postOwnerId: number,
    postId: number,
    retweeterUsername: string
  ): Promise<void> {
    if (retweeterId === postOwnerId) return;

    await this.publishNotification({
      type: "retweet",
      userId: retweeterId,
      targetUserId: postOwnerId,
      postId,
      message: `${retweeterUsername} retweeted your post`,
      metadata: {
        retweeterUsername,
      },
    });
  }

  private getNotificationTitle(type: string): string {
    switch (type) {
      case "like":
        return "New Like";
      case "comment":
        return "New Comment";
      case "follow":
        return "New Follower";
      case "retweet":
        return "New Retweet";
      default:
        return "Notification";
    }
  }
}