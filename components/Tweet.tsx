import React, { useEffect, useState } from 'react'
import {Tweet, Comment, CommentBody} from '../typings'
import TimeAgo from 'javascript-time-ago'

import en from 'javascript-time-ago/locale/en.json'
import ru from 'javascript-time-ago/locale/ru.json'

import ReactTimeAgo from 'react-time-ago'

TimeAgo.addDefaultLocale(en)
TimeAgo.addLocale(ru)

import {
    ChatAlt2Icon,
    HeartIcon,
    SwitchHorizontalIcon,
    UploadIcon
} from '@heroicons/react/outline'
import {fetchComments} from '../utils/fetchComments' 
import { useSession } from 'next-auth/react'
import toast from 'react-hot-toast'



interface Props{
    tweet: Tweet
}

function Tweet({tweet} : Props) {

    const [comments, setComments] = useState<Comment[]>([])
    const [commentIsVisible, setCommentIsVisible] = useState<boolean>(false)
    const [input, setInput] = useState<string>('')

    const {data: session} = useSession()

    const refreshComments = async () => {

        const comments: Comment[] = await fetchComments(tweet._id)
        setComments(comments);
    }

    useEffect (() => {
        refreshComments();
    }, [])

    const handleComment = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();

        const commentToast = toast.loading('Posting Comment...')

        // Comment logic
        const comment: CommentBody = {
            comment: input,
            tweetId: tweet._id,
            username: session?.user?.name || 'Unknown User',
            profileImg: session?.user?.image || 'https://links.papareact.com/gll',
        }

        const result = await fetch(`/api/addComment`, {
            body: JSON.stringify(comment),
            method: 'POST',
        })

        console.log('WOOHOO we made it', result)
            toast.success('Comment Posted!', {
            id: commentToast,
        })

        setInput('')
        setCommentIsVisible(false)
        refreshComments()

    }

  return (
    <div key={tweet._id} className='flex flex-col space-x-3 border-y p-5 border-gray-100'>
        <div className='flex space-x-3'>
            <img className='h-10 w-10 rounded-full object-cover' src={tweet.profileImg} alt=''></img>

            <div>
                <div className='flex items-center space-x-1'>
                    <p className='mr-1 font-bold'>{tweet.username}</p>
                    <p className='hidden text-sm text-gray-500'>@{tweet.username.replace(/\s+/g, "").toLowerCase()}</p>

                    <ReactTimeAgo 
                        className='text-sm text-gray-500'
                        locale='en-US'
                        date={new Date(tweet._createdAt)}                     />
                </div>

                <p className='pt-1'>{tweet.text}</p>

                {tweet.image && (
                    <img src={tweet.image} alt='' className='m-5 ml-0 mb-1 max-h-60 rounded-lg object-cover shadow-sm'/>
                )}
            </div>
        </div>

        <div onClick={() => session && setCommentIsVisible(!commentIsVisible)} className='mt-5 flex justify-between'>
            <div className='flex cursor-pointer items-center space-x-3 text-gray-400'>
                <ChatAlt2Icon className='h-5 w-5' />
                <p>{comments.length}</p>
            </div>
                
            <div  className='flex cursor-pointer items-center space-x-3 text-gray-400'>
                <SwitchHorizontalIcon className='h-5 w-5' />
            </div>

            <div className='flex cursor-pointer items-center space-x-3 text-gray-400'>
                <HeartIcon className='h-5 w-5' />
            </div>

            <div className='flex cursor-pointer items-center space-x-3 text-gray-400'>
                <UploadIcon className='h-5 w-5'/>
            </div>
        </div>

        {commentIsVisible && (
            <form onSubmit={handleComment} className='mt-3 flex space-x-3'>
                <input value={input} onChange={(e) => setInput(e.target.value)} className='flex-1 rounded-lg bg-gray-100 p-2 outline-none' type='text' placeholder='Write a comment...'></input>
                <button type='submit' disabled={!input} className='text-twitter disabled:text-gray-200'>Post</button>
            </form>
        )}

        {comments?.length > 0 && (
            <div className='my-2 mt-5 max-h-44 space-y-5 overflow-y-scroll border-t border-gray-100 p-5'> 
                {comments.map(comment => (
                    <div key={comment._id} className='flex space-x-2 '> 
                        <img className='mt-2 h-7 w-7 rounded-full object-cover' src={comment.profileImg} alt=''></img>

                        <div> 
                            <div className='flex items-center space-x-1'> 
                                <p className='mr-1 font-bold'>{comment.username}</p>
                                <p className='hidden text-sm text-gray-500 lg:inline'>@{comment.username.replace(/\s+/g, "").toLowerCase()}</p>

                                <ReactTimeAgo 
                                className='text-sm text-gray-500'
                                locale='en-US'
                                date={new Date(comment._createdAt)}
                                                     />
                            </div>
                            <p>{comment.comment}</p>
                        </div>
                       
                    </div>
                ))}

            </div>
        )}
    </div>
  )
}

export default Tweet