import { useEffect, useState } from 'react'
import { useParams } from 'react-router'
import {
  StreamCall,
  StreamVideo,
  StreamVideoClient,
} from '@stream-io/video-react-sdk';

import '@stream-io/video-react-sdk/dist/css/styles.css';
import toast from 'react-hot-toast';

import useAuthUser from '../hooks/useAuthUser';
import { useStreamToken } from '../hooks/useUserFriends';
import PageLoader from '../components/PageLoader.jsx'
import VideoCallContent from '../components/VideoCallContent.jsx';

const STREAM_API_KEY = import.meta.env.VITE_STREAM_API_KEY
const CallPage = () => {
  const { id: callId } = useParams()

  const [client, setClient] = useState(null);
  const [call, setCall] = useState(null);
  const [isConnecting, setIsConnecting] = useState(true);

  const { authUser, isLoading } = useAuthUser();

  const { data: tokenData } = useStreamToken(authUser);


  useEffect(() => {
    if (!tokenData?.token || !authUser || !callId) return
    
    const initCall = async () => {
      try {
        console.log('Initializing stream chat client');

        const user = {
          id: authUser._id,
          name: authUser.fullname,
          image: authUser.profilePic,
        };

        const videoClient = new StreamVideoClient({
          apiKey: STREAM_API_KEY,
          user,
          token: tokenData.token
        });

        const callInstance = videoClient.call('default', callId);

        await callInstance.join({ create: true });
        console.log('Joined call successfully');

        setClient(videoClient);
        setCall(callInstance);
      } catch (error) {
        console.log('Error while joining calls: ', error);
        toast.error('Could not join the call, please try again.');
      } finally {
        setIsConnecting(false)
      }
    };

    initCall()

  }, [tokenData, authUser, callId])
  console.log(client);

  if (isLoading || isConnecting) return <PageLoader />

  return (
    <div className="h-screen flex flex-col items-center justify-center">
      <div className='relative'>
        {client && call ? (
          <StreamVideo client={client}>
            <StreamCall call={call}>
              <div className='w-90% h-screen'>
                <VideoCallContent />
              </div>
            </StreamCall>
          </StreamVideo>
        ) : (
          <div className='h-full flex items-center justify-center'>
            <p>Could not connect call, please refresh or try again later.</p>
          </div>
        )}
      </div>
    </div>
  )
}

export default CallPage