export class UserEmail {
  private static readonly EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

  static validate(email: string): void {
    if (!email || typeof email !== "string") {
      throw new Error("Email is required");
    }

    if (email.length > 255) {
      throw new Error("Email is too long");
    }

    if (!this.EMAIL_REGEX.test(email)) {
      throw new Error("Invalid email format");
    }
  }
}
