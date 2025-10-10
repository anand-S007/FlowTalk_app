import { useEffect } from 'react';
import { useNavigate } from 'react-router';
import {
  StreamTheme,
  useCallStateHooks,
  CallingState,
  ParticipantView,
  CallControls,
} from '@stream-io/video-react-sdk';
import ChatLoader from './ChatLoader';

// MAIN CALL CONTENT
const VideoCallContent = () => {
  const { useCallCallingState, useLocalParticipant, useRemoteParticipants } = useCallStateHooks();

  const callingState = useCallCallingState();
  const localParticipant = useLocalParticipant();
  const remoteParticipants = useRemoteParticipants();

  const navigate = useNavigate();

  // USE useEffect FOR NAVIGATION SIDE EFFECTS
  useEffect(() => {
    if (callingState === CallingState.LEFT) {
      window.close();
    }
  }, [callingState, navigate]);

  if (callingState !== CallingState.JOINED) {
    return <ChatLoader connectMethod ='call' />;
  }

  return (
  <div className="flex justify-center items-center min-h-screen p-4">
    <StreamTheme>
      <div className="shadow-2xl rounded-3xl p-4 sm:p-6 md:p-8 w-full max-w-5xl h-[90vh] flex flex-col">
        
        {/* PARTICIPANTS SECTION */}
        <div className="flex-1 flex flex-col md:flex-row justify-center items-center gap-4 relative overflow-hidden">
          
          {/* REMOTE PARTICIPANTS */}
          <MyParticipantList 
            participants={remoteParticipants} 
            className="flex-1 w-full h-full"
          />

          {/* LOCAL PARTICIPANT - FLOATING */}
          <div className="absolute bottom-4 right-4 w-28 h-28 sm:w-32 sm:h-32 md:w-36 md:h-36 rounded-xl">
            <MyFloatingLocalParticipant participant={localParticipant} />
          </div>
        </div>

        {/* CONTROLS SECTION */}
        <div className="flex justify-center mt-4">
          <CallControls />
        </div>

      </div>
    </StreamTheme>
  </div>
);

};

// ---- PARTICIPANT LIST COMPONENT ----
export const MyParticipantList = ({ participants }) => {
    if (!participants || participants.length === 0) {
    return (
      <div className="flex justify-center items-center w-full h-64 text-gray-500 text-lg">
        NO PARTICIPANTS
      </div>
    );
  }
  return (
    <div style={{ display: 'flex', flexDirection: 'row', gap: '8px' }}>
      {
      participants.map((participant) => (
        <ParticipantView
          participant={participant}
          key={participant.sessionId}
        />
      ))}
    </div>
  );
};

// ---- FLOATING LOCAL PARTICIPANT ----
export const MyFloatingLocalParticipant = ({ participant }) => {
  return (
    <div className="absolute bottom-4 right-4 w-[200px] h-[150px] rounded-lg overflow-hidden">
      <ParticipantView participant={participant} />
    </div>
  );
};

export default VideoCallContent;
