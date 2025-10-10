import {Link} from 'react-router'
import { LANGUAGE_TO_FLAG } from '../constants';


const FriendCard = ({ friend }) => {
    return (
        <div className='card h-full bg-base-200 hover:shadow-md transition-shadow'>
            <div className='card-body p-4'>
                {/* USER INFO */}
                <div className='flex items-center gap-3 mb-3'>
                    <div className='avatar size-12'>
                        <img src={friend.profilePic} alt="Friend avatar" />
                    </div>
                    <h3 className='font-semibold truncate'>{friend.fullname}</h3>
                </div>

                <div className='flex flex-wrap justify-center lg:justify-between max-sm:justify-between gap-2 mb-3 ' >
                    <span className='badge badge-secondary text-xs'>
                        {getLanguageFlag(friend.nativeLanguage)}
                        Native: {friend.nativeLanguage}
                    </span>
                    <span className='badge badge-outline text-xs'>
                        {getLanguageFlag(friend.learningLanguage)}
                        Learning: {friend.learningLanguage}
                    </span>
                </div>
                <div className='p-3 flex flex-row items-center justify-center gap-3'>
                <Link to={`/chat/${friend._id}`} className="btn btn-outline w-1/2" >
                    Message
                </Link>
                <button className='btn btn-outline border-red-700 text-red-700 w-1/2'>
                    Unfriend
                </button>
                </div>
            </div>
        </div>
    )
}

// FLAG COMPONENT
export function getLanguageFlag(language) {
    if (!language) return null;

    const langLower = language.toLowerCase();
    const countryCode = LANGUAGE_TO_FLAG[langLower];
    if (countryCode) {
        return (
            <img
                src={`https://flagcdn.com/24x18/${countryCode}.png`}
                alt={`${langLower} flag`}
                className='h-3 mr-1 inline-block'
            />
        )
    }
}

export default FriendCard