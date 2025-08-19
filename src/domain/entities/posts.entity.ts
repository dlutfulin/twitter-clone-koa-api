import { CreatePostProps } from "../types/post.types";

export class Post {
  constructor(
    public readonly id: number | null,
    public readonly userId: number,
    public readonly content: string,
    public readonly mediaUrl: string | null,
    public readonly likesCount: number,
    public readonly retweetsCount: number,
    public readonly commentsCount: number,
    public readonly createdAt: Date,
    public readonly updatedAt: Date
  ) {}

  static create(props: CreatePostProps): Post {
    if (!props.content && props.content.trim().length === 0) {
      throw new Error("Post content cannot be empty");
    }

    if (props.content.length > 200) {
      throw new Error("Post content cannot be more than 200");
    }

    const now = new Date();
    return new Post(
      null,
      props.userId,
      props.content.trim(),
      props.mediaUrl,
      0,
      0,
      0,
      now,
      now
    );
  }

  static fromPersistence(props: {
    id: number;
    userId: number;
    content: string;
    mediaUrl: string | null;
    likesCount: number;
    retweetsCount: number;
    commentsCount: number;
    createdAt: Date;
    updatedAt: Date;
  }): Post {
    return new Post(
      props.id,
      props.userId,
      props.content,
      props.mediaUrl,
      props.likesCount,
      props.retweetsCount,
      props.commentsCount,
      props.createdAt,
      props.updatedAt
    );
  }

  incrementLikes(): Post {
    return new Post(
      this.id,
      this.userId,
      this.content,
      this.mediaUrl,
      this.likesCount + 1,
      this.retweetsCount,
      this.commentsCount,
      this.createdAt,
      new Date()
    );
  }

  decrementLikes(): Post {
    return new Post(
      this.id,
      this.userId,
      this.content,
      this.mediaUrl,
      Math.max(0, this.likesCount - 1),
      this.retweetsCount,
      this.commentsCount,
      this.createdAt,
      new Date()
    );
  }

  incrementRetweets(): Post {
    return new Post(
      this.id,
      this.userId,
      this.content,
      this.mediaUrl,
      this.likesCount,
      this.retweetsCount + 1,
      this.commentsCount,
      this.createdAt,
      new Date()
    );
  }

  incrementComments(): Post {
    return new Post(
      this.id,
      this.userId,
      this.content,
      this.mediaUrl,
      this.likesCount,
      this.retweetsCount,
      this.commentsCount + 1,
      this.createdAt,
      new Date()
    );
  }

  toJSON() {
    return {
      id: this.id,
      userId: this.userId,
      content: this.content,
      mediaUrl: this.mediaUrl,
      likesCount: this.likesCount,
      retweetsCount: this.retweetsCount,
      commentsCount: this.commentsCount,
      createdAt: this.createdAt,
      updatedAt: this.updatedAt,
    };
  }

}
