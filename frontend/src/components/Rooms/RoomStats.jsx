// RoomStats.jsx
import React from 'react';

const RoomStats = ({ rooms }) => {
  const totalRooms = rooms.length;
  const totalCapacity = rooms.reduce((sum, room) => sum + (room.capacity || 0), 0);

  return (
    <div className="flex space-x-3">
      <div className="bg-blue-100 text-blue-800 px-3 py-1.5 rounded-full text-sm font-medium">
        Total Rooms: {totalRooms}
      </div>
      <div className="bg-green-100 text-green-800 px-3 py-1.5 rounded-full text-sm font-medium">
        Total Capacity: {totalCapacity}
      </div>
    </div>
  );
};

export default RoomStats;