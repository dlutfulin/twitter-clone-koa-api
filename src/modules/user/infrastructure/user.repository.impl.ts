import { getDb } from "../../../shared/infrastructure/drizzle-orm";
import { users } from "../../../shared/infrastructure/schema";
import { IUserRepository } from "../domain/user.repository";
import { User } from "../domain/user.entity";
import { eq } from "drizzle-orm";

export class UserRepositoryImpl implements IUserRepository {
  async findByEmail(email: string): Promise<User | null> {
    const db = await getDb();
    const record = await db
      .select()
      .from(users)
      .where(eq(users.email, email))
      .limit(1);
    if (!record.length) return null;
    const row = record[0];
    return new User(
      row.id,
      row.email,
      row.username,
      row.password,
      row.is_active,
      row.created_at,
      row.updated_at
    );
  }

  async findByUsername(username: string): Promise<User | null> {
    const db = await getDb();
    const record = await db
      .select()
      .from(users)
      .where(eq(users.username, username))
      .limit(1);
    if (!record.length) return null;
    const row = record[0];
    return new User(
      row.id,
      row.email,
      row.username,
      row.password,
      row.is_active,
      row.created_at,
      row.updated_at
    );
  }

  async save(user: User): Promise<User> {
    const db = await getDb();
    const [row] = await db
      .insert(users)
      .values({
        email: user.email,
        username: user.username,
        password: user.passwordHash,
      })
      .returning();
    return new User(
      row.id,
      row.email,
      row.username,
      row.password,
      row.is_active,
      row.created_at,
      row.updated_at
    );
  }

  async update(user: User): Promise<User> {
    if (user.id == null) {
      throw new Error("Cannot update user without id");
    }
    const db = await getDb();
    const [row] = await db
      .update(users)
      .set({
        email: user.email,
        username: user.username,
        password: user.passwordHash,
      })
      .where(eq(users.id, user.id))
      .returning();

    return new User(
      row.id,
      row.email,
      row.username,
      row.password,
      row.is_active,
      row.created_at,
      row.updated_at
    );
  }

  async delete(user: User): Promise<User> {
    if (user.id == null) {
      throw new Error("User id is required");
    }

    const db = await getDb();

    const existing = await this.findByEmail(user.email);
    if (!existing) {
      throw new Error("User not found");
    }

    await db.delete(users).where(eq(users.id, user.id));

    return existing;
  }

  async findAll(): Promise<User[]> {
    const db = await getDb();

    const records = await db.select().from(users);

    return records.map(
      (row) =>
        new User(
          row.id,
          row.email,
          row.username,
          row.password,
          row.is_active,
          row.created_at,
          row.updated_at
        )
    );
  }

  async findById(id: string): Promise<User> {
    const db = await getDb();

    const record = await db
      .select()
      .from(users)
      .where(eq(users.id, Number(id)))
      .limit(1);

    if (!record.length) throw new Error("User does not exist");

    const row = record[0];
    return new User(
      row.id,
      row.email,
      row.username,
      row.password,
      row.is_active,
      row.created_at,
      row.updated_at
    );
  }
}
