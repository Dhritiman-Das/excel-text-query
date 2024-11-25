### Perform migration

```bash
npx prisma migrate dev --name name-of-migration
```

### Run the seed script

```bash
npx prisma db seed
```

### Start Prisma Studio

```bash
npx prisma studio
```

### Running scripts

> Using _ts-node_ without `module: CommonJS` throws error

Use this to fix it

```bash
ts-node --compiler-options {\"module\":\"CommonJS\"} scripts/script-name.ts
```

### Easy Postgres setup

```bash
docker run --rm -p 5431:5432 -e POSTGRES_HOST_AUTH_METHOD=trust postgres
```
