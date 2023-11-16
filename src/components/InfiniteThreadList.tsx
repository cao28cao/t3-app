import React from 'react'
import InfiniteScroll from 'react-infinite-scroll-component'
import ProfileImage from './ProfileImage';
import Link from 'next/link';
import { useSession } from 'next-auth/react';
import { VscHeart, VscHeartFilled } from 'react-icons/vsc';
import IconHoverEffect from './IconHoverEffect';
import { api } from '~/utils/api';
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

const dateTimeFormatter = new Intl.DateTimeFormat(undefined, {
  dateStyle: 'medium',
  timeStyle: 'short',
});

function ThreadCard({
  id, 
  user, 
  content, 
  createdAt,
  likeCount, 
  likedByMe
}: Thread) {
  const trpcUtils = api.useUtils();
  const toggleLike = api.thread.toggleLike.useMutation({ 
    onSuccess:async ({ addedLike }) =>
    {
      const updateData: Parameters<typeof trpcUtils.thread.infiniteFeed.setInfiniteData>[1] = (oldData) => {
        if(oldData == null) return
        const countModifier = addedLike ? 1 : -1
        return {
          ...oldData,
          pages: oldData.pages.map(page => {
            return {
              ...page,
              threads: page.threads.map(thread => {
                if(thread.id === id) {
                  return {
                    ...thread,
                    likedByMe: addedLike,
                    likeCount: thread.likeCount + countModifier
                  }
                }
                return thread
              })
            }
          })
        }
      }
      trpcUtils.thread.infiniteFeed.setInfiniteData({}, updateData);
  }});
  function handleToggleLike() {
    toggleLike.mutate({id});
  }
  return(
    <li className='flex gap-4 border-b px-4 py-4'>
      <Link href={`/profiles/${user.id}`}>
        <ProfileImage src={user.image} />
      </Link>
      <div className='flex flex-grow flex-col'>
        <div className='flex gap-1'>
          <Link 
            href={`/profile/${user.id}`}
            className='font-bold hover:via-teal-500 bg-gradient-to-tl from-slate-800 via-indigo-100 to-zinc-400 bg-clip-text text-transparent'
          >
            {user.name}
          </Link>
          <span>{dateTimeFormatter.format(new Date(createdAt))}</span>
        </div>
        <p className='whitespace-pre-wrap'>{content}</p>
        <HeartButton onClick={handleToggleLike} isLoading={toggleLike.isLoading} likedByMe={likedByMe} likeCount={likeCount}/>
      </div>
    </li>
  ) 
}
type HeartButtonProps = {
  onClick: () => void
  isLoading: boolean
  likedByMe: boolean
  likeCount: number
}

function HeartButton( { onClick, isLoading, likedByMe, likeCount }: HeartButtonProps) {
  const session = useSession();
  const HeartIcon = likedByMe ? VscHeartFilled : VscHeart;
  if(session.status !== 'authenticated') {
    return (
      <div className='mb-1 mt-1 flex items-center gap-3 self-start text-gray-500'>
        <HeartIcon/>
        <span>{likeCount}</span>
      </div>
    )
  }
  return (
    <button 
      disabled={isLoading}
      onClick = {onClick}
      className={`group items-center gap-1 self-start flex transition-colors duration-200 ${likedByMe ? 
    'text-red-500' : 
    'text-gray-500 hover:text-red-500 group-hover:text-red-500 group-focus:text-red-500'}`}
    >
      <IconHoverEffect red>
        <HeartIcon className={`transition-colors duration-200 
        ${likedByMe} ? 
        'fill-red-500' :
        'fill-gray-500 group-hover:fill-red-500 group-focus:fill-red-500'`}
        />
      </IconHoverEffect>
      <span>{likeCount}</span>
    </button>
  )
}
