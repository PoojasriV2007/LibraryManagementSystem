import mongoose from 'mongoose'
import config from '../config.js'
import { createMongoStore } from './mongoStore.js'
import { createFileStore } from './fileStore.js'

const redact = (uri) => uri.replace(/\/\/([^:@/]+):([^@/]+)@/, '//$1:****@')

export async function connectStore() {
  try {
    await mongoose.connect(config.mongoUri, { serverSelectionTimeoutMS: 4000 })
    console.log(`✅ Connected to MongoDB at ${redact(config.mongoUri)}`)
    mongoose.connection.on('disconnected', () => console.warn('⚠️  MongoDB disconnected'))
    mongoose.connection.on('reconnected', () => console.log('✅ MongoDB reconnected'))
    return createMongoStore()
  } catch (err) {
    if (!config.allowFileFallback) throw err
    await mongoose.disconnect().catch(() => {})
    console.warn(`⚠️  MongoDB unavailable (${err.message}).`)
    console.warn(`   Falling back to temporary local file storage: ${config.fileDbPath}`)
    return createFileStore(config.fileDbPath)
  }
}
