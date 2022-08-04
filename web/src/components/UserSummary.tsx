import { Link } from 'react-router-dom';
import { useAuth } from '../App';
import UserThumbnail from './UserThumbnail';

function UserSummary() {
  const auth = useAuth();

  if (!auth.user) {
    return <div className='whitespace-nowrap'>
      <Link to='/sign-in'>Sign in</Link>
    </div>
  }

  return (
    <Link to='/me' className='flex items-center'>
      <UserThumbnail name={auth.user.name} color={auth.user.color} />
      <span>{auth.user.name}</span>
    </Link>
  );
}

export default UserSummary;
