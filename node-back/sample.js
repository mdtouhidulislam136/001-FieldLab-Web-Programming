import { Client } from 'pg'
// need to know the postgres users password,currently does not matter what pasword is given
const connectionString = 'PostgresSQL://postgres:Robotti123@172.16.101.131:5432/test_db'

const client = new Client({
    connectionString: connectionString
})
client.connect()

client.query('SELECT * FROM public.robottidata', (err, res) => {
    console.log(err, res)
    client.end()
})
