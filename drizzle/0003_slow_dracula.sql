CREATE TABLE "likes" (
    "id" integer PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
    "user_id" integer NOT NULL,
    "post_id" integer NOT NULL,
    "created_at" timestamp DEFAULT now() NOT NULL
);

ALTER TABLE "likes" ADD CONSTRAINT "likes_user_id_users_id_fk"
FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE cascade;

ALTER TABLE "likes" ADD CONSTRAINT "likes_post_id_posts_id_fk"
FOREIGN KEY ("post_id") REFERENCES "public"."posts"("id") ON DELETE cascade;
