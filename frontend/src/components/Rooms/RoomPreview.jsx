// RoomPreview.jsx
import React from 'react';
import RoomPreviewAdapter from "./RoomPreviewAdapter";

// This will be replaced with the actual 3D preview component
const RoomPreview3D = ( layout ) => {
  return (
    <div className="w-full h-full bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center">
      <div className="text-center">
        <div className="text-6xl mb-4">🏢</div>
        <p className="text-gray-600">3D Preview for layout</p>
        <p className="text-sm text-gray-500 mt-2">Seats: {layout?.seats || 0}</p>
      </div>
    </div>
  );
};

const RoomPreview = ({ room }) => {
  if (!room) {
    return (
      <div className="h-full w-full flex items-center justify-center">
        <div className="text-center text-gray-500">
          <div className="text-6xl mb-4">👈</div>
          <h3 className="text-xl font-medium mb-2">Select a Room</h3>
          <p>Choose a room from the left to preview</p>
        </div>
      </div>
    );
  }

  return (
    <div className="h-full w-full flex flex-col">
      {/* 3D Preview Container */}
      <div className="flex-1 relative h-full w-full overflow-hidden">
        <RoomPreviewAdapter layout={room.layout} />
      </div>
    </div>
  );
};

export default RoomPreview;