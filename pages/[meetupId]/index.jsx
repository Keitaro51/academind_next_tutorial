import {MongoClient, ObjectId} from 'mongodb'
import Head from 'next/head'
import MeetupDetail from '../../components/meetups/MeetupDetail'

const MeetupDetails = (props) => {
  return (
    <>
      <Head>
        <title>{props.meetup.title}</title>
        <meta name="description" content={props.meetup.description} />
      </Head>
      <MeetupDetail
        image={props.meetup.image}
        title={props.meetup.title}
        address={props.meetup.address}
        description={props.meetup.description}
      />
    </>
  )
}

export const getStaticPaths = async () => {
  const client = await MongoClient.connect(`${process.env.MONGODB_URI}`)

  const db = client.db()
  const meetupsCollection = db.collection('meetups')

  const meetups = await meetupsCollection.find({}, {_id: 1}).toArray()

  client.close()

  return {
    fallback: 'blocking', //false = all supported dynamic routes. Any other url will trigger a 404 error
    paths: meetups.map((meetup) => ({
      params: {
        meetupId: meetup._id.toString(),
      },
    })),

    // [
    //   {
    //     params: {
    //       meetupId: 'm1',
    //     },
    //   },
    //   {
    //     params: {
    //       meetupId: 'm2',
    //     },
    //   },
    // ],
  }
}

export const getStaticProps = async (context) => {
  const {meetupId} = context.params

  //fetch data for a single meetup

  const client = await MongoClient.connect(`${process.env.MONGODB_URI}`)

  const db = client.db()
  const meetupsCollection = db.collection('meetups')

  const selectedMeetup = await meetupsCollection.findOne({
    _id: new ObjectId(meetupId),
  })

  client.close()

  return {
    props: {
      meetup: {
        id: selectedMeetup._id.toString(),
        image: selectedMeetup.image,
        title: selectedMeetup.title,
        address: selectedMeetup.address,
        description: selectedMeetup.description,
      },
    },
  }
}

export default MeetupDetails
