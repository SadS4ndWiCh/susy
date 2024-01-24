# 🍪 SUSY

Already have many URL shortener boring solutions, so aiming for a more funny one, now you can create a suspicious link to share.

> [!IMPORTANT]
> SUSY does not intend to provide malicious links, but only with a suspicious appearance.

## 🥁 Running Locally

Clone the repository:

```bash
git clone https://github.com/SadS4ndWiCh/susy
cd susy
```

Setup enviroment variables:

```bash
BASE_URL="your base url"
NEXT_PUBLIC_API_BASE_URL="your base url"

# This project is currently using Turso.
DATABASE_URL="libsql://<database-name>-<user>.turso.io"
DATABASE_AUTH_TOKEN="auth-token"

JWT_SECRET="jwt-secret"
JWT_ALGORITHM="jwt-algorithm"
```

Create a file called `.env.local` and insert these variables into it.

Install dependencies:

```bash
pnpm install
```

Start server:

```bash
pnpm dev
```

