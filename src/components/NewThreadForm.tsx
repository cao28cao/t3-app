import { useSession } from 'next-auth/react';
import { api } from "~/utils/api";
// import { Button } from "./Button";
import { Button } from '@chakra-ui/react'
import ProfileImage  from "./ProfileImage";
import { 
    useState,
    useRef, 
    useEffect, 
    useLayoutEffect,
    useCallback } from 'react';

function updateTextAreaSize(textArea?: HTMLTextAreaElement) {
    if(textArea == null) return
    textArea.style.height = '0'
    textArea.style.height = `${textArea.scrollHeight}px`
}

export default function NewThreadForm() {
    const session = useSession(); 
    const [inputValue, setInputValue] = useState(''); 
    const textAreaRef = useRef<HTMLTextAreaElement>();

    const inputRef = useCallback((textArea: HTMLTextAreaElement) => {
        updateTextAreaSize(textArea);
        textAreaRef.current = textArea;
    }, [])

    useLayoutEffect(() => {
        updateTextAreaSize(textAreaRef.current)
        console.log(textAreaRef.current)
    }, [inputValue])

    if(session.status !== 'authenticated') return;

    return (
        <form className='flex flex-col g2 border-b px-4 py-2'>
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
                colorScheme='linkedin'
                variant={'solid'}
                className='self-end'
            >
                Post
            </Button>
        </form>
    )
}
