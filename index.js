const express = require('express');
const cors = require('cors');
const { MongoClient, ServerApiVersion } = require('mongodb');
const ObjectId = require('mongodb').ObjectId
const app = express()
const port = process.env.PORT || 5000;

// use middleware
app.use(cors())
app.use(express.json())

// user : dbuser1
// pass : VPhTXVufN0AUcGIb

const uri = "mongodb+srv://dbuser1:VPhTXVufN0AUcGIb@cluster0.ae6v8.mongodb.net/myFirstDatabase?retryWrites=true&w=majority";
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true, serverApi: ServerApiVersion.v1 });

async function run() {
    try {
        await client.connect()
        const userCollection = client.db("foodExpress").collection("user");

        // hardcode e ager video r code 
        // ----------------------------------------

        // const user = { name: 'eva', email: 'eva@gmail.com' };
        // const result = await userCollection.insertOne(user)
        // console.log(`result with id : ${result.insertedId}`)



        // get all users 

        app.get('/user', async (req, res) => {
            const query = {};
            const cursor = userCollection.find(query)
            const users = await cursor.toArray()
            res.send(users)

        })

        app.get('/user/:id', async (req, res) => {
            const id = req.params.id
            const query = { _id: ObjectId(id) }
            const result = await userCollection.findOne(query)
        })

        // post method video 5 : add a user
        // --------------------------------------------

        app.post('/user', async (req, res) => {
            const newUser = req.body
            console.log("new user", newUser)
            const result = await userCollection.insertOne(newUser)
            res.send(result)
        })

        // update user

        app.put('/user/:id', async (req, res) => {
            const id = req.params.id
            const updatedUser = req.body
            const filter = { _id: ObjectId(id) }
            const options = { upsert: true }
            const updatedDoc = {
                $set: {
                    name: updatedUser.name,
                    email: updatedUser.email
                }
            };
            const result = await userCollection.updateOne(filter, updatedDoc, options)
            res.send(result)

        })

        // delet user

        app.delete('/user/:id', async (req, res) => {
            const id = req.params.id
            const query = { _id: ObjectId(id) }
            const result = await userCollection.deleteOne(query)
            res.send(result)

        })





    }
    finally {
        // await client.close()
    }

}
run().catch(console.dir)


app.get('/', (req, res) => {
    res.send("my node crud running")
})

app.listen(port, () => {
    console.log("crud server is running")
})

