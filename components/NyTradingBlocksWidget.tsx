import React from 'react';
import TimeBlock from './TimeBlock';
import { TimeBlockData } from '../types';

interface NyTradingBlocksWidgetProps {
  title: string;
  blocks: TimeBlockData[];
  now: Date;
}

const NyTradingBlocksWidget: React.FC<NyTradingBlocksWidgetProps> = ({ title, blocks, now }) => {
  return (
    <section>
      <h2 className="text-lg font-semibold text-gray-600 mb-4">{title}</h2>
      <div className="space-y-3">
        {blocks.map((block) => (
          <TimeBlock key={`${title}-${block.id}`} data={block} now={now} />
        ))}
      </div>
    </section>
  );
};

export default NyTradingBlocksWidget;