import { Toaster } from 'react-hot-toast'
import useSignoutUser from '../hooks/useSignoutUser'

const HomePage = () => {
  const {signoutUser}  = useSignoutUser()

  const handleSignout = async (e) => {
    e.preventDefault()
    try {
      signoutUser()
      
    } catch (error) {
      console.log(error);
    }
  }
  return (
    <div>
      HomePage <br />
      <Toaster/>

      <button onClick={handleSignout}>
        Sign out
      </button>
    </div>
  )
}

export default HomePage