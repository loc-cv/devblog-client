import { Link, Outlet } from 'react-router-dom';

export const DashboardPage = () => {
  return (
    <main className="flex">
      {/* sidebar */}
      <div className="flex w-64 flex-col">
        <Link to="users">
          <div>Users</div>
        </Link>
        <Link to="posts">
          <div>Posts</div>
        </Link>
        <Link to="tags">
          <div>Tags</div>
        </Link>
        {/* <Link to="reports"> */}
        {/*   <div>Reports</div> */}
        {/* </Link> */}
      </div>

      <div>
        <Outlet />
      </div>
    </main>
  );
};
