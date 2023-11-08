import React from 'react'
import InfiniteScroll from 'react-infinite-scroll-component'
import ProfileImage from './ProfileImage';
import Link from 'next/link';
import { Underline } from 'lucide-react';

type Thread = {
  id: string,
  content: string,
  createdAt: string,
  likeCount: number,
  likedByMe: boolean,
  user: { id: string, image: string | null, name: string | null };
}

type InfiniteThreadListProps = {
  isLoading: boolean
  isError: boolean
  hasNextPage: boolean
  fetchNextPage: () => Promise<unknown>
  threads?: Thread[]
}
export default function InfiniteThreadList({ threads, isError, isLoading, fetchNextPage }: InfiniteThreadListProps) {
  if(isLoading) return <div>Loading...</div>
  if(isError) return <div>Error</div>
  if(threads == null) return <div>threads is null</div>
  if(threads == null || threads?.length === 0) return (
    <h2 className='bg-gradient-to-r from-orange-500 via-indigo-500 to-green-500 text-transparent bg-clip-text'>No tweets</h2>
  )
  return (
    <ul>
      <InfiniteScroll
        dataLength={threads.length}
        next={fetchNextPage}
        hasMore={true}
        loader={<h4>Loading...</h4>}
        endMessage={
          <p style={{ textAlign: 'center' }}>
            <b>Yay! You have seen it all</b>
          </p>
      }>
        {threads.map(thread=>{
          return (
            <ThreadCard
              key={thread.id}
              {...thread}
            />
          )
        })}

      </InfiniteScroll>
    </ul>
  )
}

function ThreadCard({
  id, user, content, createdAt,
  likeCount, likedByMe
}: Thread) {
  return(
    <li className='flex gap-4 border-b px-4 py-4'>
      <Link href={`/profile/${user.id}`}>
        <ProfileImage src={user.image} />
      </Link>
      <div>
        <div>
          <Link 
            href={`/profile/${user.id}`}
            className='font-bold hover:via-teal-500 bg-gradient-to-tl from-slate-800 via-indigo-100 to-zinc-400 bg-clip-text text-transparent'
          >
            {user.name}
          </Link>
        </div>
      </div>
      {content}
    </li>
  ) 
    
}
