import { ShieldExclamationIcon, UserIcon } from '@heroicons/react/24/outline';
import { CustomNavLink } from 'components/CustomNavLink';
import { Outlet } from 'react-router-dom';

export const UserSettingsPage = () => {
  return (
    <main className="flex flex-col sm:flex-row">
      {/* sidebar */}
      <div className="mb-4 flex flex-col border-b-2 border-b-gray-200 py-2 sm:mr-10 sm:w-[30%] sm:min-w-[160px] sm:border-none">
        <CustomNavLink to="profile" Icon={<UserIcon />}>
          Public profile
        </CustomNavLink>

        <CustomNavLink to="password" Icon={<ShieldExclamationIcon />}>
          Password
        </CustomNavLink>
      </div>

      <div className="max-w-md sm:w-[60%]">
        <Outlet />
      </div>
    </main>
  );
};
