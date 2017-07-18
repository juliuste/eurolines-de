'use strict'

const tape = require('tape')
const eurolines = require('./index')

tape('eurolines.stations', (t) => {
	t.plan(6)
	eurolines.stations().then((stations) => {
		t.ok(stations.length > 100, 'stations length')
		t.ok(stations.filter((s) => s.id === 'Berlin').length === 1, 'stations berlin')
	})
	eurolines.stations('Frankfurt am Ma').then((stations) => {
		t.ok(stations.length === 1, 'stations -> Frankfurt length')
		t.ok(stations[0].type === 'station', 'stations -> Frankfurt type')
		t.ok(stations[0].id === 'Frankfurt am Main', 'stations -> Frankfurt id')
		t.ok(stations[0].name === 'Frankfurt am Main (DE)', 'stations -> Frankfurt name')
	})
	.catch((e) => {throw new Error(e)})
})
