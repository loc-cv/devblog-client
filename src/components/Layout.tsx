import { Outlet } from 'react-router-dom';
import { Header } from './Header';

export const Layout = () => {
  return (
    <div className="mx-auto min-h-screen max-w-lg md:max-w-xl lg:max-w-2xl xl:max-w-4xl">
      <Header />
      <div className="mt-16 px-5 pb-28">
        <Outlet />
      </div>
    </div>
  );
};
