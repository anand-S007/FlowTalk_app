import { useEffect, useState } from 'react'
import { useParams } from 'react-router'
import { StreamChat } from 'stream-chat'
import { Channel, Chat, ChannelHeader, MessageList, MessageInput, Window } from 'stream-chat-react'
import toast from 'react-hot-toast';
import 'stream-chat-react/dist/css/v2/index.css';
import '../styles/streamChat.css'

import useAuthUser from '../hooks/useAuthUser';
import { useStreamToken } from '../hooks/useUserFriends';
import ChatLoader from '../components/ChatLoader';
import VideoCallButton from '../components/VideoCallButton';

const STREAM_API_KEY = import.meta.env.VITE_STREAM_API_KEY

const ChatPage = () => {
  const { id: chatReceiverId } = useParams();

  const [chatClient, setChatClient] = useState(null);
  const [channel, setChannel] = useState(null);
  const [loading, setLoading] = useState(true);

  const { authUser } = useAuthUser();
  const { data: tokenData } = useStreamToken(authUser);


  useEffect(() => {
    if (!authUser || !tokenData?.token) return; 

    console.log(new StreamChat(STREAM_API_KEY));
    
    const client = new StreamChat(STREAM_API_KEY);

    const initChat = async () => {
      try {
        console.log('Initializing Stream Chat client...');

        await client.connectUser(
          {
            id: authUser._id,
            name: authUser.fullname || 'Unknown User',
            image: authUser.profilePic || 'https://i.ibb.co/4f4LQH5/default-avatar.png'
          },
          tokenData.token
        );


        const channelId = [authUser._id, chatReceiverId].sort().join('-');
        const currChannel = client.channel('messaging', channelId, {
          members: [authUser._id, chatReceiverId]
        });

        await currChannel.watch();

        setChatClient(client);
        setChannel(currChannel);
        setLoading(false);

      } catch (error) {
        console.error("Error while initializing chat", error);
        toast.error("Could not connect to chat, try again.");
      }
    };

    initChat();

    return () => {
      if (client) client.disconnectUser();
    };
  }, [authUser, tokenData, chatReceiverId]);

  // HANDLE VIDEO CALL
  const handleVideoCall = () => {
    if(channel) {
      const callUrl = `${window.location.origin}/call/${channel.id}`;
      channel.sendMessage({
        text: `I've started a video call. Join me here: ${callUrl}`
      });
      toast.success('Video call link sent successfully!')
    }
      
  }


  if (loading || !chatClient || !channel) return <ChatLoader connectMethod='chat' />


  return (
    <div className='h-[92vh]'>
      <Chat client={chatClient}>
        <Channel channel={channel}>
          <div className='w-full relative'>
            <VideoCallButton handleVideoCall={handleVideoCall}/>
            <Window>
              <ChannelHeader />
              <MessageList />
              <MessageInput focus />
            </Window>
          </div>
        </Channel>
      </Chat>
    </div>
  );

}

export default ChatPage

