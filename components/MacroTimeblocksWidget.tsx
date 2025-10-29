import React from 'react';
import TimeBlock from './TimeBlock';
import { TimeBlockData } from '../types';

interface MacroTimeblocksWidgetProps {
  title: string;
  blocks: TimeBlockData[];
  now: Date;
}

const MacroTimeblocksWidget: React.FC<MacroTimeblocksWidgetProps> = ({ title, blocks, now }) => {
  return (
    <section>
      <h2 className="text-lg font-semibold text-gray-600 mb-4">{title}</h2>
      <div className="space-y-2">
        {blocks.map((block) => (
          <TimeBlock key={block.id} data={block} now={now} isCompact={true} />
        ))}
      </div>
    </section>
  );
};

export default MacroTimeblocksWidget;