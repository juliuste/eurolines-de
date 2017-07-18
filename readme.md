# eurolines-de

JavaScript client for the [eurolines.de](https://www.eurolines.de/) coach travel API. Complies with the [friendly public transport format](https://github.com/public-transport/friendly-public-transport-format). *In progess… Still missing: `journeys`.*

[![npm version](https://img.shields.io/npm/v/eurolines-de.svg)](https://www.npmjs.com/package/eurolines-de)
[![Build Status](https://travis-ci.org/juliuste/eurolines-de.svg?branch=master)](https://travis-ci.org/juliuste/eurolines-de)
[![dependency status](https://img.shields.io/david/juliuste/eurolines-de.svg)](https://david-dm.org/juliuste/eurolines-de)
[![dev dependency status](https://img.shields.io/david/dev/juliuste/eurolines-de.svg)](https://david-dm.org/juliuste/eurolines-de#info=devDependencies)
[![license](https://img.shields.io/github/license/juliuste/eurolines-de.svg?style=flat)](LICENSE)
[![chat on gitter](https://badges.gitter.im/juliuste.svg)](https://gitter.im/juliuste)

## Installation

```shell
npm install --save eurolines-de
```

## Usage

This package contains data in the [*Friendly Public Transport Format*](https://github.com/public-transport/friendly-public-transport-format).

### `stations([query], [opt])`

Get all stations operated bei eurolines.

```js
const stations = require('eurolines-de').stations

stations().then(console.log) // all stations

stations('Berl') // search for stations
stations({origin: 'Berlin'}) // search for stations reachable by the station with id 'Berlin'
stations('Frankf', {origin: 'Berlin'}) // search in stations reachable from Berlin
```

Searches stations based on `query`. If no `query` parameter is found, returns all stations (still regarding `opt` instead).

The defaults for `opt` look like this:

```js
{
    language: 'de',
    origin: null // set to specific station id for stations reachable by there
}
```

Returns a [Promise](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/promise) that will resolve in an array of `station`s in the [*Friendly Public Transport Format*](https://github.com/public-transport/friendly-public-transport-format) which looks as follows:

```js
[
    {
        "type": "station",
        "id": "Aachen",
        "name": "Aachen (DE)"
    },
    {
        "type": "station",
        "id": "Aalborg",
        "name": "Aalborg (DK)"
    },
    {
        "type": "station",
        "id": "Aalen",
        "name": "Aalen (DE)"
    }
    // …
]
```

## See also

- [FPTF](https://github.com/public-transport/friendly-public-transport-format) - "Friendly public transport format"
- [FPTF-modules](https://github.com/public-transport/friendly-public-transport-format/blob/master/modules.md) - modules that also use FPTF

## Contributing

If you found a bug, want to propose a feature or feel the urge to complain about your life, feel free to visit [the issues page](https://github.com/juliuste/eurolines-de/issues).
