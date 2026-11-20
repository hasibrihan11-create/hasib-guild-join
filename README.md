# Auto Guild Join — Vercel

## Deploy
1. Upload this project to a GitHub repository.
2. Import the repository in Vercel and deploy.
3. Optional: set `JOIN_API_URL` in Vercel Environment Variables if you need to override the default endpoint.
4. Redeploy after changing environment variables.

Default upstream endpoint:
`https://danger-guild-management-web.vercel.app/join?guild_id={guild_id}&uid={guest_uid}&password={guest_pw}`

The server calls this endpoint with GET. No region parameter is sent.

## Account JSON
Top-level array. Each account needs `uid` and `password`. `clan_id` is optional.
Example:
```json
[
  {"uid":"123456789","password":"example","clan_id":"3106912234"}
]
```

A manual Guild ID entered in the panel overrides `clan_id` for every account. If blank, each account's `clan_id` is used. Extra JSON fields, including `region`, are ignored.

Credentials are sent from the Vercel server to the configured join endpoint. Use only accounts you own or are authorized to manage.
