// Fix: Implement the main App component to resolve module and rendering errors.
import React from 'react';
import Header from './components/Header';
import NyTradingBlocksWidget from './components/NyTradingBlocksWidget';
import MacroTimeblocksWidget from './components/MacroTimeblocksWidget';
import EconomicCalendarWidget from './components/EconomicCalendarWidget';
import NewsAggregatorWidget from './components/NewsAggregatorWidget';
import { useCurrentTime } from './hooks/useCurrentTime';
import { NY_TRADING_BLOCKS, MACRO_TIMEBLOCKS } from './constants';

function App() {
  const now = useCurrentTime();

  return (
    <div className="bg-gray-50 min-h-screen font-sans">
      <main className="max-w-7xl p-4 sm:p-6 lg:p-8">
        <Header now={now} />
        <div className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-6">
          <NyTradingBlocksWidget
            title="NY Trading Blocks"
            blocks={NY_TRADING_BLOCKS}
            now={now}
          />
          <MacroTimeblocksWidget
            title="Macro Timeblocks"
            blocks={MACRO_TIMEBLOCKS}
            now={now}
          />
        </div>
        <NewsAggregatorWidget />
        <EconomicCalendarWidget />
      </main>
    </div>
  );
}

export default App;