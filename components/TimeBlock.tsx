import React, { useMemo, useRef, useEffect } from 'react';
import { TimeBlockData } from '../types';
import { HORN_SOUND_URL } from '../constants';
import { usePrevious } from '../hooks/usePrevious';

interface TimeBlockProps {
  data: TimeBlockData;
  now: Date;
  isCompact?: boolean;
}

const formatCountdown = (totalSeconds: number): string => {
  if (totalSeconds < 0) totalSeconds = 0;
  const hours = Math.floor(totalSeconds / 3600);
  const minutes = Math.floor((totalSeconds % 3600) / 60);
  const seconds = Math.floor(totalSeconds % 60);
  return [hours, minutes, seconds]
    .map(v => v.toString().padStart(2, '0'))
    .join(':');
};

const TimeBlock: React.FC<TimeBlockProps> = ({ data, now, isCompact = false }) => {
  const hornAudioRef = useRef<HTMLAudioElement | null>(null);

  useEffect(() => {
    hornAudioRef.current = new Audio(HORN_SOUND_URL);
    hornAudioRef.current.preload = 'auto';
  }, []);

  const {
    isActive,
    progress,
    countdownSeconds,
    isEndingSoon,
  } = useMemo(() => {
    try {
      const timeZone = 'America/New_York';
      
      const formatter = new Intl.DateTimeFormat('en-US', {
          timeZone,
          hour: 'numeric',
          minute: 'numeric',
          second: 'numeric',
          hour12: false,
      });
      
      const parts = formatter.formatToParts(now);
      const getPart = (type: Intl.DateTimeFormatPartTypes) => parseInt(parts.find(p => p.type === type)?.value || '0', 10);
      
      const currentHour = getPart('hour');
      const currentMinute = getPart('minute');
      const currentSecond = getPart('second');

      // Handle Intl returning 24 for midnight
      const nowInSeconds = (currentHour === 24 ? 0 : currentHour) * 3600 + currentMinute * 60 + currentSecond;

      const [startHour, startMinute] = data.startTime.split(':').map(Number);
      const startTimeInSeconds = startHour * 3600 + startMinute * 60;
      
      const [endHour, endMinute] = data.endTime.split(':').map(Number);
      const endTimeInSeconds = endHour * 3600 + endMinute * 60;

      const isActive = nowInSeconds >= startTimeInSeconds && nowInSeconds < endTimeInSeconds;
      const isExpired = nowInSeconds >= endTimeInSeconds;
      
      const totalDuration = endTimeInSeconds - startTimeInSeconds;
      const elapsed = nowInSeconds - startTimeInSeconds;
      const progress = isActive ? Math.min(100, Math.max(0, (elapsed / totalDuration) * 100)) : (isExpired ? 100 : 0);
      
      const countdownSeconds = endTimeInSeconds - nowInSeconds;
      
      const isEndingSoon = isActive && countdownSeconds <= 30;

      return { isActive, progress, countdownSeconds, isEndingSoon };
    } catch (error) {
        console.error("Error calculating time block status:", error);
        // Return a safe, default state to prevent the app from crashing.
        return {
            isActive: false,
            progress: 0,
            countdownSeconds: 0,
            isEndingSoon: false,
        };
    }
  }, [now, data.startTime, data.endTime]);

  const wasActive = usePrevious(isActive);

  useEffect(() => {
    if (wasActive && !isActive) {
      hornAudioRef.current?.play().catch(e => console.error("Audio play failed:", e));
    }
  }, [isActive, wasActive]);

  const cardClasses = [
    isCompact ? 'p-2' : 'p-4',
    'rounded-lg border transition-all duration-300 relative',
    isActive ? 'bg-green-50 border-green-400 shadow-md' : 'bg-gray-100 border-gray-300',
    isEndingSoon ? 'animate-pulse-red' : ''
  ].join(' ');

  const progressBarClasses = [
    'h-full rounded-full transition-all duration-500',
    isActive ? 'bg-blue-500' : 'bg-gray-300'
  ].join(' ');

  const textColor = isActive ? 'text-gray-700' : 'text-gray-500';

  return (
    <div className={cardClasses}>
      {data.isImportant && !isActive && <div className={`absolute w-3 h-3 bg-red-500 rounded-full ${isCompact ? 'bottom-2 left-2' : 'bottom-4 left-4'}`}></div>}
      <div className={`grid grid-cols-2 gap-4 items-start ${textColor}`}>
        <div>
          <p className={`font-semibold ${isCompact ? 'text-sm' : 'text-base'}`}>{data.title}</p>
          <p className={isCompact ? 'text-xs' : 'text-sm'}>{data.timeRange}</p>
        </div>
        <div className="text-right">
          <p className={isCompact ? 'text-xs' : 'text-sm'}>CD:</p>
          <p className={`font-mono font-bold ${isCompact ? 'text-sm' : 'text-base'}`}>
            {isActive ? formatCountdown(countdownSeconds) : '00:00:00'}
          </p>
        </div>
      </div>
      <div className={isCompact ? 'mt-1' : 'mt-2'}>
        <div className={`w-full bg-gray-200 rounded-full dark:bg-gray-300 overflow-hidden ${isCompact ? 'h-2' : 'h-3'}`}>
          <div className={progressBarClasses} style={{ width: `${progress}%` }}></div>
        </div>
        <p className={`text-right mt-1 ${textColor} ${isCompact ? 'text-xs' : 'text-sm'}`}>
          {Math.round(progress)}%
        </p>
      </div>
    </div>
  );
};

export default TimeBlock;