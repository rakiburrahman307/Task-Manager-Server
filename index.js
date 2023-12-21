const express = require('express');
require('dotenv').config()
const cors = require('cors');
const { MongoClient, ServerApiVersion } = require('mongodb');
const app = express();
const port = process.env.PORT || 5000;
// Middle Ware
app.use(express.json());
app.use(cors({
    origin: ['http://localhost:5173', 'http://localhost:5000'],
    credentials: true,
}));
app.use((req, res, next) => {
    res.setHeader('Cross-Origin-Opener-Policy', 'same-origin');
    next();
});


const uri = `mongodb+srv://${process.env.USER_DB}:${process.env.USER_PASS}@cluster0.044ysfk.mongodb.net/?retryWrites=true&w=majority`;

// Create a MongoClient with a MongoClientOptions object to set the Stable API version
const client = new MongoClient(uri, {
    serverApi: {
        version: ServerApiVersion.v1,
        strict: true,
        deprecationErrors: true,
    }
});

async function run() {
    try {
        // Connect the client to the server	(optional starting in v4.7)
        // await client.connect();

        // Database and Collection 
        const allTask = client.db('Task-Manager').collection('all_task');

        // Service Apis 
        // Get the all Task
        app.get('/all_task', async (req, res) => {
            const cursor = allTask.find();
            const result = await cursor.toArray();
            res.send(result);
        });


        // app.delete('/allMeal/:id', async (req, res) => {
        //     const id = req.params.id;
        //     const query = { _id: new ObjectId(id) }
        //     const result = await mealsCollections.deleteOne(query);
        //     res.send(result);
        // });
        app.post('/new_task', async (req, res) => {
            const mealData = req.body;
            const result = await allTask.insertOne(mealData);
            res.send(result);
        });

       
        console.log("Pinged your deployment. You successfully connected to MongoDB!");
    } finally {
        // Ensures that the client will close when you finish/error
        // await client.close();
    }
}
run().catch(console.dir);
app.get('/', (req, res) => {
    res.send("Server Is Running Now")

});
app.listen(port, () => {
    console.log(`Server is running port: ${port}`)
});
