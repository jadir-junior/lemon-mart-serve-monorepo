import http, { Server } from 'http'

import * as document from 'document-ts'

import { app } from './app'
import { config } from './config'
import { initializeDemoUser } from './services/user.service'

export let Instance: Server

async function start() {
  console.log('Starting server: ')
  console.log(`isProd: ${config.IsProd}`)
  console.log(`port: ${config.Port}`)
  console.log(`mongoUri: ${config.MongoUri}`)

  if (!config.JwtSecret() || config.JwtSecret() === 'xxxxxx') {
    throw new Error(
      'JWT_SECRET env var not set or set to default value. Pick a secure password.'
    )
  }

  try {
    await document.connect(config.MongoUri, config.IsProd)
    console.log('Connected to database!')
  } catch (error) {
    console.log(`Couldn't connect to a database: ${error}`)
  }

  Instance = http.createServer(app)

  Instance.listen(config.Port, async () => {
    console.log(`Server listening on port ${config.Port}...`)
    console.log('Initializing default user...')
    await createIndexes()
    // Seed the database with a demo user. Replace with yout own function to seed admin users
    await initializeDemoUser(
      process.env.DEMO_EMAIL || '',
      process.env.DEMO_PASSWORD || '',
      process.env.DEMO_USERID || ''
    )
    console.log('Done.')
  })
}

async function createIndexes() {
  console.log('Create indexes...')
}

start()
