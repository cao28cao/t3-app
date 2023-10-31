import Link from 'next/link'
import { signIn, signOut, useSession } from 'next-auth/react';
export default function SideNav() {

    const session = useSession();
    const user = session.data?.user;

    return (
        <nav className='sticky top-0 self-start px-2 py-4'>
            <ul className='flex flex-col items-stretch gap-2 whitespace-nowrap'>
                <li className='text-gray-500 hover:text-gray-900'>
                    <Link href='/'>Home</Link>
                </li>
                
                {user != null && (
                    <li className='text-gray-500 hover:text-gray-900'>
                        <Link href={`/profiles/${user.id}`}>Users</Link>
                    </li>
                )}
                {user == null ? (
                    <li>
                        <button onClick={void signIn}>Log In</button>
                    </li>
                ) : (
                    <li>
                        <button onClick={void signOut}>Log Out</button>
                    </li>
                )}
            </ul>
        </nav>
    )
}
