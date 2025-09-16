ALTER TABLE "posts" ADD COLUMN "media_s3_key" varchar(500);
ALTER TABLE "users" ADD COLUMN "avatar_url" varchar(500);
ALTER TABLE "users" ADD COLUMN "avatar_s3_key" varchar(500);
