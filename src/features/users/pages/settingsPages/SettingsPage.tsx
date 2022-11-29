// show: name (first & last) username email profilePhoto bio
// editable: name (first & last) username bio
// update password
// TODO: update profilePhoto

import { Link, Outlet } from 'react-router-dom';

export const UserSettingsPage = () => {
  return (
    <main className="flex">
      {/* sidebar */}
      <div className="flex w-64 flex-col">
        <Link to="profile">
          <div>Public profile</div>
        </Link>
        <Link to="password">
          <div>Password</div>
        </Link>
      </div>

      <div>
        <Outlet />
      </div>
    </main>
  );
};
