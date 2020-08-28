require('log-timestamp')
require('dotenv').config()
const knex = require('knex')({
    client: 'mysql',
    connection: {
        host: '127.0.0.1',
        user: process.env.DB_USER,
        password: process.env.DB_PASS,
        database: process.env.DB
    }
});

const createInsult = async (user, insult) => {
    const insultExists = await knex.select('insult').where('insult', insult).from('gtfb')
    if (insultExists.length < 1){
        console.log(`CREATING INSULT: ${insult} IN aboftybot.gtfb TABLE FOR ${user}`)
        const newInsult = await knex('gtfb').insert({id: 'null', insult, createdBy: user, dateCreated: new Date()})
        const insultId = await knex.select('id').where('insult',insult).from('gtfb')
        return `Created new insult: ${insult}. ID: ${insultId[0]["id"]}.`
    } else {
        return `That insult already exists.`
    }
}

const selectRandomInsult = async () => {
    const insult = await knex.select('insult').from('gtfb').orderByRaw('rand()').limit(1);
    console.log(`SUCCESSFULLY RETRIEVED ${insult[0]["insult"]} FROM aboftybot.gtfb`)
    return `${insult[0]["insult"]}`
}

const deleteInsult = async (user, id) => {
    const insultOwner = await knex.select('createdBy').where('id', id).from('gtfb')
    if (insultOwner.length > 0 && insultOwner[0]["createdBy"] == user ) {
        console.log(`Deleting ID from database.`)
        await knex('gtfb').where('id', id).del()
        return `Successfully deleted insult from the database.`
    } else {
        return `Unable to delete insult from database. Maybe you do not own this insult?`
    } 
}

module.exports = {
    createInsult,
    selectRandomInsult,
    deleteInsult
}