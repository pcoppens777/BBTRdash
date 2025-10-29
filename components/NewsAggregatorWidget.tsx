
import React, { useState, useEffect } from 'react';
import { NewsItem } from '../types';
import { ChevronDownIcon } from './icons';

const NEWS_SOURCES = [
  { name: 'CNBC', url: 'https://www.cnbc.com/id/10000664/device/rss/rss.html' },
  { name: 'ZeroHedge', url: 'https://feeds.feedburner.com/zerohedge/feed' },
];

const NewsAggregatorWidget: React.FC = () => {
  const [news, setNews] = useState<NewsItem[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const [expandedItems, setExpandedItems] = useState<Record<string, boolean>>({});
  const [summaries, setSummaries] = useState<Record<string, string>>({});
  const [summarizing, setSummarizing] = useState<Record<string, boolean>>({});

  useEffect(() => {
    const fetchNews = async () => {
      try {
        const promises = NEWS_SOURCES.map(async (source) => {
          const response = await fetch(`https://api.rss2json.com/v1/api.json?rss_url=${encodeURIComponent(source.url)}`);
          if (!response.ok) {
            throw new Error(`Failed to fetch from ${source.name}`);
          }
          const data = await response.json();
          if (data.status !== 'ok') {
            throw new Error(data.message || `Failed to parse news from ${source.name}`);
          }
          return data.items.map((item: NewsItem) => ({ ...item, source: source.name }));
        });

        const results = await Promise.all(promises);
        const combinedNews = results.flat();
        
        combinedNews.sort((a, b) => new Date(b.pubDate).getTime() - new Date(a.pubDate).getTime());

        setNews(combinedNews);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'An unknown error occurred');
      } finally {
        setLoading(false);
      }
    };
    fetchNews();
  }, []);

  const handleToggleSummary = async (item: NewsItem) => {
    const itemId = item.guid;
    const isExpanded = !!expandedItems[itemId];
    setExpandedItems(prev => ({ ...prev, [itemId]: !isExpanded }));

    if (!isExpanded && !summaries[itemId]) {
      setSummarizing(prev => ({ ...prev, [itemId]: true }));
      try {
        if (!process.env.API_KEY) {
            throw new Error("API_KEY environment variable not set");
        }
        
        const { GoogleGenAI } = await import('@google/genai');
        const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

        const cleanDescription = item.description.replace(/<[^>]*>?/gm, '');
        const prompt = `Summarize this news article in one single, concise sentence, based on its title and description. Title: "${item.title}". Description: "${cleanDescription}"`;
        
        const response = await ai.models.generateContent({
            model: 'gemini-2.5-flash',
            contents: prompt,
        });
        setSummaries(prev => ({ ...prev, [itemId]: response.text }));
      } catch (e) {
        setSummaries(prev => ({ ...prev, [itemId]: 'Could not generate summary.' }));
        console.error("Error generating summary:", e);
      } finally {
        setSummarizing(prev => ({ ...prev, [itemId]: false }));
      }
    }
  };

  const renderContent = () => {
    if (loading) return <p className="text-center text-gray-500">Loading news...</p>;
    if (error) return <p className="text-center text-red-500">Error: {error}</p>;
    if (news.length === 0) return <p className="text-center text-gray-500">No news available.</p>;

    return (
      <ul className="space-y-3">
        {news.map((item) => (
          <li key={item.guid} className="text-sm bg-white p-2 rounded-md border border-gray-200">
            <div className="flex items-start justify-between gap-2">
                <div className="flex-1">
                    <a href={item.link} target="_blank" rel="noopener noreferrer" className="font-semibold text-gray-800 hover:text-blue-600">
                        {item.title}
                    </a>
                    <span className="text-xs text-gray-500 ml-2 bg-gray-100 px-1.5 py-0.5 rounded">{item.source}</span>
                </div>
              <button onClick={() => handleToggleSummary(item)} className="p-1 rounded-full hover:bg-gray-200 flex-shrink-0">
                <ChevronDownIcon className={`w-4 h-4 text-gray-500 transition-transform ${expandedItems[item.guid] ? 'rotate-180' : ''}`} />
              </button>
            </div>
            {expandedItems[item.guid] && (
              <div className="mt-2 pt-2 border-t border-gray-100">
                {summarizing[item.guid] && <p className="text-gray-500 italic">Summarizing...</p>}
                {summaries[item.guid] && <p className="text-gray-600">{summaries[item.guid]}</p>}
              </div>
            )}
          </li>
        ))}
      </ul>
    );
  };
  
  return (
    <section className="mt-6 border-t border-gray-200 pt-6">
      <h2 className="text-lg font-semibold text-gray-600 mb-4">Aggregated Financial News</h2>
      <div className="h-96 bg-gray-100 border border-gray-200 rounded-lg p-3 overflow-y-auto custom-scrollbar">
        {renderContent()}
      </div>
    </section>
  );
};

export default NewsAggregatorWidget;