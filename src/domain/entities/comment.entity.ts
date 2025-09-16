export class Comment {
  constructor(
    public readonly id: number | null,
    public readonly postId: number,
    public readonly userId: number,
    public readonly content: string,
    public readonly createdAt: Date,
    public readonly updatedAt: Date
  ) {}

  static create(userId: number, postId: number, content: string): Comment {
    if (!content || content.trim().length === 0) {
      throw new Error("Comment content cannot be empty");
    }

    if (content.length > 200) {
      throw new Error("Comment content cannot be more than 200");
    }

    const now = new Date();
    return new Comment(null, postId, userId, content.trim(), now, now);
  }

  static fromPersistence(props: {
    id: number;
    postId: number;
    userId: number;
    content: string;
    createdAt: Date;
    updatedAt: Date;
  }): Comment {
    return new Comment(
      props.id,
      props.postId,
      props.userId,
      props.content,
      props.createdAt,
      props.updatedAt
    );
  }
}
