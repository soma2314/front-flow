import React from 'react';
import { Loader } from 'lucide-react';

const CustomLoading = () => {
  return (
    <div className="fixed inset-0 flex min-h-screen flex-col items-center justify-center bg-gray-900 text-white">
      <div className="flex flex-col items-center space-y-6">
        <div className="flex items-center space-x-3">
          <div className="h-8 w-8 rounded-lg bg-blue-500"></div>
          <h1 className="text-2xl font-bold text-blue-500">FrontFlow</h1>
        </div>
        
        <div className="flex flex-col items-center space-y-4">
          <Loader className="h-10 w-10 animate-spin text-blue-500" />
          <div className="text-center">
            <p className="text-lg font-medium">Initializing Application</p>
            <p className="text-sm text-gray-400">Setting up your workspace...</p>
          </div>
        </div>

        <div className="w-64">
          <div className="h-1 w-full overflow-hidden rounded-full bg-gray-800">
            <div className="h-full w-1/2 animate-pulse bg-blue-500"></div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CustomLoading;