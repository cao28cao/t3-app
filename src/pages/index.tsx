import { type NextPage } from "next";
import { useSession } from "next-auth/react";
import { useState } from "react";
import { NewThreadForm } from "~/components/NewThreadForm";
import InfiniteThreadList from "~/components/InfiniteThreadList";
import { api } from "~/utils/api";

const TABS = ["Recent", "Following"] as const;


const Home: NextPage = () => {
  const [selectedTab, setSelectedTab] =
    useState<(typeof TABS)[number]>("Recent");
  const session = useSession();
  return (
    <>
      <header className="sticky top-0 z-10 border-b pt-2 bg-gray-800">
        <h1 className="mb-2 px-4 text-lg font-bold">Home</h1>
        {session.status === "authenticated" && (
          <div className="flex">
            {TABS.map((tab) => {
              return (
                <button
                  key={tab}
                  className={`flex-grow p-2 hover:bg-gray-200 focus-visible:bg-gray-200 ${
                    tab === selectedTab
                      ? "border-b-4 border-b-blue-500 font-bold"
                      : ""
                  }`}
                  onClick={() => setSelectedTab(tab)}
                >
                  {tab}
                </button>
              );
            })}
          </div>
        )}
      </header>
      <NewThreadForm />
      {selectedTab === "Recent" ? <RecentThreads /> : <FollowingThreads />}
    </>
  );
};

function RecentThreads() {
  const threads = api.thread.infiniteFeed.useInfiniteQuery(
    {},
    { getNextPageParam: (lastPage) => lastPage.nextCursor }
  );

  const formattedThreads = threads.data?.pages.flatMap((page) =>
    page.threads.map((thread) => ({
      ...thread,
      createdAt: new Date(thread.createdAt),
    }))
  );
  // console log typeof createdAt
  return (
    // <>
    // <div>
    //   <InfiniteThreadList
    //     threads={formattedThreads}
    //     isError={threads.isError}
    //     isLoading={threads.isLoading}
    //     hasMore={threads.hasNextPage}
    //     fetchNewThreads={threads.fetchNextPage}
    //   />
    // </div>
    // </>

    <InfiniteThreadList
      threads={formattedThreads}
      isError={threads.isError}
      isLoading={threads.isLoading}
      hasMore={threads.hasNextPage}
      fetchNewThreads={threads.fetchNextPage}
    />
  );
}

function FollowingThreads() {
  const threads = api.thread.infiniteFeed.useInfiniteQuery(
    { onlyFollowing: true },
    { getNextPageParam: (lastPage) => lastPage.nextCursor }
  );

  const formattedThreads = threads.data?.pages.flatMap((page) =>
    page.threads.map((thread) => ({
      ...thread,
      createdAt: new Date(thread.createdAt),
    }))
  );

  return (
    <InfiniteThreadList
      threads={formattedThreads}
      isError={threads.isError}
      isLoading={threads.isLoading}
      hasMore={threads.hasNextPage}
      fetchNewThreads={threads.fetchNextPage}
    />
  );
}

export default Home;