export class Retweet {
  constructor(
    public readonly id: number | null,
    public readonly userId: number,
    public readonly postId: number,
    public readonly createdAt: Date
  ) {}

  static create(userId: number, postId: number): Retweet {
    return new Retweet(null, userId, postId, new Date());
  }

  static fromPersistence(props: {
    id: number;
    userId: number;
    postId: number;
    createdAt: Date;
  }): Retweet {
    return new Retweet(props.id, props.userId, props.postId, props.createdAt);
  }
}
