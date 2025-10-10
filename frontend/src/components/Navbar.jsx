import React from 'react'
import useAuthUser from '../hooks/useAuthUser'
import { Link, useLocation } from 'react-router';
import { BellIcon, LogOutIcon, ShipWheelIcon } from 'lucide-react';
import ThemeSelector from './ThemeSelector';
import useSignoutUser from '../hooks/useSignoutUser';


const Navbar = () => {
    const { authUser } = useAuthUser();
    const location = useLocation()
    const isChatPage = location.pathname?.startsWith('/chat');

    const { signoutUser } = useSignoutUser()

    const handleSignout = async (e) => {
        e.preventDefault()
        try {
            signoutUser()

        } catch (error) {
            console.log(error);
        }
    }

    return (
        <nav className='bg-base-200 border-b border-base-300 
        sticky top-0 z-30 h-16 flex items-center'>
            <div className='container mx-auto px-4 sm:p-6 lg:px-8'>
                <div className='flex items-center justify-end'>
                    {/* LOGO - ONLY IN CHAT PAGE */}
                    {isChatPage && (
                        <div className='pl-5'>
                            <Link to='/' className="flex items-center gap-2.5">
                                <ShipWheelIcon className='size-9 text-primary' />
                                <span className='text-3xl font-bold font-mono 
                                bg-clip-text text-transparent bg-gradient-to-r 
                                from-primary to-secondary tracking-wider'>
                                    FlowTalk
                                </span>
                            </Link>
                        </div>
                    )}

                    <div className='flex items-center gap-3 sm:gap-4 ml-auto'>
                        <Link to='/notifications'
                            className={`btn btn-ghost btn-circle`}>
                            <BellIcon className='size-6 text-base-content opacity-70' />
                        </Link>
                    </div>

                    {/* TODO */}
                    <ThemeSelector />

                    <div className='avatar'>
                        <div className='w-9 rounded-full'>
                            <img src={authUser?.profilePic} alt="User avatar" rel='noreferrer' />
                        </div>
                    </div>

                    <button className='btn btn-ghost btn-circle' onClick={handleSignout}>
                        <LogOutIcon className='size-6 text-base-content opacity-70' />
                    </button>
                </div>
            </div>
        </nav>
    )
}

export default Navbar