const mongoose = require('mongoose');

let database = {
    get connect () {
        (async ()=> {

            try {
            await mongoose.connect(process.env.DATABASE_URL);
            console.log('Connection With Database Successful');
            }catch (e) {
            throw new Error(`Connection With Database Failed ${e}`)
            }

        })()
    }
}

Object.freeze(database); /* freeze the database object to prevent
accidentally update or remove connect method */

module.exports = database;