import React, { Dispatch, SetStateAction, useRef, useState } from 'react'
import {
    SearchCircleIcon, PhotographIcon, EmojiHappyIcon, CalendarIcon, LocationMarkerIcon
} from '@heroicons/react/outline'
import { useSession } from 'next-auth/react'
import { Tweet, TweetBody } from '../typings'
import { TwitterTimelineEmbed } from 'react-twitter-embed'
import { fetchTweets } from '../utils/fetchTweets'
import toast from 'react-hot-toast'
import { setUncaughtExceptionCaptureCallback } from 'process'

interface Props {
    setTweets: Dispatch<SetStateAction<Tweet[]>>
}

function TweetBox({setTweets} : Props) {

    const imageInputRef = useRef<HTMLInputElement>(null)

    const [input, setInput] = useState<string>("")
    const [image, setImage] = useState<string>("")
    const {data: session} = useSession()
    const [imageBoxIsOpen, setImageBoxIsOpen] = useState<boolean>(false)

    const addImageToTweet = (e: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
        e.preventDefault()

        if(!imageInputRef.current?.value) return;

        setImage(imageInputRef.current.value)
        imageInputRef.current.value= ''
        setImageBoxIsOpen(false)

    }

    const postTweet = async () => {
        const tweetInfo: TweetBody = {
            text: input,
            username: session?.user?.name || 'Unknown User',
            profileImg: session?.user?.image || 'https://links.papareact.com/gll',
            image: image
        }

        const result = await fetch (`/api/addTweet`, {
            body: JSON.stringify(tweetInfo),
            method: 'POST'
        })

        const json = await result.json();

        const newTweets = await fetchTweets();
        setTweets(newTweets)

        toast('Tweet Posted', {
            icon: '😘'
        })
        return json

    }

    const handleTweet = (e: React.MouseEvent<HTMLButtonElement, globalThis.MouseEvent>) => {
        e.preventDefault()

        postTweet()

        setInput('')
        setImage('')
        setImageBoxIsOpen(false)
    }
    
  return (
    <div className='flex space-x-2 p-5'> 
        <img src={session?.user?.image || 'https://links.papareact.com/gll'} alt='' className=' mt-4 h-14 w-14 rounded-full object-cover '></img>

        <div className='flex flex-1 items-center pl-2'>
            <form className='flex flex-1 flex-col'>
                <input 
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    type='text' 
                    placeholder="What's Happenning?" 
                    className='h-24 w-full text-xl outline-none placeholder:text-xl'
                    />
                <div className='flex items-center'> 
                    <div className='flex flex-1 space-x-2 text-twitter'>
                        <PhotographIcon onClick={() =>  setImageBoxIsOpen(!imageBoxIsOpen)} className='h-5 w-5 cursor-pointer transition-transform duration-150 ease-out hover:scale-150'/>
                        <SearchCircleIcon className='h-5 w-5 cursor-pointer'/>
                        <EmojiHappyIcon className='h-5 w-5 cursor-pointer'/>
                        <CalendarIcon className='h-5 w-5 cursor-pointer'/>
                        <LocationMarkerIcon className='h-5 w-5 cursor-pointer'/>
                    </div>

                    <button 
                        disabled={!input || !session}
                        className='bg-twitter px-5 py-2 font-bold text-white rounded-full disabled:opacity-40'
                        onClick={handleTweet}>Tweet</button>
                </div>

                {imageBoxIsOpen && (
                    <form className='mt-5 flex rounded-lg bg-twitter/80 py-2 px-4'> 
                        <input ref={imageInputRef} className='flex-1 bg-transparent p-2 text-white outline-none placeholder:text-white' type='text' placeholder="Enter Image URL..."></input>
                        <button type='submit' onClick={addImageToTweet} className='font-bold text-white'>Add Image</button>
                    </form>
                )}

                {image && (
                    <img className='mt-10 h-40 w-full rounded-xl object-contain shadow-lg ' src={image} alt=''></img>
                )}
            </form>
        </div>
    </div>
  )
}

export default TweetBox