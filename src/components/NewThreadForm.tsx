import { useSession } from "next-auth/react";
import { api } from "~/utils/api";
import { Button } from "./Button";
import ProfileImage from "./ProfileImage";
import {
  useState,
  useRef,
  useLayoutEffect,
  useCallback,
  FormEvent,
} from "react";
import { User } from "lucide-react";

function updateTextAreaSize(textArea?: HTMLTextAreaElement) {
  if (textArea == null) return;
  textArea.style.height = "0";
  textArea.style.height = `${textArea.scrollHeight}px`;
}

function Form() {
  const session = useSession();
  const [inputValue, setInputValue] = useState("");
  const textAreaRef = useRef<HTMLTextAreaElement>();
  const trpcUtils = api.useUtils();

  const inputRef = useCallback((textArea: HTMLTextAreaElement) => {
    updateTextAreaSize(textArea);
    textAreaRef.current = textArea;
  }, []);

  useLayoutEffect(() => {
    updateTextAreaSize(textAreaRef.current);
    console.log(textAreaRef.current);
  }, [inputValue]);

  const createThread = api.thread.create.useMutation({
    onSuccess: (newThread) => {
      setInputValue("");

      if (session.status !== "authenticated") {
        return;
      }

      trpcUtils.thread.infiniteFeed.setInfiniteData({}, (oldData) => {
        if (!oldData?.pages?.[0]) return;

        const newCacheThread = {
          ...newThread,
          likeCount: 0,
          likedByMe: false,
          user: {
            id: session.data.user.id,
            name: session.data.user.name ?? null,
            image: session.data.user.image ?? null,
          },
        };

        return {
          ...oldData,
          pages: [
            {
              ...oldData.pages[0],
              threads: [newCacheThread, ...oldData.pages?.[0].threads],
            },
            ...oldData.pages?.slice(1),
          ],
        };
      });
    },
  });

  function handleSubmit(e: FormEvent) {
    e.preventDefault();
    createThread.mutate({
      content: inputValue,
    });
  }

  if (session.status !== "authenticated") return;

  return (
    <form
      onSubmit={handleSubmit}
      className="g2 flex flex-col border-b px-4 py-2"
    >
      <div className="flex gap-4">
        <ProfileImage name={session.data.user.name ?? null}/>
        <textarea
          style={{ height: 0 }}
          value={inputValue}
          ref={inputRef}
          onChange={(e) => {
            setInputValue(e.target.value);
          }}
          className="flex-grow resize-none overflow-hidden p-4 text-lg outline-none mb-2 rounded-full bg-inherit"
          placeholder="What's on your mind?"
        />
      </div>
      <Button className="self-end transition-colors duration-200 hover:bg-[conic-gradient(at_bottom_right,_var(--tw-gradient-stops))] hover:from-blue-700 hover:via-blue-800 hover:to-gray-900">
        Post
      </Button>
    </form>
  );
}

export function NewThreadForm() {
  const session = useSession();
  if (session.status !== "authenticated") return null;
  return <Form />;
}
