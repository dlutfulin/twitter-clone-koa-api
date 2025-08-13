# BUILD AND RUNNING

The basic env variables go in .env, for example:

```
JWT_SECRET=
# DATABASE_URL=
DATABASE_URL=
JWT_ACCESS_SECRET=
JWT_REFRESH_SECRET=
JWT_ACCESS_EXPIRES=
JWT_REFRESH_EXPIRES=
```

**1. Clone Repo**

```bash
git clone https://github.com/dlutfulin/twitter-clone-koa-api.git
```

**2. Install Dependencies**

```bash
npm i
npm run db:push
```

**3. Set Credentials as Env Vars**

See above or the `.env` file for required env vars.

**4. Run App**

```bash
npm run dev
```

