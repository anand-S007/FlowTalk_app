import { useSwipeable } from "react-swipeable"
import { useNavigate } from 'react-router'

const SwipeWrapper = ({children}) => {
  const navigate = useNavigate()

  const handlers = useSwipeable({
    onSwipedLeft: () => navigate(1),   
    onSwipedRight: () => navigate(-1), 
    trackMouse: true,  
    preventDefaultTouchmoveEvent: false,
  })

  return <div {...handlers} className="h-full">{children}</div>;
}

export default SwipeWrapper