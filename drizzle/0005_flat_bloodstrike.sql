CREATE TABLE "comments" (
    "id" integer PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
    "user_id" integer NOT NULL,
    "post_id" integer NOT NULL,
    "content" varchar(500) NOT NULL,
    "created_at" timestamp DEFAULT now() NOT NULL,
    "updated_at" timestamp DEFAULT now() NOT NULL
);

CREATE TABLE "retweets" (
    "id" integer PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
    "user_id" integer NOT NULL,
    "post_id" integer NOT NULL,
    "created_at" timestamp DEFAULT now() NOT NULL
);

ALTER TABLE "comments" ADD CONSTRAINT "comments_user_id_users_id_fk"
FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE cascade;

ALTER TABLE "comments" ADD CONSTRAINT "comments_post_id_posts_id_fk"
FOREIGN KEY ("post_id") REFERENCES "public"."posts"("id") ON DELETE cascade;

ALTER TABLE "retweets" ADD CONSTRAINT "retweets_user_id_users_id_fk"
FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE cascade;

ALTER TABLE "retweets" ADD CONSTRAINT "retweets_post_id_posts_id_fk"
FOREIGN KEY ("post_id") REFERENCES "public"."posts"("id") ON DELETE cascade;
