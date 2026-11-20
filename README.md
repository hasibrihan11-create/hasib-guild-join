# Auto Guild Join — Vercel

## Deploy
1. Upload this project to a GitHub repository.
2. Import the repository in Vercel and deploy.
3. In Vercel → Project → Settings → Environment Variables, add:
   - `JOIN_API_URL` = the official account-to-guild join API endpoint
   - `JOIN_API_TOKEN` = optional bearer token, only if the API requires one
4. Redeploy after adding environment variables.

## Account JSON
Top-level array. Each account needs `uid` and `password`. `region` and `clan_id` are optional.
Example:
```json
[
  {"uid":"123456789","password":"example","region":"BD","clan_id":"3106912234"}
]
```

A manual Guild ID entered in the panel overrides `clan_id` for every account. If blank, each account's `clan_id` is used.

## Important API integration note
The supplied guild URL (`/guild?guild_id=...&region=...`) does not specify how UID/password authenticate or how an account joins. This project therefore includes a generic server-side POST adapter, not a verified working integration. Update `api/join.js` to match the API provider's documented method, payload, authentication, and success response before using it. Never put credentials or API secrets in frontend code.
