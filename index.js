const express = require('express');
const cors = require('cors')
require('dotenv').config()
const app =express();
const port =process.env.PORT||5100;

// middleware
app.use(cors());
app.use(express.json());


//mongodb
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
const uri = `mongodb+srv://${process.env.DB_USER}:O5FvXo4DGW2JYASI@cluster0.xlrthmr.mongodb.net/?retryWrites=true&w=majority`;

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
    client.connect();
    const database =client.db('toysDB');
    const toysCollection=database.collection('toys');
    app.post('/toy', async (req,res)=>{
        const toy =req.body;
        const result =await toysCollection.insertOne(toy)
        res.send(result);
    })
    app.get('/toys', async (req,res)=>{
         const query=req.query;
         if(!query){
         const result = await toysCollection.find().toArray();
         res.send(result)
         return;
         }
         const result = await toysCollection.find(query).toArray();
         res.send(result)    
    })
    app.get('/toys/user', async(req,res)=>{
          const query =req.query
          const result=await toysCollection.find(query).toArray()
          res.send(result)
          console.log(query);
    })
    app.patch('/toys/:id',async(req,res)=>{
      const id =req.params.id;
      const filter ={_id : new ObjectId(id)};
      const toy=req.body;
      const updatedtoy={
        $set:{price:toy.price,
             quantity:toy.quantity,
             description:toy.description
             }
      }
      const result=await toysCollection.updateOne(filter,updatedtoy)
      res.send(result);
    })
    // Send a ping to confirm a successful connection
    await client.db("admin").command({ ping: 1 });
    console.log("Pinged your deployment. You successfully connected to MongoDB!");
  }
  
  finally {
    // Ensures that the client will close when you finish/error
    //await client.close();
  }
}
run().catch(console.dir);



app.get('/',(req,res)=>{
    res.send('toy land is running');
})
app.listen(port,()=>{
    console.log(`server is running at port ${port}`);
})