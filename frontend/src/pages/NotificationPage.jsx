import { useAcceptFriendReqs, useGetFriendReqs, useRejectFriendReqs } from '../hooks/useUserFriends'
import { BellIcon, ClockIcon, MessageSquareIcon, UserCheckIcon } from 'lucide-react';
import { isDateExpired, timestampToDay } from '../lib/utils';
import NoNotificationFound from '../components/NoNotificationFound';

const NotificationPage = () => {
  const { data: friendRequests, isLoading } = useGetFriendReqs()
  const incomingFriendReqs = friendRequests?.incomingRequest || [];
  const acceptedFriendReqs = friendRequests?.acceptedRequests || [];
  const rejectedFriendReqs = friendRequests?.rejecteRequests || [];

  const { mutate: acceptRequestMutaion, isPending: isAcceptPending } = useAcceptFriendReqs();
  const { mutate: rejectRequestMutation, isPending: isRejectionPending } = useRejectFriendReqs();

  return (
    <div className='p-4 sm:p-6 lg:p-8'>
      <div className='container mx-auto max-w-4xl space-y-8'>
        <h1 className='text-2xl sm:text-3xl font-bold tracking-tight mb-6'>Notifications</h1>

        {isLoading ? (
          <div className='flex justify-center py-12'>
            <span className='loading loading-spinner loading-lg' />
          </div>
        ) : (
          <>
            {/* INCOMING REQUESTS NOTIFICATION */}
            {incomingFriendReqs?.length > 0 && (
              <section className='space-y-4'>

                <h2 className='text-xl font-semibold flex items-center gap-2'>
                  <UserCheckIcon className='size-5 text-primary' />
                  Friend Requests
                  <span className='badge badge-primary ml-2'>{incomingFriendReqs?.length}</span>
                </h2>

                <div className='space-y-3'>
                  {incomingFriendReqs?.map(request => (
                    <div key={request?._id}
                      className='card bg-base-200 shadow-sm hover:shadow-md transition-shadow'>

                      <div className='card-body p-4'>
                        <div className='flex items-center justify-between'>
                          <div className='flex items-center gap-3'>
                            <div className='avatar size-10 rounded-full bg-base-100'>
                              <img src={request.sender.profilePic} alt={request?.sender.fullname} />
                            </div>

                            <div>
                              <h3 className='font-semibold'>{request?.sender.fullname}</h3>
                              <div className='flex flex-wrap gap-1.5 mt-1'>
                                <span className='badge badge-secondary badge-sm'>
                                  Native: {request?.sender.nativeLanguage}
                                </span>
                                <span className='badge badge-outline badge-sm'>
                                  Learning: {request?.sender.learningLanguage}
                                </span>
                              </div>
                            </div>
                          </div>
                          <div className='flex flex-row gap-3 '>
                            <button className='btn btn-primary btn-sm'
                              onClick={() => { acceptRequestMutaion(request?._id) }}
                              disabled={isAcceptPending}>
                              Accept
                            </button>
                            <button className='btn btn-outline border-red-700 text-red-700 btn-sm'
                              onClick={() => { rejectRequestMutation(request?._id) }}
                              disabled={isRejectionPending}>
                              Reject
                            </button>
                          </div>

                        </div>

                      </div>
                    </div>
                  ))}
                </div>
              </section>
            )}

            {/* ACCEPTED REQUEST NOTIFICATIONS */}
            {acceptedFriendReqs?.length > 0 && (
              <section className='space-y-4'>
                <h2 className='text-xl font-semibold flex items-center gap-2'>
                  <BellIcon className='size-5 text-success' />
                  New Connections
                </h2>
                <div className="space-y-3">
                  {acceptedFriendReqs
                    ?.filter(notification => !isDateExpired(notification?.createdAt, 7))
                    .map(notification => (
                      <div
                        key={notification?._id}
                        className="card bg-base-200 shadow-sm"
                      >
                        <div className="card-body p-4">
                          <div className="flex items-start gap-3">
                            <div className="avatar mt-1 size-10 rounded-full">
                              <img
                                src={notification?.recipient.profilePic}
                                alt={notification?.recipient.fullname}
                              />
                            </div>
                            <div className="flex-1">
                              <h3 className="font-semibold">{notification?.recipient.fullname}</h3>
                              <p className="text-sm my-1">
                                {notification?.recipient.fullname} accepted your friend request
                              </p>
                              <p className="text-xs flex items-center opacity-70">
                                <ClockIcon className="size-3 mr-1" />
                                {timestampToDay(notification?.createdAt)}
                              </p>
                            </div>
                            <div className="badge badge-success">
                              <MessageSquareIcon className="size-3 mr-1" />
                              New Friend
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}
                </div>

              </section>
            )}

            {/* NO NOTIFICATIONS FOUND */}
            {incomingFriendReqs?.length == 0 && acceptedFriendReqs?.length == 0 && rejectedFriendReqs.length === 0 && (
              <NoNotificationFound />
            )}
          </>
        )}
      </div>
    </div>
  )
}

export default NotificationPage