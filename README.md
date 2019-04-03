# GraphQL Fullstack Template

## Prerequisites

- Node
- yarn
- Postgres
- gcloud

## Install Deps

```
yarn
```

## Start project in development mode

`yarn start`

> Runs both frontend and server in development mode with live hot reload

## Generating migrations

After adding or modyfing entity files in packages/common, you need to create migration files.

`yarn ENV_NAME:make-migrations NAME_OF_MIGRATION`

> this will auto-generate SQL to create the relations in the DB

#### Example: Create migrations to apply to our local database.

`yarn development:make-migrations add_user_entity`

To apply the migrations, run:

`yarn ENV_NAME:run-migrations`

#### Example: Apply migrations to the local database.

`yarn development:run-migrations`

> this will apply any unapplied migrations

## Deploying Production

> TODO add deploy logic, versioning, and document examples
