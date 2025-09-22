import React from 'react'

import toast, {Toaster} from 'react-hot-toast'

const HomePage = () => {
  return (
    <div>
      HomePage <br />
      <Toaster/>
      <button onClick={() => {toast.success("Welcome to home page")}}>clicke me</button>
    </div>
  )
}

export default HomePage