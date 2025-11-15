import { Link } from 'react-router';
import Alert from '@mui/material/Alert';
import { ShipWheelIcon } from 'lucide-react';

import useSigninUser from '../hooks/useSigninUser.js';
import { emailValidate, passwordValidate } from '../validations/userValidations.js';
import { useState } from 'react';

const SignInPage = () => {
  // HOOKS
  const [formState, setFormState] = useState({
    email: '',
    password: ""
  });
  const [errors, setErrors] = useState([]);

  // HANDLE INPUT FIELD
  const handleInput = (e) => {
    const { name, value } = e.target
    setFormState((prev) => ({ ...prev, [name]: value }))

    setErrors([]); // RESET ERROR
  }

  // FORM VALIDATION
  const validateForm = () => {
    const validationErrors = [];

    // Email validation
    const validatedEmail = emailValidate(formState.email);
    if (validatedEmail.error) validationErrors.push(...validatedEmail.message);

    // Password validation
    const validatedPassword = passwordValidate(formState.password);
    if (validatedPassword.error) validationErrors.push(...validatedPassword.message);

    return validationErrors;
  };

  // SIGNIN MUTATION
  const { signinUserAsync, isPending, } = useSigninUser();

  // FORM SUBMITION
  const handleSignin = async (e) => {
    e.preventDefault();

    const validationErrors = validateForm();

    if (validationErrors.length > 0) {
      setErrors(validationErrors); // display errors
      return;
    }

    // Clear errors and proceed with signin
    setErrors([]);
    try {
      await signinUserAsync(formState);

    } catch (error) {
      console.log(error.response);
      setErrors([error.response.data.message]);
    }


  };

  return (
    <div className='h-screen p-4 sm:p-6 md:p-8 flex items-center justify-center '>
      <div className='w-full mx-auto max-w-5xl border border-primary/25 
        flex flex-col lg:flex-row bg-base-100 rounded-xl overflow-hidden
        shadow-lg '
      >
        {/* SIGININ LEFT-SIDE */}
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

          {/* SIGNIN FORM */}
          <div className='w-full'>
            <form onSubmit={handleSignin}>

              <div className='space-y-4'>
                {/* FORM TITLE */}
                <div>
                  <h2 className='text-xl font-semibold'>Welcome Back</h2>
                  <p className='text-sm opacity-70 mx-w-md'>
                    Sign in to your account to continue your languge journey
                  </p>
                </div>

                {/* ERROR MESSAGE */}
                {errors.length > 0 && (
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
                      <span className='label-text '>Email</span>
                    </label>
                    <input
                      type="email"
                      name='email'
                      placeholder='eg:- anand@gmail.com'
                      value={formState.email}
                      onChange={handleInput}
                      className='input input-bordered w-full'
                    />
                  </div>

                  {/* PASSWORD */}
                  <div className='form-control w-full'>
                    <label className='label'>
                      <span className='label-text '>Password</span>
                    </label>
                    <input
                      type="password"
                      name='password'
                      placeholder='eg:- Anand@123'
                      value={formState.password}
                      onChange={handleInput}
                      className='input input-bordered w-full'
                    />
                  </div>

                  <button className='w-full btn btn-primary' type='submit'>
                    {
                      !isPending ? "Sign In" :
                        (
                          <>
                            <span className='loading loading-spinner loading-xs'></span>
                            Signing in...
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

                  {/* FORGOT PASSWORD */}
                  <div className='text-center mt-3'>
                    <p className='text-sm'>
                      I forgot my password. {" "}
                      <Link to={'/forgot_password'} className='text-primary hover:underline'>
                        Reset password
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

export default SignInPage