# thechat

## getting started

Setup env (deno):

- https://docs.deno.com/runtime/getting_started/setup_your_environment/

Start supabase:

```shell
npx supabase start
```

Serve functions:

```shell
npx supabase functions serve --no-verify-jwt --env-file .env
```

## deploy

Deploy function:

```shell
npx supabase functions deploy --no-verify-jwt chat
```

```shell
npx supabase secrets set --env-file .env
```

## docs

- https://platform.publicai.co/docs
