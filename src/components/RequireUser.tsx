import { usersApiSlice } from 'features/users/usersApiSlice';
import { Navigate, Outlet, useLocation } from 'react-router-dom';

const RequireUser = ({ allowedRoles }: { allowedRoles: string[] }) => {
  const location = useLocation();

  const { data: currentUser, isFetching } =
    usersApiSlice.endpoints.getCurrentUser.useQueryState();

  if (isFetching) {
    return <p>Loading...</p>;
  }

  if (currentUser) {
    if (allowedRoles.includes(currentUser.role)) {
      return <Outlet />;
    } else {
      return <Navigate to="/" replace />;
    }
  }

  return <Navigate to="/login" state={{ from: location }} replace />;
};

export default RequireUser;
