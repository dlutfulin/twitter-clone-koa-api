export interface CreatePostProps {
  userId: number;
  content: string;
  mediaUrl: string | null;
}

export interface CreatePostDTO {
    content: string;
    mediaUrl: string | null;
  }

  export interface PostResponse {
    id: number;
    userId: number;
    content: string;
    mediaUrl: string | null;
    likesCount: number;
    retweetsCount: number;
    commentsCount: number;
    isLikedByCurrentUser: boolean;
    isRetweetedByCurrentUser: boolean;
    user: {
      id: number;
      username: string;
      email: string;
    };
    createdAt: Date;
    updatedAt: Date;
  }