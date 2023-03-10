import Head from 'next/head'
import {MongoClient} from 'mongodb'

import MeetupList from '../components/meetups/MeetupList'

const HomePage = (props) => {
  return (
    <>
      <Head>
        <title>React Meetups</title>
        <meta
          name="description"
          content="Browse a huge list of highly active React meetups!"
        />
      </Head>
      <MeetupList meetups={props.meetups} />
    </>
  )
}

export const getStaticProps = async () => {
  // fetch data from an API or any code executed on server like connect db, using fs...

  //don't need to fetch data from own api, just write serverside code here

  const client = await MongoClient.connect(`${process.env.MONGODB_URI}`)

  const db = client.db()
  const meetupsCollection = db.collection('meetups')
  //const meetupsCollection = await mongoConnect()

  const meetups = await meetupsCollection.find().toArray()
  client.close()
  // run on build process then on server at least every 10s or when  a request is made
  // faster than getServerSideProps, except if need context object with req or res, or data changes multiple times every seconds
  return {
    props: {
      meetups: meetups.map((meetup) => ({
        title: meetup.title,
        address: meetup.address,
        image: meetup.image,
        id: meetup._id.toString(),
      })),
    },
    revalidate: 10,
  }
}

// export const getServerSideProps = async (context) => {
//   const req = context.req
//   const res = context.res
//   // fetch data from an API or any code executed on server like connect db, using fs...
//   // run on server
//   return {
//     props: {
//       meetups: DUMMY_MEETUPS,
//     },
//   }
// }

export default HomePage
