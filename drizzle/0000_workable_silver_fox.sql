CREATE TABLE "users" (
    "id" integer PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
    "email" varchar(255) NOT NULL,
    "username" varchar(255) NOT NULL,
    "password" varchar(255) NOT NULL,
    "is_active" boolean DEFAULT true,
    "updated_at" timestamp DEFAULT now() NOT NULL,
    "created_at" timestamp DEFAULT now() NOT NULL,
    CONSTRAINT "users_email_unique" UNIQUE("email"),
    CONSTRAINT "users_username_unique" UNIQUE("username")
);

CREATE TABLE "posts" (
    id SERIAL PRIMARY KEY,
    user_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    content VARCHAR(280) NOT NULL,
    media_url VARCHAR(500),
    likes_count INTEGER DEFAULT 0 NOT NULL,
    retweets_count INTEGER DEFAULT 0 NOT NULL,
    comments_count INTEGER DEFAULT 0 NOT NULL,
    created_at TIMESTAMP DEFAULT NOW() NOT NULL,
    updated_at TIMESTAMP DEFAULT NOW() NOT NULL
);
