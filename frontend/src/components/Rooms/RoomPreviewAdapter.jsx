// src/components/Rooms/RoomPreviewAdapter.jsx
import React from 'react';
import VisualRoom from '../VisualRoom/VisualRoom';

const RoomPreviewAdapter = ({ layout }) => {
  if (!layout) {
    return (
      <div className="h-full flex items-center justify-center text-white/60">
        No layout data available
      </div>
    );
  }

  return (
    <div className="absolute inset-0">
      <VisualRoom
        roomConfig={layout.roomConfig}
        benches={layout.benches}
        isPanelExpanded={false}
        mode="preview"        // 🔥 preview mode
        onAddBench={() => {}} // no-op in preview
        onRemoveBench={() => {}}
      />
    </div>
  );
};

export default RoomPreviewAdapter;
