export class Like {
  constructor(
    public readonly id: number | null,
    public readonly userId: number,
    public readonly postId: number,
    public readonly createdAt: Date
  ) {}

  static create(userId: number, postId: number): Like {
    return new Like(null, userId, postId, new Date());
  }

  static fromPersistence(props: {
    id: number;
    userId: number;
    postId: number;
    createdAt: Date;
  }): Like {
    return new Like(props.id, props.userId, props.postId, props.createdAt);
  }
}
