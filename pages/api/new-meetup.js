import {MongoClient} from 'mongodb'

// api/new-meetup
// POST

const handler = async (req, res) => {
  if (req.method === 'POST') {
    const data = req.body

    const client = await MongoClient.connect(`${process.env.MONGODB_URI}`)

    const db = client.db()

    const meetupsCollection = db.collection('meetups')
    const result = await meetupsCollection.insertOne(data)

    client.close()
    res
      .status(201)
      .json({newId: result.insertedId, message: 'meetup inserted!'})
  }
}

export default handler
