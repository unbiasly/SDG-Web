import React from 'react';
import { ArrowLeft } from 'lucide-react';
import Link from 'next/link';

interface HeaderProps {
  title: string;
}

const Header: React.FC<HeaderProps> = ({ title }) => {
  return (
    <div className="sticky top-0 bg-white z-10 flex items-center p-3 border-b border-gray-200">
      <Link href='/' aria-label='back-button' className="mr-4">
        <ArrowLeft size={20} />
      </Link>
      <h1 className="text-lg font-semibold flex-1">{title}</h1>
    </div>
  );
};

export default Header;