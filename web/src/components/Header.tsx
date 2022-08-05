import { Link } from 'react-router-dom';
import Scientist from '../assets/scientist.svg';
import UserSummary from './UserSummary';

function Header() {
  return (
    <div className='flex items-center mb-6 px-8 text-lg'>
      <Link to="/" className='mr-8 flex items-center'>
        <img className='h-24 mr-4' src={Scientist} alt="Scientist" />
        <span className='text-blue-700 text-2xl font-bold'>Kids Lab</span>
      </Link>
      <Link to="/web" className='px-4 py-2 mx-6'>
        Web
      </Link>
      <Link to="/server" className='px-4 py-2 mx-6'>
        Server
      </Link>
      <Link to="/hardware" className='px-4 py-2 mx-6'>
        Hardware
      </Link>
      <Link to="/lab" className='px-4 py-2 mx-6'>
        Lab
      </Link>
      <Link to="/control-panel" className='px-4 py-2 mx-6'>
        Control Panel
      </Link>
      <div className='ml-auto'>
        <UserSummary />
      </div>
    </div>
  );
}

export default Header;
