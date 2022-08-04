import { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import Wheel from '@uiw/react-color-wheel';
import { useAuth } from '../App';
import { User } from '../models';
import UserThumbnail from '../components/UserThumbnail';

function SignIn() {
  const auth = useAuth();
  let navigate = useNavigate();
  const [user, setUser] = useState<User>({} as User);
  const [hsva, setHsva] = useState({ h: 0, s: 0, v: 90, a: 1 });
  const location = useLocation();
  const from = (location as any).state?.from?.pathname || "/";

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await auth.login(user)
    navigate(from, { replace: true });
  };

  const userDataChange = (key: keyof User, value: string | number) => {
    setUser({
      ...user,
      [key]: value
    });
  };

  return (
    <div className='mx-auto max-w-xl'>
      <h1 className='text-2xl text-center'>Sign in</h1>
      <form onSubmit={(e) => { handleSubmit(e) }}>
        <div className='mb-8'>
          <label
            className="text-gray-800 mb-1 md:mb-0 pr-4"
            htmlFor="user-name"
          >
            Name
          </label>
          <input
            className="bg-gray-50 appearance-none border-2 border-gray-100 rounded w-full py-2 px-4 text-gray-700 leading-tight focus:outline-none focus:bg-white focus:border-blue-500"
            id="user-name"
            type="text"
            required
            onChange={(e) => { userDataChange('name', e.target.value) }}
          />
        </div>
        <div>
          <label
            className="text-gray-800 mb-1 md:mb-0 pr-4"
            htmlFor="user-name"
          >
            Age
          </label>
          <input
            className="bg-gray-50 appearance-none border-2 border-gray-100 rounded w-full py-2 px-4 text-gray-700 leading-tight focus:outline-none focus:bg-white focus:border-blue-500"
            id="user-name"
            type="number"
            required
            onChange={(e) => { userDataChange('age', +e.target.value) }}
          />
        </div>
        <div className="flex justify-around items-center mt-12">
          <div>
            <UserThumbnail name={user.name} color={user.color} />
          </div>
          <div>
            <Wheel
              color={hsva}
              onChange={(color) => {
                console.log(color.hex);
                setHsva(color.hsva);
                userDataChange('color', color.hex);
                //userDataChange('color', color.hsva);
              }}
            />
          </div>
        </div>

        <div className='mt-20 text-center'>
          <input type="submit" value="Sign in" className="border px-16 py-3 my-2" />
        </div>
      </form>

      {/* <div>Color: 📗</div> */}
      {/* <div>Age: X</div> */}
      {/* <div>Location: X</div> */}
    </div>
  )
}

export default SignIn;
