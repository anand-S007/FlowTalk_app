
import { ShipWheelIcon } from "lucide-react";
import { useState } from "react"
import { Link } from "react-router";


const ForgotPage = () => {
    const { email, setEmail } = useState();
    const { errors, setErrors } = useState([]);
    // const { isPending, setIsPending } = useState(true);
    const isPending = true

    const handleInput = () => {

    }
    const handleSendOtp = () => {

    }
    const handleForgot = () => {

    }
    return (
        <div className='h-screen p-4 sm:p-6 md:p-8 flex items-center justify-center '>
            <div className='w-full mx-auto max-w-5xl border border-primary/25 
        flex flex-col lg:flex-row bg-base-100 rounded-xl overflow-hidden
        shadow-lg '
            >
                {/* FORGOT LEFT-SIDE */}
                <div className='w-full p-4 sm:p-8 flex flex-col'>

                    {/* LOGO */}
                    <div className='mb-4 flex items-center justify-start gap-2'>
                        <ShipWheelIcon className='size-9 text-primary' />
                        <span
                            className='text-3xl font-bold font-mono bg-clip-text text-transparent 
              bg-gradient-to-r from-primary to-secondary tracking-wider'>
                            FlowTalk
                        </span>
                    </div>

                    {/* FORGOT FORM */}
                    <div className='w-full'>
                        <form onSubmit={handleSendOtp}>

                            <div className='space-y-4'>
                                {/* FORM TITLE */}
                                <div>
                                    <h2 className='text-xl font-semibold'>Reset Your Password</h2>
                                    <p className='text-sm opacity-70 mx-w-md'>
                                        Reset your password to continue sign in
                                    </p>
                                </div>

                                {/* ERROR MESSAGE */}
                                {errors?.length > 0 && (
                                    <Alert variant='filled' severity="error">
                                        <ul className='list-disc list-inside'>
                                            {errors.map((err, index) => (
                                                <li key={index}>{err}</li>
                                            ))}
                                        </ul>
                                    </Alert>
                                )}

                                {/* FROM FIELDS */}
                                <div className='space-y-3 '>

                                    {/* EMAIL */}
                                    <div className='form-control w-full'>
                                        <label className='label'>
                                            <span className='label-text '>Enter Your Email</span>
                                        </label>
                                        <input
                                            type="email"
                                            name='email'
                                            placeholder='eg:- anand@gmail.com'
                                            value={email}
                                            onChange={handleInput}
                                            className='input input-bordered w-full'
                                        />
                                    </div>

                                    <button 
                                    className={`w-full btn btn-primary ${isPending ? ' btn-disabled' : 'btn-primary '}`} 
                                    type='submit'>
                                        {
                                            !isPending ? "Send OTP" :
                                                (
                                                    <>
                                                        <span className='loading loading-spinner loading-xs'></span>
                                                        Sending otp...
                                                    </>
                                                )
                                        }

                                    </button>

                                    {/* SIGNUP LINK */}
                                    <div className='text-center mt-4'>
                                        <p className='text-sm'>
                                            Don't have an account? {" "}
                                            <Link to={'/signup'} className='text-primary hover:underline'>
                                                Create one
                                            </Link>
                                        </p>
                                    </div>

                                </div>
                            </div>
                        </form>
                    </div>
                </div>

                {/* SIGNIN FORM - RIGHT SIDE */}
                <div className='hidden lg:flex w-full bg-primary/10 items-center justify-center'>
                    <div className='max-w-md p-8'>
                        {/* ILLUSTRATION */}
                        <div className='relative aspect-square max-w-sm mx-auto'>
                            <img
                                src="/flowtalk_illustratior_img.png"
                                alt="Illustrator image"
                            />
                        </div>

                        <div className='text-center space-y-3 mt-6'>
                            <h2 className='text-xl font-semibold'>Connect with language partners worldwide</h2>
                            <p className='opacity-70'>
                                Practice conversations, make friends, and improve your language skills together
                            </p>
                        </div>
                    </div>
                </div>

            </div>
        </div>
    )
}

export default ForgotPage