import React from 'react';
import { ClockIcon } from './icons';

interface HeaderProps {
  now: Date;
}

const formatTime = (date: Date, timeZone: string): string => {
  try {
    return new Intl.DateTimeFormat('en-US', {
      timeZone,
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
      hour12: false,
    }).format(date);
  } catch (error) {
    console.error(`Error formatting time for timezone ${timeZone}:`, error);
    return '??:??:??';
  }
};

const Header: React.FC<HeaderProps> = ({ now }) => {
  const nyTime = formatTime(now, 'America/New_York');
  const brusselsTime = formatTime(now, 'Europe/Brussels');

  return (
    <header className="flex flex-col sm:flex-row sm:items-center justify-between pb-4 border-b border-gray-200">
      <div className="flex items-center gap-3">
        <ClockIcon className="w-8 h-8 text-gray-500" />
        <h1 className="text-2xl font-bold text-gray-800">
          NEW YORK <span className="font-light">TIMEBLOCKS</span>
        </h1>
      </div>
      <div className="flex items-center gap-4 mt-2 sm:mt-0 text-gray-600">
        <div>
          <span className="font-semibold">NY:</span> {nyTime}
        </div>
        <div className="border-l border-gray-300 h-5"></div>
        <div>
          <span className="font-semibold">Brussels:</span> {brusselsTime}
        </div>
      </div>
    </header>
  );
};

export default Header;