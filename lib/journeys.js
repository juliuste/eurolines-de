'use strict'

const {fetch} = require('fetch-ponyfill')({Promise: require('pinkie-promise')})
const merge = require('lodash.merge')
const moment = require('moment-timezone')
const qs = require('querystring').stringify
const parser = require('cheerio')

const defaults = {
    passengers: 1
}

const validStation = (s) => s.length >= 3 && typeof s === 'string'

const transformDate = (d) => moment.tz(d.substr(-18), 'DD-MM-YYYY | HH:mm', 'Europe/Berlin').toDate() // todo: timezone not always this one

const transformPrice = (p) => p.split(' ').length === 2 ? ({currency: p.split(' ')[0], amount: +p.split(' ')[1]}) : null

const extractPlaceTime = (field, type) => {
    // todo: exact location
    const date = transformDate(field('.booking_data_input-timetable-highlights').find('strong').text())
    if(type === 'origin') return {departure: date}
    else return {arrival: date}
}

const extractTransfers = (field) => ({
    transfers: +field('.eu_stops_popover').text().split(' ')[0]
})

const extractPrices = (fieldPromo, fieldNormal) => {
    const normal = transformPrice(fieldNormal('span.booking_data_input-timetable-highlights').text()) || null

    const promoS = fieldPromo('span.booking_data_input-timetable-highlights')

    if(!normal) return {price: null}//{amount: null, currency: 'EUR'}}

    let promo = null
    if(promoS && promoS.text() && promoS.text().length >= 5) promo = transformRow(promoS.text())

    let result
    const fares = []
    if(promo && promo.amount && promo.amount < normal.amount){
        result = promo
        fares.push({type: 'fare', model: 'promo', price: promo})
    }
    else result = normal
    fares.push({type: 'fare', model: 'normal', price: normal})

    return {price: merge(result, {fares})}
}

const addMissing = (r) => {
    r.legs = [{
        origin: r.origin,
        destination: r.destination,
        departure: r.departure,
        arrival: r.arrival
    }]
    r.id = '' + r.origin + r.destination + r.departure + r.arrival + r.transfers
    return r
}

const transformRow = (origin, destination) => (r) => {
    const row = parser.load(r)
    const fields = Array.from(row('td')).map(parser.load)

    return addMissing(merge(
        {origin, destination, type: 'journey'},
        extractPlaceTime(fields[1], 'origin'),
        extractTransfers(fields[2]),
        extractPlaceTime(fields[3], 'destination'),
        extractPrices(fields[5], fields[6])
    ))
}

const parseResult = (origin, destination) => (res) => {
    const $ = parser.load(res)
    const rows = Array.from($('table.hidden-phone tr.t_there'))
    return rows.map(transformRow(origin, destination))
}

const journeys = (origin, destination, date = Date.now(), opt) => {
    if(!validStation(origin)) throw new Error('origin must be a valid station id')
    if(!validStation(destination)) throw new Error('destination must be a valid station id')

    date = moment.tz(new Date(date), 'Europe/Berlin').format("DD-MM-YYYY")

    opt = merge({}, defaults, opt)

    const params = {
        id: 57,
        origin,
        destination,
        departure_date: date,
        no_passengers: opt.passengers
    }

    return fetch('https://www.eurolines.de/index.php?'+qs(params), {method: 'get'})
    .then((res) => res.text())
    .then(parseResult(origin, destination))
}

module.exports = journeys
