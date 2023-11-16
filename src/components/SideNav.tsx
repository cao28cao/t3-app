import Link from "next/link";
import { signIn, signOut, useSession } from "next-auth/react";
import IconHoverEffect from "./IconHoverEffect";
import { VscHome, VscAccount, VscSignOut, VscSignIn } from "react-icons/vsc";
export default function SideNav() {
  const session = useSession();
  const user = session.data?.user;

  return (
    <nav className="sticky top-0 self-start px-2 py-4">
      <ul className="flex flex-col items-stretch gap-2 whitespace-nowrap">
        <li className="text-gray-500 hover:text-gray-900">
          <Link href="/">
            <IconHoverEffect>
              <span className="flex items-center gap-4">
                <VscHome className="h-8 w-8" />
                <span className="hidden text-lg md:inline">Home</span>
              </span>
            </IconHoverEffect>
          </Link>
        </li>

        {user != null && (
          <li className="text-gray-500 hover:text-gray-900">
            <Link href={`/profiles/${user.id}`}>
              <IconHoverEffect>
                <span className="flex items-center gap-4">
                  <VscAccount className="h-8 w-8 fill-green-700 text-green-700" />
                  <span className="hidden text-lg text-green-700 md:inline">
                    Profile
                  </span>
                </span>
              </IconHoverEffect>
            </Link>
          </li>
        )}
        {user == null ? (
          <li>
            <button onClick={(e) => signIn()}>
              <IconHoverEffect>
                <span className="flex items-center gap-4">
                  <VscSignIn className="h-8 w-8 fill-green-700 text-green-700" />
                  <span className="hidden text-lg text-green-700 md:inline">
                    Sign In
                  </span>
                </span>
              </IconHoverEffect>
            </button>
          </li>
        ) : (
          <li>
            <button onClick={(e) => signOut()}>
              <IconHoverEffect>
                <span className="flex items-center gap-4">
                  <VscSignOut className="h-8 w-8 fill-red-700 text-red-700" />
                  <span className="hidden text-lg text-red-700 md:inline">
                    Log Out
                  </span>
                </span>
              </IconHoverEffect>
            </button>
          </li>
        )}
      </ul>
    </nav>
  );
}
