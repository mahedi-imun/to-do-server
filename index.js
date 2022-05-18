const cors = require('cors');
const express = require('express');
const app = express()
const port = process.env.PORT || 5000
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
require('dotenv').config();

//middleware
app.use(cors())
app.use(express.json());

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.eyncz.mongodb.net/?retryWrites=true&w=majority`;
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true, serverApi: ServerApiVersion.v1 });

async function run() {
  try {
    await client.connect();
    const toDoCollection = client.db("warehouseProducts").collection('document');

    // api for post to do docs
    app.post('/to-do',async (req,res)=>{
        const toDo = req.body
        const result = await toDoCollection.insertOne(toDo)
        res.send(result)
    })
    app.get('/to-do',async (req,res)=>{
        const result = await toDoCollection.find().toArray()
        res.send(result)
    })
    app.put('/to-do/:id',async (req,res)=>{
        const id = req.params.id
        const filter = { _id: ObjectId(id) };
        const options = { upsert: true };
        const updateDoc = {
            $set: {
                complete: true
            }
        };
        const result = await toDoCollection.updateOne(filter, updateDoc, options);
        res.send(result)
    })

    app.delete('/to-do/:id', async (req, res) => {
        const id = req.params.id
        const query = { _id: ObjectId(id) }
        const result = await toDoCollection.deleteOne(query)
        res.send(result)
    })

  } finally {
    //   await client.close();
  }
}
run().catch(console.dir);


app.get('/', (req, res) => {
  res.send('todo server is running')
})
app.listen(port, () => {
  console.log('lesten port ', port);
})