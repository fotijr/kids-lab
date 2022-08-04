import { Link } from "react-router-dom";

function Footer() {

  return (
    <div className='py-12 mt-20 bg-blue-700 text-white flex justify-around'>
      <Link to="/web" className='px-4 py-2'>
        Web
      </Link>
      <Link to="/server" className='px-4 py-2'>
        Server
      </Link>
      <Link to="/hardware" className='px-4 py-2'>
        Hardware
      </Link>
      <Link to="/lab" className='px-4 py-2'>
        Lab
      </Link>
    </div>
  );
}

export default Footer;
