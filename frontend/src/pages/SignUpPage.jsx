import { useState } from 'react'
import { Link } from 'react-router';
import Alert from '@mui/material/Alert';
import { ShipWheel } from 'lucide-react';

import useSignupUser from '../hooks/useSignupUser';
import { emailValidate, nameValidate, passwordValidate } from '../validations/userValidations';


const SignupPage = () => {

  // FORM STATE
  const [signupData, setSignupData] = useState({
    fullname: "",
    email: "",
    gender: "",
    password: "",
  });

  // ERROR STATE
  const [errors, setErrors] = useState([]);

  // SIGNUP MUTATION
  const { userSignupAsync, isPending } = useSignupUser();

  // HANDLE INPUT CHANGES
  const handleInput = (e) => {
    const { name, value } = e.target;

    setSignupData((prev) => ({ ...prev, [name]: value }));
    setErrors([]); // RESET ERRORS
  };

  // Validate form
  const validateForm = () => {
    const validationErrors = [];

    const nameValidation = nameValidate(signupData.fullname);
    if (nameValidation.error) validationErrors.push(...nameValidation.message);

    const emailValidation = emailValidate(signupData.email);
    if (emailValidation.error) validationErrors.push(...emailValidation.message);

    const passwordValidation = passwordValidate(signupData.password);
    if (passwordValidation.error) validationErrors.push(...passwordValidation.message);

    return validationErrors;
  };

  // HANDLE FORM SUBMISSION
  const handleSignup = async (e) => {
    e.preventDefault();

    const validationErrors = validateForm();
    if (validationErrors.length > 0) {
      setErrors(validationErrors);
      return;
    }

    try {
      await userSignupAsync(signupData);
    } catch (err) {
      const serverError = err?.response?.data;

      if (Array.isArray(serverError)) {
        setErrors(serverError);
      } else if (serverError?.message) {
        setErrors([serverError.message]);
      } else {
        setErrors(["Something went wrong. Please try again."]);
      }

      console.error("server error = ", serverError);
    }
  };


  return (
    <div
      className="h-screen flex items-center justify-center p-4 sm:p-6 md:p-8 overflow-scroll"
      data-theme="forest"
    >
      <div
        className="border border-primary/25 flex flex-col lg:flex-row 
                 w-full max-w-5xl mx-auto bg-base-100 rounded-xl 
                 shadow-lg "
      >
        {/* SIGNUP FORM - LEFT SIDE */}
        <div className="w-full lg:w-1/2 p-4 sm:p-8 flex flex-col">

          {/* LOGO */}
          <div className="mb-4 flex items-center justify-start gap-2">
            <ShipWheel className="size-9 text-primary" />

            <span
              className="text-3xl font-bold font-mono bg-clip-text 
                       text-transparent bg-gradient-to-r 
                       from-primary to-secondary tracking-wider"
            >
              FlowTalk
            </span>
          </div>

          {/* ERROR MESSAGE */}
          {errors.length > 0 && (
            <Alert className='z-10' variant='filled' severity="error">
              <ul className='list-disc list-inside'>
                {errors.map((err, index) => (
                  <li key={index}>{err}</li>
                ))}
              </ul>
            </Alert>
          )}

          <div className='w-full'>
            <form onSubmit={handleSignup}>

              <div className='space-y-4'>
                {/* FORM TITLE */}
                <div>
                  <h2 className='text-xl font-semibold'>Create an Account</h2>
                  <p className='text-sm opacity-70'>
                    Join FlowTalk and language learning adventure
                  </p>
                </div>

                <div className='space-y-3'>

                  {/* FULL NAME */}
                  <div className='form-control w-full'>
                    <label htmlFor="" className='label'>
                      <span className='label-text'>Full Name</span>
                    </label>
                    <input type="text"
                      name='fullname'
                      placeholder='eg:- Anand S'
                      className='input input-bordered w-full'
                      value={signupData.fullname}
                      onChange={handleInput}
                    />
                  </div>
                  {/* EMAIL */}
                  <div className='form-control w-full'>
                    <label htmlFor="" className='label'>
                      <span className='label-text'>Email</span>
                    </label>
                    <input
                      type="email"
                      name='email'
                      placeholder='eg:- anand@gmail.com'
                      className='input input-bordered w-full'
                      value={signupData.email}
                      onChange={handleInput}
                    />
                  </div>

                  {/* GENDER */}
                  <div className='form-control w-full'>
                    <label htmlFor="" className='label'>
                      <span className='label-text'>Gender</span>
                    </label>

                    <div className="flex flex-row items-center space-x-6">
                      {/* Male option */}
                      <label className="flex items-center space-x-2 cursor-pointer">
                        <input
                          type="radio"
                          name="gender"
                          value="male"
                          className="radio radio-sm"
                          onChange={handleInput}
                        />
                        <span>Male</span>
                      </label>

                      {/* Female option */}
                      <label className="flex items-center space-x-2 cursor-pointer">
                        <input
                          type="radio"
                          name="gender"
                          value="female"
                          className="radio radio-sm"
                          onChange={handleInput}

                        />
                        <span>Female</span>
                      </label>
                    </div>

                  </div>

                  {/* PASSWORD */}
                  <div className='form-control w-full'>
                    <label htmlFor="" className='label'>
                      <span className='label-text'>Password</span>
                    </label>
                    <input
                      type="password"
                      name='password'
                      placeholder='eg:- Anand@123'
                      className='input input-bordered w-full'
                      value={signupData.password}
                      onChange={handleInput}

                    />
                  </div>

                  {/* TERMS AND CONDITIONS */}
                  <div className='form-control'>
                    <label className='label cursor-pointer justify-start gap-2'>
                      <input type="checkbox"
                        className='checkbox checkbox-sm' />
                      <span className='text-xs leading-tight'>
                        I agree to the {" "}
                        <span className='text-primary hover:underline'>terms of service</span> and{" "}
                        <span className='text-primary hover:underline'>privacy policy</span>
                      </span>
                    </label>
                  </div>

                  {/* BUTTON CREATE ACCOUNT */}
                  <button className='btn btn-primary w-full' type='submit'>
                    {isPending ? (
                      <>
                        <span className='loading loading-spinner loading-xs'></span>
                        Loading...
                      </>
                    ) : (
                      "Create Account"
                    )}
                  </button>

                  {/* NAVIGATE TO LOGIN PAGE */}
                  <div className='text-center mt-4'>
                    <p className='text-sm'>
                      Already have an Account?{" "}
                      <Link to="/signin" className="text-primary hover:underline" >
                        Sign in
                      </Link>
                    </p>
                  </div>
                </div>
              </div>

            </form>
          </div>

        </div>

        {/* SIGNUP FORM - RIGHT SIDE */}
        <div className='hidden lg:flex w-full lg:w-1/2 bg-primary/10 items-center justify-center'>
          <div className='max-w-md p-8'>
            {/* ILLUSTRATION */}
            <div className='relative aspect-square max-w-sm mx-auto'>
              <img src="/flowtalk_illustratior_img.png" alt="Illustrator image" />
            </div>

            <div className='text-center space-y-3 mt-6'>
              <h2 className='text-xl font-semibold'>Connect with langugae partners worldwide</h2>
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

export default SignupPage