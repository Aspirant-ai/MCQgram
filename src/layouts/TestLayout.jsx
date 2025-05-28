
import React from 'react';
import { Outlet } from 'react-router-dom';

const TestLayout = () => {
  return (
    <div className="min-h-screen bg-gray-100 w-full h-full fixed inset-0 overflow-hidden">
      <Outlet />
    </div>
  );
};

export default TestLayout;
