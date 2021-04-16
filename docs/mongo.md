# MongoDB

## Installation

You can download [MongoDB Compass](https://www.mongodb.com/products/compass) to manage your databases and tables with a GUI.

## Troubleshooting MongoDB

Sometimes `localhost` will erroneously claim that MongoDB is running on port 27017 when it is actually not. There are a few commands in `package.json` that you can run to deal with this issue:

```
"kill-ports": "npx kill-port 3000 8802 27017 && killall node"
"restart-mongo": "sudo brew services restart mongodb-community
"list-mongo": "ps aux | grep mongo"
```

Run these commands in order if this issue occurs. For `list-mongo`, you'll need to run `kill -9 pids` for each process ID related to the processes that display when that command is run.

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

### Update _id type and value

```
i = 1
usersTable = db.users.find()
usersTable.forEach(function (doc, index) {
    print(doc.jsonData)
    db.users.remove({ _id : doc._id});
    tempId = new NumberLong(doc._id);
    doc._id = i++
    db.users.save(doc)
});
```

# Sources

https://softwareontheroad.com/database-migration-node-mongo/
