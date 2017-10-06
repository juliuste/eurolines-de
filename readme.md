# eurolines-de

JavaScript client for the [eurolines.de](https://www.eurolines.de/) coach travel API. Complies with the [friendly public transport format](https://github.com/public-transport/friendly-public-transport-format). *In progess…*

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
    origin: null // set to specific station id to filter for stations reachable by there
}
```

Returns a [Promise](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/promise) that will resolve in an array of `station`s in the [*Friendly Public Transport Format*](https://github.com/public-transport/friendly-public-transport-format) which looks as follows:

```js
[
    {
        type: 'station',
        id: 'Aachen',
        name: 'Aachen (DE)'
    },
    {
        type: 'station',
        id: 'Aalborg',
        name: 'Aalborg (DK)'
    },
    {
        type: 'station',
        id: 'Aalen',
        name: 'Aalen (DE)'
    }
    // …
]
```

### `journeys(origin, destination, date = Date.now(), opt = {})`

Get directions and prices for routes from A to B. ***scraped 😕***

```js
const journeys = require('eurolines-de').journeys

journeys('Berlin', 'Paris', new Date(), {passengers: 1})
.then(console.log)
.catch(console.error)
```

`defaults`, partially overridden by the `opt` parameter, looks like this:

```js
const defaults = {
    passengers: 1
}
```

Returns a [Promise](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/promise) that will resolve with an array of `journey`s in the [*Friendly Public Transport Format*](https://github.com/public-transport/friendly-public-transport-format) which looks as follows.
*Note that the legs are not fully spec-compatible, as the `schedule` is missing in legs, all dates are Date() objects instead of ISO strings and due to API-specific reasons, there will always only be one leg and the additional `transfers` key instead.*

```js
[
    {
        origin: 'Berlin',
        destination: 'Paris',
        type: 'journey',
        id: 'BerlinParisWed Jul 19 2017 19:30:00 GMT+0200 (CEST)Thu Jul 20 2017 09:45:00 GMT+0200 (CEST)0',
        departure: '2017-07-19T17:30:00.000Z', // JS Date() object
        arrival: '2017-07-20T07:45:00.000Z', // JS Date() object
        transfers: 0,
        price: {
            currency: 'EUR',
            amount: 83,
            fares: [
                {
                    type: 'fare',
                    model: 'normal',
                    price: {
                        currency: 'EUR',
                        amount: 83
                    }
                }
            ]
        },
        legs: [
            {
                origin: 'Berlin',
                destination: 'Paris',
                departure: '2017-07-19T17:30:00.000Z', // JS Date() object
                arrival: '2017-07-20T07:45:00.000Z' // JS Date() object
            }
        ]
    }
    // …
]
```

## See also

- [FPTF](https://github.com/public-transport/friendly-public-transport-format) - "Friendly public transport format"
- [FPTF-modules](https://github.com/public-transport/friendly-public-transport-format/blob/master/modules.md) - modules that also use FPTF

## Contributing

If you found a bug, want to propose a feature or feel the urge to complain about your life, feel free to visit [the issues page](https://github.com/juliuste/eurolines-de/issues).
