import type { GetServerSideProps, NextPage } from 'next'
import Head from 'next/head'
import { Toaster } from 'react-hot-toast'
import Feed from '../../twitter/components/Feed'
import Sidebar from '../../twitter/components/Sidebar'
import Widgets from '../../twitter/components/Widgets'
import { Tweet } from '../../twitter/typings'
import { fetchTweets } from '../../twitter/utils/fetchTweets'

interface Props {
  tweets: Tweet[]
}

const Home = ({tweets}: Props ) => {

  return (
    <div className="lg:max-w-6xl mx-auto max-h-screen overflow-hidden">
      <Head>
        <title>Twitter clone</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <Toaster/>

      <main className='grid grid-cols-9'>

        <Sidebar />
    
        <Feed tweets={tweets}/>
     
        <Widgets/>

      </main>
    </div>
  )
}

export default Home

export const getServerSideProps: GetServerSideProps = async (context) => {

  const tweets = await fetchTweets();
  
  return {
    props: {
      tweets,
    }
  }
}
