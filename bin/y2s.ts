#!/usr/bin/env node
'use strict'

const { run } = require(process.env.NODE_ENV === 'production' ? '../dist' : '../src')
run(process.argv.slice(2))
