require('dotenv').config();

module.exports = {
    type: 'postgres',
    url: process.env.DATABASE_URL,
    synchronize: false,
    logging: false,
    entities: [
        'dist/core/infra/data/database/entities/**/*'
    ],
    migrations : [
        'dist/core/infra/data/database/migrations/**/*'
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