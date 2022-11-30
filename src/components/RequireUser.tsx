import { usersApiSlice } from 'features/users/usersApiSlice';
import { Navigate, Outlet, useLocation } from 'react-router-dom';
import { Spinner } from './Spinner';

export const RequireUser = ({ allowedRoles }: { allowedRoles: string[] }) => {
  const location = useLocation();

  const { data: currentUser, isFetching } =
    usersApiSlice.endpoints.getCurrentUser.useQueryState();

  if (isFetching) {
    return (
      <div className="mt-48 flex items-center justify-center">
        <Spinner className="h-20 w-20" />
      </div>
    );
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
