// RoomCard.jsx
import React, { useState } from 'react';

const RoomCard = ({ room, isSelected, onSelect, onEdit, onDelete }) => {
  const [isHovered, setIsHovered] = useState(false);

  return (
    <div
      className={`relative bg-white/70 backdrop-blur-md rounded-xl border transition-all duration-300 cursor-pointer
        ${isSelected ? 'border-blue-500 ring-2 ring-blue-200' : 'border-gray-200'}
        ${isHovered ? 'shadow-lg' : 'shadow-sm'}
      `}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      onClick={onSelect}
    >
      {/* Card Content */}
      <div className="p-4">
        <h3 className="font-semibold text-gray-800 text-lg">{room.name}</h3>
        <p className="text-sm text-gray-600 mt-1">
          Capacity: {room.capacity} • Seats: {room.seats || room.capacity}
        </p>
      </div>

      {/* Expandable Panel */}
      <div
        className={`overflow-hidden transition-all duration-300 ease-in-out
          ${isHovered ? 'max-h-20 opacity-100' : 'max-h-0 opacity-0'}
        `}
      >
        <div className="px-4 pb-3 pt-1 border-t border-gray-200/50">
          <div className="flex space-x-2">
            <button
              onClick={(e) => {
                e.stopPropagation();
                onEdit();
              }}
              className="flex-1 bg-blue-500 hover:bg-blue-600 text-gray-900 py-1.5 px-3 rounded-lg text-xs font-medium transition-colors"
            >
              Edit Layout
            </button>
            <button
              onClick={(e) => {
                e.stopPropagation();
                onDelete();
              }}
              className="flex-1 bg-red-500 hover:bg-red-600 text-gray-900 py-1.5 px-3 rounded-lg text-xs font-medium transition-colors"
            >
              Delete
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RoomCard;