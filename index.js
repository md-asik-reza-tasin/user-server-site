const express = require("express");
const app = express();
const port = process.env.PORT || 5000;
const cors = require("cors");
require("dotenv").config();
const { MongoClient, ServerApiVersion, ObjectId } = require("mongodb");

app.use(cors());
app.use(express.json());

const uri = `mongodb+srv://${process.env.USER}:${process.env.PASS}@cluster0.ngjfr.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0`;

// Create a MongoClient with a MongoClientOptions object to set the Stable API version
const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  },
});

async function run() {
  try {
    // Connect the client to the server	(optional starting in v4.7)
    await client.connect();

    const database = client.db("database");
    const usersData = database.collection("userData");

    app.post("/users", async (req, res) => {
      const users = req.body;
      // console.log(users);
      const result = await usersData.insertOne(users);
      res.send(result);
    });

    app.get("/users", async (req, res) => {
      const cursor = await usersData.find();
      const result = await cursor.toArray();
      res.send(result);
    });

    app.get("/users/:id", async (req, res) => {
      const cursor = req.params.id;
      const query = { _id: new ObjectId(cursor) };
      const result = await usersData.findOne(query);
      res.send(result);
    });

    app.put("/users/:id", async (req, res) => {
      const cursor = req.params.id;
      const b = req.body;
      console.log(cursor);

      const query = { _id: new ObjectId(cursor) };
      const option = { upsert: true };
      const updateUserInfoFromServer = {
        $set: {
          name: b.name,
          email: b.email,
          gender: b.sex,
          status: b.sta,
        },
      };

      console.log(updateUserInfoFromServer);

      const result = await usersData.updateOne(
        query,
        updateUserInfoFromServer,
        option
      );

      res.send(result);
    });

    app.delete("/users/:id", async (req, res) => {
      const userId = req.params.id;
      const query = { _id: new ObjectId(userId) };
      const result = await usersData.deleteOne(query);
      res.send(result);
    });

    // Send a ping to confirm a successful connection
    await client.db("admin").command({ ping: 1 });
    console.log(
      "Pinged your deployment. You successfully connected to MongoDB!"
    );
  } finally {
    // Ensures that the client will close when you finish/error
    // await client.close();
  }
}
run().catch(console.log);

app.get("/", (req, res) => {
  res.send("hello");
});

app.listen(port, () => {
  console.log(`SERVER IS RUNNING ${port}`);
});
