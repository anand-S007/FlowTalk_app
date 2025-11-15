import { useEffect, useMemo, useState } from 'react'
import { Link } from 'react-router'
import { CheckCircleIcon, Funnel, FunnelIcon, FunnelX, MapPinIcon, TimerResetIcon, UserPlusIcon, UsersIcon } from 'lucide-react'
import { useAcceptFriendReqs, useGetFriendReqs, useGetFriends, useGetOutgoingFriendReqs, useGetRecommendedUsers, useRejectFriendReqs, useSendFriendReqs } from '../hooks/useUserFriends'
import FriendCard, { getLanguageFlag } from '../components/FriendCard'
import NoFriendsFound from '../components/NoFriendsFound'
import { capitalize } from '../lib/utils'
import useAuthUser from '../hooks/useAuthUser'

const HomePage = () => {

  // LOCAL STATES
  const [outgoingRequestsIds, setOutgoingRequestsIds] = useState(new Set());  // STATE FOR OUTGOING FRIEND REQUEST
  const [friends, setFriends] = useState([]);
  const [recommendedUsers, setRecommendedUser] = useState([]);
  const [filteredUsers, setFilterdUsers] = useState([])
  const [filter, setFilter] = useState(null);

  // QUERIES
  const { data: friendsData, isLoading: loadingFriends } = useGetFriends();                       // GET FRIENDS DATA
  const { data: friendRequests } = useGetFriendReqs();                                            // GET INCOMING REQUESTS
  const { data: recommendedUsersData, isLoading: loadingUsers } = useGetRecommendedUsers();       // GET RECOMMENDED USERS
  const { data: outGoingFriendReqs } = useGetOutgoingFriendReqs();                                // GET OUTGOING FRIEND REQUESTS

  const { authUser } = useAuthUser();

  // MUTATION
  const { mutate: sendReqMutations, isPending } = useSendFriendReqs();                            // SEND FRIEND REQUEST MUTATION
  const { mutate: acceptRequestMutation, isPending: isAcceptPending } = useAcceptFriendReqs();    // ACCEPT FRIEND REQUEST
  const { mutate: rejectRequestMutation, isPending: isRejectionPending } = useRejectFriendReqs(); // REJECT FRIEND REQUEST

  const incomingRequestsMap = useMemo(() => {
    const incomingFriendReqs = friendRequests?.incomingRequest || [];
    return new Map(incomingFriendReqs.map(req => [req.sender._id, req._id]));
  }, [friendRequests]);

  // SET FRIENDS AND RECOMMENDED USERS STATE
  useEffect(() => {
    setFriends(friendsData ? friendsData.friends : []);
  }, [friendsData,]);

  useEffect(() => {
    if (filteredUsers.length > 0) {
      setRecommendedUser(filteredUsers);
    } else {
      setRecommendedUser(recommendedUsersData?.recommendedUsers || []);
    }
  }, [recommendedUsersData, filteredUsers]);

  // UPDATING OUTGOING REQUEST ID STATE
  useEffect(() => {
    const outgoingIds = new Set(
      outGoingFriendReqs?.outGoingFriendRequests?.map(req => req.recipient) || []
    );
    setOutgoingRequestsIds(outgoingIds);
  }, [outGoingFriendReqs, friendRequests]);

  // FILTER ACTION
  const handleFilter = async (filterBy) => {
    setFilter(filterBy);
    const allUsers = recommendedUsersData?.recommendedUsers || [];
    if (!allUsers.length) return;

    let filtered = []

    switch (filterBy) {
      case 'location':
        filtered = allUsers.filter(
          (user) => user.location.toLowerCase() == authUser.location.toLowerCase()
        );
        break;
      case 'nativeLanguage':
        filtered = allUsers.filter(
          (user) => user.nativeLanguage.toLowerCase() == authUser.nativeLanguage.toLowerCase()
        );
        break;
      case 'learningLanguage':
        filtered = allUsers.filter(
          (user) => user.learningLanguage.toLowerCase() == authUser.learningLanguage.toLowerCase()
        );
        break;
      default:
        filtered = allUsers;
    }
    setFilterdUsers(filtered);
    console.log("filteredUsers =", filteredUsers);
  }


  return (
    <div className='p-4 sm:p-6 lg:p-8'>
      <div className='container mx-auto space-y-10'>
        {/* HEADER SECTION */}
        <div className='flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4'>
          <h2 className='text-2xl sm:text-3xl font-bold tracking-tight'>Your Friends</h2>
          <Link to='/notifications' className='btn btn-outline btn-sm'>
            <UsersIcon className='mr-2 size-4' />
            Friend Requests
          </Link>
        </div>

        {/* FRIENDS SECTION */}
        {loadingFriends ? (
          <div className='flex justify-center py-12'>
            <span className='loading loading-spinner loading-lg' />
          </div>
        ) : friends.length === 0 ? (
          <NoFriendsFound />
        ) : (
          <div className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 auto-rows-auto gap-4 '>
            {friends.map((friend) => (
              <FriendCard key={friend._id} friend={friend} />
            ))}
          </div>
        )}

        <section>
          <div className="mb-6 sm:mb-8">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">

              {/* LEFT SECTION — HEADING */}
              <div>
                <h2 className="text-2xl sm:text-3xl font-bold tracking-tight">
                  Meet New Learners
                </h2>
                <p className="opacity-70">
                  Discover perfect language exchange partners based on your profile
                </p>
              </div>

              {/* RIGHT SECTION — FILTER DROPDOWN */}
              <div className="dropdown dropdown-end self-end sm:self-auto">
                <button
                  tabIndex={0}
                  className="btn btn-ghost flex items-center gap-2 text-primary hover:bg-base-200"
                >
                  <FunnelIcon className="size-5" />
                  <span className="hidden sm:inline">Filter</span>
                </button>

                <div
                  tabIndex={0}
                  className="dropdown-content mt-2 p-2 shadow-2xl bg-base-200 
                  backdrop-blur-lg rounded-2xl w-48 border border-base-content/10 
                  max-h-80 overflow-y-auto z-50"
                >
                  <div className="flex flex-col gap-1">
                    <button className={`p-2 text-sm font-semibold text-left rounded-lg 
                    ${filter == 'location' ? "bg-primary/10 text-primary" : "hover:bg-base-300"}`}
                      onClick={() => handleFilter('location')}>
                      By place
                    </button>
                    <button className={`p-2 text-sm font-semibold text-left rounded-lg 
                    ${filter == 'nativeLanguage' ? "bg-primary/10 text-primary" : "hover:bg-base-300"}`}
                      onClick={() => handleFilter('nativeLanguage')}>
                      By native language
                    </button>
                    <button className={`p-2 text-sm font-semibold text-left rounded-lg 
                    ${filter == 'learningLanguage' ? "bg-primary/10 text-primary" : "hover:bg-base-300"}`}
                      onClick={() => handleFilter('learningLanguage')}>
                      By learning language
                    </button>
                    <button className='p-2 flex justify-end gap-1 text-sm font-semibold 
                      text-right rounded-lg text-primary hover:text-opacity-70 '
                      onClick={() => handleFilter('reset')}
                    >
                      <FunnelX className='size-5' />
                      <span>Reset</span>
                    </button>
                  </div>
                </div>
              </div>

            </div>
          </div>


          {loadingUsers ? (
            <div className='flex justify-center py-12'>
              <span className='loading loading-spinner loading-lg' />
            </div>
          ) : recommendedUsers.length === 0 ? (
            <div className='card bg-base-200 p-6 text-center'>
              <h3 className='font-bold text-lg mb-2'>
                No recommendations available
              </h3>
              <p className='text-base-content opacity-70'>
                Check back later for new language partners!
              </p>
            </div>
          ) : (

            <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 overflow-hidden'>
              {(filteredUsers.length > 0 ?
                filteredUsers :
                recommendedUsersData?.recommendedUsers || [])
                .map((user) => {
                  const hasRequestBeenSent = outgoingRequestsIds.has(user._id)
                  const requestId = incomingRequestsMap.get(user._id);

                  return (
                    <div key={user._id}
                      className='card bg-base-200 hover:shadow-lg transition-all duration-300'>
                      <div className='card-body p-5 space-y-4'>
                        <div className='flex items-center gap-3'>
                          <div className='avatar size-16 rounded-full'>
                            <img src={user.profilePic} alt="User avatar" />
                          </div>

                          <div>
                            <h3 className='font-semibold text-lg'>{user.fullname}</h3>
                            {user.location && (
                              <div className='flex items-center text-xs opacity-70 mt-1'>
                                <MapPinIcon className='size-3 mr-1' />
                                {user.location}
                              </div>
                            )}
                          </div>
                        </div>

                        {/* LANGUAGES WITH FLAGS */}
                        <div className='flex flex-wrap justify-center lg:justify-between gap-2 mb-3 ' >
                          <span className='badge badge-secondary text-xs'>
                            {getLanguageFlag(user.nativeLanguage)}
                            Native: {capitalize(user.nativeLanguage)}
                          </span>
                          <span className='badge badge-outline text-xs'>
                            {getLanguageFlag(user.learningLanguage)}
                            Learning: {capitalize(user.learningLanguage)}
                          </span>
                        </div>
                        {/* BIO */}
                        <p className='text-sm opacity-80'> {user.bio}</p>

                        {/* ACTION BUTTON */}
                        <div className="mt-2">
                          {requestId ? (
                            // Incoming friend request → show Accept / Reject buttons
                            <div className="flex flex-row gap-3 justify-center">
                              <button
                                className="btn btn-primary flex-1"
                                onClick={() => acceptRequestMutation(requestId)}
                                disabled={isAcceptPending}
                              >
                                {isAcceptPending ? (
                                  <span className="loading loading-spinner loading-xs" />
                                ) : (
                                  'Accept'
                                )}
                              </button>
                              <button
                                className="btn btn-outline border-red-700 text-red-700 flex-1"
                                onClick={() => rejectRequestMutation(requestId)}
                                disabled={isRejectionPending}
                              >
                                {isRejectionPending ? (
                                  <span className="loading loading-spinner loading-xs" />
                                ) : (
                                  'Reject'
                                )}
                              </button>
                            </div>
                          ) : hasRequestBeenSent ? (
                            // Outgoing friend request already sent
                            <button className="btn btn-disabled w-full mt-2">
                              <CheckCircleIcon className="size-4 mr-2" />
                              Request Sent
                            </button>
                          ) : (
                            // No requests yet → show “Send Request” button
                            <button
                              className="btn btn-primary w-full mt-2"
                              onClick={() => sendReqMutations(user._id)}
                              disabled={isPending}
                            >
                              {isPending ? (
                                <span className="loading loading-spinner loading-xs" />
                              ) : (
                                <>
                                  <UserPlusIcon className="size-4 mr-2" />
                                  Send Friend Request
                                </>
                              )}
                            </button>
                          )}
                        </div>
                      </div>
                    </div>
                  )

                })}
            </div>
          )}
        </section>
      </div>
    </div>
  )
}

export default HomePage

