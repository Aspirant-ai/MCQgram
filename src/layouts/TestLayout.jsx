// src/layouts/TestLayout.jsx

import React from 'react';

const TestLayout = ({ children }) => {
  return (
    <div className="fixed inset-0 z-50 bg-white dark:bg-gray-900 w-full h-full overflow-auto">
      {children}
    </div>
  );
};

export default TestLayout;