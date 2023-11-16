import {
  GetStaticPaths,
  GetStaticPropsContext,
  InferGetStaticPropsType,
  NextPage,
} from "next";
import Head from "next/head";
import Link from "next/link";
import ErrorPage from "next/error";

import { ssgHelper } from "~/server/api/ssgHelper";
import { api } from "~/utils/api";
import { useSession } from "next-auth/react";

import { Button } from "~/components/Button";
import IconHoverEffect from "~/components/IconHoverEffect";
import ProfileImage from "~/components/ProfileImage";
import InfiniteThreadList from "~/components/InfiniteThreadList";

import { RxArrowLeft } from "react-icons/rx";

const ProfilePage: NextPage<InferGetStaticPropsType<typeof getStaticProps>> = ({
  id,
}) => {
  const { data: profile } = api.profile.getById.useQuery({ id });
  const threads = api.thread.infiniteProfileFeed.useInfiniteQuery(
    { userId: id },
    { getNextPageParam: (lastPage) => lastPage.nextCursor },
  );
  const trpcUtils = api.useUtils();
  const toggleFollow = api.profile.toggleFollow.useMutation({
    onSuccess: ({ addedFollow }) => {
      trpcUtils.profile.getById.setData({ id }, (oldData) => {
        if (oldData == null) return oldData;
        return {
          ...oldData,
          isFollowing: addedFollow,
          followersCount: oldData.followersCount + (addedFollow ? 1 : -1),
        };
      });
    },
  });

  if (profile == null || profile.name == null)
    return <ErrorPage statusCode={404} />;

  return (
    <>
      <Head>
        <title>{`Thread Clone ${profile.name}`}</title>
      </Head>
      <header className="sticky top-0 z-10 flex items-center border-b bg-white px-4 py-2">
        <Link href=".." className="mr-2">
          <IconHoverEffect>
            <RxArrowLeft className="h-6 w-6" />
          </IconHoverEffect>
        </Link>
        <ProfileImage src={profile.image} className={`mr-2 flex-shrink-0`} />
        <div className="ml-2 flex-grow">
          <h1 className="text-lg font-bold">{profile.name}</h1>
          <div className="text-gray-500">
            {profile.threadsCount}{" "}
            {getPlural(profile.threadsCount, "Thread", "Threads")} -{" "}
            {profile.followersCount}{" "}
            {getPlural(profile.followersCount, "Follower", "Followers")} -{" "}
            {profile.followsCount} Following
          </div>
        </div>
        <FollowButton
          isFollowing={profile.isFollowing}
          isLoading={toggleFollow.isLoading}
          userId={id}
          onClick={() => toggleFollow.mutate({ userId: id })}
        />
      </header>
      <main>
        <InfiniteThreadList
          threads={threads.data?.pages.flatMap((page) => page.threads)}
          isError={threads.isError}
          isLoading={threads.isLoading}
          hasMore={threads.hasNextPage}
          fetchNewThreads={threads.fetchNextPage}
        />
      </main>
    </>
  );
};

function FollowButton({
  isFollowing,
  isLoading,
  userId,
  onClick,
}: {
  isFollowing: boolean;
  isLoading: boolean;
  userId: string;
  onClick: () => void;
}) {
  const session = useSession();
  if (session.status !== "authenticated" || session.data.user.id === userId) {
    return null;
  }
  return (
    <Button
      disabled={isLoading}
      onClick={onClick}
      small
      gray={isFollowing}
      className={`rounded-full px-4 py-2 font-bold text-white ${
        isFollowing ? "bg-blue-500" : "bg-blue-400"
      }`}
    >
      {isFollowing ? "Unfollow" : "Follow"}
    </Button>
  );
}

const pluralRules = new Intl.PluralRules("en", { type: "ordinal" });
function getPlural(number: number, singular: string, plural: string) {
  return pluralRules.select(number) === "one" ? singular : plural;
}

export const getStaticPaths: GetStaticPaths = () => {
  return {
    paths: [],
    fallback: "blocking",
  };
};

export async function getStaticProps(
  context: GetStaticPropsContext<{ id: string }>,
) {
  const id = context.params?.id;
  if (id == null) {
    return {
      redirect: {
        destination: "/",
      },
    };
  }

  const ssg = ssgHelper();
  await ssg.profile.getById.prefetch({ id });

  return {
    props: {
      trpcState: ssg.dehydrate(),
      id,
    },
  };
}

export default ProfilePage;
