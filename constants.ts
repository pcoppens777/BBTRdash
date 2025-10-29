import { TimeBlockData } from './types';

export const NY_TRADING_BLOCKS: TimeBlockData[] = [
  { id: 'ny-1', title: 'NY killzone', timeRange: '7u00 - 11u00', startTime: '07:00', endTime: '11:00' },
  { id: 'ny-2', title: 'Pre market range:', timeRange: '7:00-7:30', startTime: '07:00', endTime: '07:30' },
  { id: 'ny-3', title: 'Red folder US news:', timeRange: '8:30-9:00', startTime: '08:30', endTime: '09:00' },
  { id: 'ny-4', title: 'Equities open', timeRange: '9:30-10:00', startTime: '09:30', endTime: '10:00', isImportant: true },
  { id: 'ny-5', title: 'NY Powerhour', timeRange: '14:00-16:00', startTime: '14:00', endTime: '16:00' },
];

export const MACRO_TIMEBLOCKS: TimeBlockData[] = [
    { id: 'm-1', title: 'Macro 1/', timeRange: '7u50 - 8u10', startTime: '07:50', endTime: '08:10' },
    { id: 'm-2', title: 'Macro 2/', timeRange: '8u50 - 9u10', startTime: '08:50', endTime: '09:10' },
    { id: 'm-3', title: 'Macro 3/', timeRange: '9u50 - 10u10', startTime: '09:50', endTime: '10:10', isImportant: true },
    { id: 'm-4', title: 'Macro 4/', timeRange: '11u50 - 12u10', startTime: '11:50', endTime: '12:10' },
    { id: 'm-5', title: 'Macro 5/', timeRange: '12u50 - 13u10', startTime: '12:50', endTime: '13:10' },
    { id: 'm-6', title: 'Macro 6/', timeRange: '13u50 - 14u10', startTime: '13:50', endTime: '14:10' },
    { id: 'm-7', title: 'Macro 7/', timeRange: '14u50 - 15u10', startTime: '14:50', endTime: '15:10' },
    { id: 'm-8', title: 'Macro 8/', timeRange: '15u50 - 16u10', startTime: '15:50', endTime: '16:10' },
];

export const HORN_SOUND_URL = 'https://cdn.pixabay.com/download/audio/2022/03/15/audio_2b4a11c81c.mp3';