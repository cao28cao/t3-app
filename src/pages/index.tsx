import { type NextPage } from "next";
import NewThreadForm from "~/components/NewThreadForm";
import InfiniteThreadList from "~/components/InfiniteThreadList";
import { api } from "~/utils/api";
export default function Home() {

  return (
    <>
      <header className="sticky top-0 z-10 border-b bg-white pt-2">
        <h1 className="mb-2 px-4 text-lg font-bold">Home</h1>
      </header>
      <NewThreadForm />
      <RecentThreads />
    </>
  );
};

function RecentThreads() {
  const threads = api.thread.infiniteFeed.useInfiniteQuery(
    {},
    { getNextPageParam: (lastPage) => lastPage.nextCursor}
  );
  return <InfiniteThreadList 
    threads = {threads.data?.pages.flatMap((page) => page.threads)}
    isError = {threads.isError}
    isLoading = {threads.isLoading}
    hasNextPage = {threads.hasNextPage}
    fetchNextPage = {threads.fetchNextPage}
  />;
}
