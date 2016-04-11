# moviements

## External dependencies
* mongodb
* nodejs
* vader sentiment (i.e. pip install -U vaderSentiment)
    - Remember to have vaderSentiment in PYTHONPATH (i.e. '/usr/local/lib/python2.7/dist-packages')
    - Install using pip as import is slightly different otherwise.

## Run project
```
$ npm install
$ npm pack
$ npm start
```

## Flush database
```
$ mongo moviements --eval "db.getCollectionNames().forEach(function(n){db[n].remove({})});"
```