# MongoDB

## Migrations

To create a new migration, run:

```
migrate-mongo create name-of-my-script
```

Migrations are stored in the `migrations` folder.

There are aliases for migrating Mongo in `package.json`:

```
"migrate:up": "migrate-mongo up",
"migrate:down": "migrate-mongo down"
```

### The up function

The script file expects us to export an object with a UP function and a DOWN function.

When the scripts are applied, the up function is responsible for changing the database schema.

### The down function

This is how you go back to the previous database state.

It is not always possible to go back to the previous state

# Sources

https://softwareontheroad.com/database-migration-node-mongo/
