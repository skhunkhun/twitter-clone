import { SearchIcon } from '@heroicons/react/outline'
import React from 'react'
import { TwitterFollowButton, TwitterMentionButton, TwitterMomentShare, TwitterTimelineEmbed, TwitterTweetEmbed } from 'react-twitter-embed'
import { Timeline, Tweet } from 'react-twitter-widgets'

function Widgets() {
  return (
    <div className='px-2 mt-2 col-span-2 hidden lg:inline'>
        <div className='flex items-center space-x-2 bg-gray-100 p-3 rounded-full'>
            <SearchIcon className='h-5 w-5 text-gray-400'/>
            <input type='text' placeholder='Search Twitter' className='flex-1 outline-none bg-transparent'></input>
        </div>

        <TwitterTimelineEmbed
          sourceType="profile"
          screenName="saurabhnemade"
          options={{height: 400}}
        />
        
        <TwitterMomentShare
           momentId={'650667182356082688'}
           options={{height: 400}}
        />

    </div>
  )
}

export default Widgets