export class Username {
  private static readonly USERNAME_REGEX = /^[a-zA-Z0-9_]+$/;
  private static readonly MIN_LENGTH = 3;
  private static readonly MAX_LENGTH = 50;

  static validate(username: string): void {
    if (!username || typeof username !== "string") {
      throw new Error("Username is required");
    }

    if (username.length < this.MIN_LENGTH) {
      throw new Error(
        `Username must be at least ${this.MIN_LENGTH} characters`
      );
    }

    if (username.length > this.MAX_LENGTH) {
      throw new Error(`Username must not exceed ${this.MAX_LENGTH} characters`);
    }

    if (!this.USERNAME_REGEX.test(username)) {
      throw new Error(
        "Username can only contain letters, numbers and underscores"
      );
    }
  }
}
