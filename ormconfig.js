require('dotenv').config();

const isProduction = process.env.NODE_ENV?.toLocaleLowerCase() === 'production'
const rootDir = isProduction ? 'dist' : 'src'

module.exports = {
    type: 'postgres',
    url: process.env.DATABASE_URL,
    synchronize: false,
    logging: false,
    entities: [
        rootDir + '/core/infra/data/database/entities/**/*'
    ],
    migrations : [
        rootDir + '/core/infra/data/database/migrations/**/*'
    ],
    cli: {
        entitiesDir: 'src/core/infra/data/database/entities',
        migrationsDir: 'src/core/infra/data/database/migrations'
    },
    extra: {
        ssl: {
             rejectUnauthorized: false
         }
    }
}