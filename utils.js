
import sqlite3 from 'sqlite3'
import { open } from 'sqlite'

const db = await open({
    filename: './auto.db',
    driver: sqlite3.Database
});

await db.migrate({
    migrationsPath: './migrations'
})

export default db;