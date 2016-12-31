The Moviegoer Web App
---------------------

### Development

1. In MySQL, create a database called `MOVIEGOER`, and create a user `moviegoeradmin`. Give the user all permissions on the database. Put the database config settings in a `.json` file in directory called `json`.
2. Run the following commands:
```
$ npm install
$ npm run db-sync
$ npm run client (in one terminal)
$ npm run server (in another terminal)
```

Be sure to use `nvm install node` to install the latest version of node.

### Production

```
$ npm run production
```