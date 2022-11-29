import { Fragment } from 'react';
import { Outlet } from 'react-router-dom';
import { Header } from './Header';

export const Layout = () => {
  return (
    <Fragment>
      <Header />
      <div className="mx-auto mt-10 max-w-5xl">
        <Outlet />
      </div>
    </Fragment>
  );
};
