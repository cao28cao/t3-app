import { useSession } from 'next-auth/react';
import { api } from "~/utils/api";
import { Button } from "./Button";
// import { Button } from '@chakra-ui/react'
import ProfileImage  from "./ProfileImage";
import { 
    useState,
    useRef, 
    useEffect, 
    useLayoutEffect,
    useCallback, 
    FormEvent} from 'react';

function updateTextAreaSize(textArea?: HTMLTextAreaElement) {
    if(textArea == null) return
    textArea.style.height = '0'
    textArea.style.height = `${textArea.scrollHeight}px`
}


function Form() {
    const session = useSession(); 
    const [inputValue, setInputValue] = useState(''); 
    const textAreaRef = useRef<HTMLTextAreaElement>();
    const trpcUtils = api.useUtils();


    const inputRef = useCallback((textArea: HTMLTextAreaElement) => {
        updateTextAreaSize(textArea);
        textAreaRef.current = textArea;
    }, [])

    useLayoutEffect(() => {
        updateTextAreaSize(textAreaRef.current)
        console.log(textAreaRef.current)
    }, [inputValue])

    const createThread = api.thread.create.useMutation({
        onSuccess: (newThread) => {
            console.log(newThread);
            setInputValue('');

            if(session.status !== 'authenticated') {
                return
            }
            
            trpcUtils.thread.infiniteFeed.setInfiniteData({}, (oldData) => {
                if(oldData == null || oldData.pages[0] == null) return;
                
                const newCacheThread = {
                    ...newThread,
                    likeCount: 0,
                    likedByMe: false,
                    user: {
                        id: session.data.user.id,
                        name: session.data.user.name || null,
                        image: session.data.user.image || null,
                    },
                };

                return {
                    ...oldData,
                    pages: [
                        {
                            ...oldData.pages[0],
                            threads: [
                                newCacheThread,
                                ...oldData.pages[0].threads,
                            ],
                        },
                        ...oldData.pages.slice(1),
                    ],
                };
            });
        }
    });

    function handleSubmit(e: FormEvent) {
        e.preventDefault();
        createThread.mutate({
            content: inputValue,
        })
    }

    if(session.status !== 'authenticated') return;

    return (
        <form
            onSubmit = {handleSubmit} 
            className='flex flex-col g2 border-b px-4 py-2'
        >
            <div className='flex gap-4'>
                <ProfileImage src={session.data.user.image}/>
                <textarea
                    style={{height: 0}}
                    value={inputValue}
                    ref={inputRef}
                    onChange = {(e) => {setInputValue(e.target.value)}} 
                    className='flex-grow resize-none overflow-hidden p-4 text-lg outline-none' 
                    placeholder='What is on your mind?'
                />
            </div>
            <Button 
                className='self-end transition-colors duration-200 hover:bg-[conic-gradient(at_bottom_right,_var(--tw-gradient-stops))] hover:from-blue-700 hover:via-blue-800 hover:to-gray-900'
            >
                Post
            </Button>
        </form>
    )
}

export default function NewThreadForm() {
    const session = useSession();
    if(session.status !== 'authenticated') return null;
    return <Form/>
}
