import React from 'react';
import { Outlet } from 'react-router-dom';

const MinimalLayout = () => {
  return (
    <div className="fixed inset-0 w-screen h-screen bg-gray-100 overflow-hidden">
      <Outlet />
    </div>
  );
};

export default MinimalLayout;
