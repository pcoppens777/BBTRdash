
// Fix: Define and export the TimeBlockData interface to be used across the application.
export interface TimeBlockData {
  id: string;
  title: string;
  timeRange: string;
  startTime: string;
  endTime: string;
  isImportant?: boolean;
}

export interface NewsItem {
  guid: string;
  title: string;
  pubDate: string;
  link: string;
  description: string;
  author: string;
  thumbnail: string;
  categories: string[];
  summary?: string;
  source?: string;
}