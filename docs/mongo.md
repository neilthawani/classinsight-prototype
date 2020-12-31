# MongoDB

## Installation

You can download [MongoDB Compass](https://www.mongodb.com/products/compass) to manage your databases and tables with a GUI.

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

## Basic Commands

```
mongo # run Mongo from the Terminal
show dbs # show all available databases
use test # use test db
db.users # confirm test has the relevant tables
db.datasets # prints database.tableName (e.g., test.datasets)
db.counters
db.users.find() # list all rows in users table
db.datasets.find().pretty() # pretty print
db.counters.find()
```

## Seeds for Production

```
db.counters.insert({dbName: "users", count: 0})
db.counters.insert({dbName: "datasets", count: 0})
```

### Update attr names from the Terminal

```
db.datasets.updateMany({}, {
    $rename: {
        user_id: "userId",
        created_date: "createdDate",
        last_updated_date: "lastUpdatedDate",
        class_topic: "classTopic",
        class_date: "classDate",
        class_period: "classPeriod"
    }
});
```

# Sources

https://softwareontheroad.com/database-migration-node-mongo/
