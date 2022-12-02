/* eslint-disable import/named */
import React from 'react';
import { NavLink, To } from 'react-router-dom';

type CustomNavLinkProps = {
  children: React.ReactNode;
  Icon: React.ReactElement;
  to: To;
};

export const CustomNavLink = ({ children, to, Icon }: CustomNavLinkProps) => {
  const StyledIcon = React.useCallback(
    () =>
      React.cloneElement(Icon, {
        className: 'mr-1 inline-block h-5 w-5',
      }),
    [Icon],
  );

  return (
    <NavLink
      to={to}
      className={({ isActive }) =>
        `${'relative rounded p-2 text-gray-800'} ${
          isActive && 'bg-gray-100 font-semibold'
        }`
      }
    >
      <div className="flex items-center">
        <StyledIcon />
        {children}
      </div>
    </NavLink>
  );
};
