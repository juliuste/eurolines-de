'use strict'

const tape = require('tape')
const eurolines = require('./index')
const moment = require('moment-timezone')
const isDate = require('lodash.isdate')

tape('eurolines.stations', (t) => {
	t.plan(6)
	eurolines.stations().then((stations) => {
		t.ok(stations.length > 100, 'stations length')
		t.ok(stations.filter((s) => s.id === 'Berlin').length === 1, 'stations berlin')
	})
	.catch((e) => {throw new Error(e)})
	eurolines.stations('Frankfurt am Ma').then((stations) => {
		t.ok(stations.length === 1, 'stations -> Frankfurt length')
		t.ok(stations[0].type === 'station', 'stations -> Frankfurt type')
		t.ok(stations[0].id === 'Frankfurt am Main', 'stations -> Frankfurt id')
		t.ok(stations[0].name === 'Frankfurt am Main (DE)', 'stations -> Frankfurt name')
	})
	.catch((e) => {throw new Error(e)})
})

tape('eurolines.journeys', (t) => {
	eurolines.journeys("Berlin", "Paris", moment.tz("Europe/Berlin").add(30, "days").toDate()).then((journeys) => {
		t.plan(15)

		t.ok(journeys.length > 0, 'journeys length')
		t.ok(journeys[0].type === 'journey', 'journey type')
		t.ok(journeys[0].id.length >= 10, 'journey id')
		t.ok(journeys[0].origin === 'Berlin', 'journey origin')
		t.ok(journeys[0].destination === 'Paris', 'journey destination')
		t.ok(isDate(journeys[0].departure), 'journey departure')
		t.ok(isDate(journeys[0].arrival), 'journey arrival')

		t.ok(journeys[0].legs.length > 0, 'journey legs length')
		t.ok(journeys[0].legs[0].origin === 'Berlin', 'journey leg origin')
		t.ok(journeys[0].legs[0].destination === 'Paris', 'journey leg destination')
		t.ok(isDate(journeys[0].legs[0].departure), 'journey leg departure')
		t.ok(isDate(journeys[0].legs[0].arrival), 'journey leg arrival')

		t.ok(journeys[0].transfers >= 0, 'journey transfers')

		t.ok(journeys[0].price.amount > 0, 'journey price amount')
		t.ok(journeys[0].price.currency === 'EUR', 'journey price currency')
	})
	.catch((e) => {throw new Error(e)})
})
