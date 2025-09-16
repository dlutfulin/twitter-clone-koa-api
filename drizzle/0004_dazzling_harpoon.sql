CREATE TABLE "notifications" (
    "id" integer PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
    "user_id" integer NOT NULL,
    "actor_id" integer NOT NULL,
    "type" varchar(50) NOT NULL,
    "post_id" integer,
    "message" varchar(500) NOT NULL,
    "is_read" boolean DEFAULT false NOT NULL,
    "created_at" timestamp DEFAULT now() NOT NULL
);

ALTER TABLE "notifications" ADD CONSTRAINT "notifications_user_id_users_id_fk"
FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE cascade;

ALTER TABLE "notifications" ADD CONSTRAINT "notifications_actor_id_users_id_fk"
FOREIGN KEY ("actor_id") REFERENCES "public"."users"("id") ON DELETE cascade;

ALTER TABLE "notifications" ADD CONSTRAINT "notifications_post_id_posts_id_fk"
FOREIGN KEY ("post_id") REFERENCES "public"."posts"("id") ON DELETE cascade;
