
import React from 'react';
import { Outlet } from 'react-router-dom';

const MinimalLayout = () => {
  return (
    <div className="min-h-screen w-full h-full fixed inset-0 overflow-auto bg-gray-100">
      <Outlet />
    </div>
  );
};

export default MinimalLayout;
