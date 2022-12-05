import { BookOpenIcon, TagIcon, UserIcon } from '@heroicons/react/24/outline';
import { CustomNavLink } from 'components/CustomNavLink';
import { Outlet } from 'react-router-dom';

export const DashboardPage = () => {
  return (
    <main className="flex justify-between">
      {/* sidebar */}
      <div className="flex w-[15%] flex-col py-2">
        <CustomNavLink to="users" Icon={<UserIcon />}>
          Users
        </CustomNavLink>
        <CustomNavLink to="posts" Icon={<BookOpenIcon />}>
          Posts
        </CustomNavLink>
        <CustomNavLink to="tags" Icon={<TagIcon />}>
          Tags
        </CustomNavLink>
        {/* <CustomNavLink to="reports" Icon={<UserIcon />}> */}
        {/*   Reports */}
        {/* </CustomNavLink> */}
      </div>

      <div className="w-[80%]">
        <Outlet />
      </div>
    </main>
  );
};
