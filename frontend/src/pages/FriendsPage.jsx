import { useGetFriends } from '../hooks/useUserFriends.js';
import NoFriendsFound from '../components/NoFriendsFound.jsx';
import FriendCard from '../components/FriendCard.jsx';

const FriendsPage = () => {
    const {data} = useGetFriends();
    const userFriends = data?.friends;
    console.log(userFriends);
    
    
  return (
    userFriends?.length > 0 ? (
        <div className='p-6'>
            <div className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 auto-rows-auto gap-4 '>
            {userFriends.map(friend => (
                <FriendCard key={friend._id} friend={friend}/>
            ))}
        </div>
        </div>
        
    ) : (
        <NoFriendsFound/>
    )
    
  )
}

export default FriendsPage