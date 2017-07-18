'use strict'

const {fetch} = require('fetch-ponyfill')({Promise: require('pinkie-promise')})
const merge = require('lodash.merge')
const isObject = require('lodash.isObject')

const defaults = {
    language: 'de',
    origin: null // could also be called 'destination', maybe choose a more general name
}

const transformStation = (s) => ({
    type: 'station',
    id: s.id,
    name: s.text
})

const stations = (query = {}, opt = {}) => {
    if(!query) query = ''
    if(isObject(query)){
        opt = query
        query = ''
    }
    opt = merge({}, defaults, opt)

    opt.origin = opt.origin ? opt.origin : ''

    return fetch(`https://www.eurolines.de/fileadmin/php/booking/getCities.php?q=${query}&dest=${opt.origin}&lang=${opt.language}`, {method: 'get'})
    .then((res) => res.text())
    .then((res) => res.substr(11, res.length-13))
    .then(JSON.parse)
    .then((data) => data.map(transformStation))
}

module.exports = stations
