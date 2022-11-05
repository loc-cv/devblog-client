import { useLogoutMutation } from 'features/auth/authApiSlice';
import { usersApiSlice } from 'features/users/usersApiSlice';
import { useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';

export const Header = () => {
  const navigate = useNavigate();
  const [logout, { isSuccess }] = useLogoutMutation();

  const { data: currentUser, isFetching } =
    usersApiSlice.endpoints.getCurrentUser.useQueryState();

  useEffect(() => {
    if (isSuccess) {
      navigate('/');
    }
  }, [isSuccess, navigate]);

  const handleLogout = () => logout();

  return (
    <nav>
      <ul className="flex h-20 justify-around bg-slate-500">
        <li>
          <Link to="/">Home</Link>
        </li>
        {!isFetching && (
          <>
            {!currentUser && (
              <>
                <li>
                  <Link to="/login">Login</Link>
                </li>
                <li>
                  <Link to="/register">Register</Link>
                </li>
              </>
            )}
            {currentUser && currentUser.role === 'admin' && (
              <li>
                <Link to="/dashboard">Dashboard</Link>
              </li>
            )}
            {currentUser && (
              <li>
                <button onClick={handleLogout}>Logout</button>
              </li>
            )}
          </>
        )}
      </ul>
    </nav>
  );
};
