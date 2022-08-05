import { createContext, useContext, useEffect, useState } from 'react';
import { Routes, Route, useLocation, Navigate } from 'react-router-dom';
import Header from './components/Header';
import Footer from './components/Footer';
import Home from './pages/Home';
import Server from './pages/Server';
import Web from './pages/Web';
import Hardware from './pages/Hardware';
import Lab from './pages/Lab';
import SignIn from './pages/SignIn';
import { AuthContextType, User } from './models';
import { userService } from './services/user';
import Me from './pages/Me';
import ControlPanel from './pages/ControlPanel';

export const AuthContext = createContext<AuthContextType>(null!);

let setSignedInUser: (user: User) => void;

function App() {
  useEffect(() => {
    userService.get()
      .then(user => {
        if (user) {
          setSignedInUser(user);
        }
      });
  }, []);

  return (
    <AuthProvider>
      <div>
        <Header />
        <div className='max-w-screen-lg	mx-auto'>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="web" element={<Web />} />
            <Route path="server" element={<Server />} />
            <Route path="hardware" element={<Hardware />} />
            <Route path="lab" element={
              <RequireAuth>
                <Lab />
              </RequireAuth>
            } />
            <Route path="control-panel" element={
              <RequireAuth>
                <ControlPanel />
              </RequireAuth>
            } />
            <Route path="me" element={
              <RequireAuth>
                <Me />
              </RequireAuth>
            } />
            <Route path="sign-in" element={<SignIn />} />
          </Routes>
        </div>
        <Footer />
      </div>
    </AuthProvider>
  );
}

export const useAuth = () => {
  return useContext(AuthContext);
}

function RequireAuth({ children }: { children: JSX.Element }) {
  let auth = useAuth();
  let location = useLocation();

  if (!auth?.user) {
    // Redirect them to the /login page, but save the current location they were
    // trying to go to so we can redirect after sign in.
    return <Navigate to="/sign-in" state={{ from: location }} replace />;
  }

  return children;
}

function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User>(null!);
  setSignedInUser = setUser;

  const login = async (user: User) => {
    await userService.login(user);
    setUser(user);
  };

  const logout = () => {
    setUser(null!);
    return userService.logout();
  };

  const value = { user, login, logout };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export default App;
