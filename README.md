# Stupid database
This is a lightweight, zero dependency database that uses JSON to store key-value pairs.
It writes every 100ms by default, so you don't have to worry about adding multiple keys at the same time.

## Installation
Using yarn:
> yarn add stupid-database

Using npm:
> npm install stupid-database

## Usage
The API is very simple
```js
const stupidDatabase = require('stupid-database')

// Parameters:
// 1. String, path to the JSON
// 2. Number, duration between writes in ms (optional). 100 ms by default
const db = new stupidDatabase('./db.json', 100)
    .then(database => console.log(db))
    .catch(console.error)
    // Resolved when the DB is loaded. Returns the database

db.set('foo', 'bar') // => db
db.get('foo') // => 'bar'
```
For more info, refer to [Map documentation on MDN](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Map)