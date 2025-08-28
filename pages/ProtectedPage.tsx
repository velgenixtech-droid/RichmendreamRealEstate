import React from 'react';
import { Wrench } from 'lucide-react';

const ProtectedPage: React.FC<{ title: string }> = ({ title }) => {
  return (
    <div className="flex flex-col items-center justify-center h-full text-center">
      <Wrench className="w-16 h-16 text-primary mb-4" />
      <h1 className="text-3xl font-bold text-on-surface">{title}</h1>
      <p className="mt-2 text-lg text-gray-400">This feature is currently under construction.</p>
      <p className="text-gray-500">Please check back later!</p>
    </div>
  );
};

export default ProtectedPage;
