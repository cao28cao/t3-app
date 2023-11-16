import React from 'react'
import { CircularProgress } from '@chakra-ui/react'
import { Progress } from '@chakra-ui/react'

type LoadingSpinnerProps = {
    big?: boolean;
}

export function LoadingSpinner({ big = false } : LoadingSpinnerProps) {
    return (
        <>
            <div className='flex justify-center p-2'>
                <CircularProgress 
                    isIndeterminate 
                    color='blue.500'
                    size={big ? '24' : '16'}
                />
            </div>
        </>
    )
}
