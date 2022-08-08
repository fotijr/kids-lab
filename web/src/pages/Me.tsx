import { useAuth } from '../App';

function Server() {
  const auth = useAuth();

  return (
    <div>
      <h1 className='text-2xl text-center'>Me</h1>

      <div>Name: {auth.user.name}</div>
      <div>
        Color: <span style={{ color: auth.user.color }}>{auth.user.color}</span>
      </div>
      <div>Age: {auth.user.age}</div>
      <div className='mt-8'>
        <button className='px-4 py-2 border' onClick={() => auth.logout() }>Sign out</button>
      </div>
    </div>
  )
}

export default Server
