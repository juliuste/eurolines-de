'use strict'

const tapeWithoutPromise = require('tape')
const addPromiseSupport = require('tape-promise').default
const tape = addPromiseSupport(tapeWithoutPromise)
const validate = require('validate-fptf')
const moment = require('moment-timezone')
const eurolines = require('.')

tape('eurolines.stations', async t => {
	const allStations = await eurolines.stations()

	for (let station of allStations) validate(station)

	t.ok(allStations.length > 100, 'stations length')
	t.ok(allStations.filter((s) => s.id === 'Berlin').length === 1, 'stations berlin')

	const frankfurtStations = await eurolines.stations('Frankfurt')
	t.ok(frankfurtStations.length >= 1, 'stations -> Frankfurt length')
	t.ok(frankfurtStations[0].id.substr(0, 9) === 'Frankfurt', 'stations -> Frankfurt id')

	t.end()
})

tape('eurolines.journeys', async t => {
	const journeys = await eurolines.journeys('Berlin', 'Paris', moment.tz('Europe/Berlin').add(30, 'days').toDate())

	for (let journey of journeys) validate(journey)

	t.ok(journeys.length > 0, 'journeys length')

	t.ok(journeys[0].transfers >= 0, 'journey transfers')

	t.ok(journeys[0].price.amount > 0, 'journey price amount')
	t.ok(journeys[0].price.currency === 'EUR', 'journey price currency')

	t.end()
})
