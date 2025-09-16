CREATE TABLE "refresh_tokens" (
    "id" integer PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
    "user_id" integer NOT NULL,
    "token" varchar(500) NOT NULL,
    "expires_at" timestamp NOT NULL,
    "is_revoked" boolean DEFAULT false NOT NULL,
    "created_at" timestamp DEFAULT now() NOT NULL,
    "updated_at" timestamp DEFAULT now() NOT NULL,
    CONSTRAINT "refresh_tokens_token_unique" UNIQUE("token")
);

ALTER TABLE "posts" ADD CONSTRAINT "posts_user_id_users_id_fk"
FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE cascade;

ALTER TABLE "refresh_tokens" ADD CONSTRAINT "refresh_tokens_user_id_users_id_fk"
FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE cascade;
