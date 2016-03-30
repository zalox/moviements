# moviements

## External dependencies
* mongodb
* nodejs

## Run project
```
$ npm install
$ npm start
```

## Flush database
```
$ mongo moviements --eval "db.getCollectionNames().forEach(function(n){db[n].remove({})});"
```