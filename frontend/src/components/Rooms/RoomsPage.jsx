import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import RoomCard from './RoomCard';
import RoomPreview from './RoomPreview';
import RoomStats from './RoomStats';
import { layoutJsonToRoom } from '../../utils/roomHelpers';
import { useParams } from 'react-router-dom';

// 🔹 Get exam title from localStorage
const getExamTitle = (examId) => {
  try {
    const exams = JSON.parse(localStorage.getItem("exams")) || [];
    const exam = exams.find(e => e.id === examId);
    return exam?.name || "Exam";
  } catch {
    return "Exam";
  }
};

const RoomsPage = () => {
  const { examId } = useParams();
  const storageKey = `rooms_${examId}`
  const [rooms, setRooms] = useState([]);
  const [selectedRoomId, setSelectedRoomId] = useState(null);
  const navigate = useNavigate();
  const examTitle = getExamTitle(examId);


  useEffect(() => {
    loadRooms();
    window.addEventListener("storage", loadRooms);
    return () => window.removeEventListener("storage", loadRooms);
  }, []);

  const loadRooms = () => {
    const saved = JSON.parse(localStorage.getItem(storageKey)) || [];
    setRooms(saved);

    // selection cleanup
    if (selectedRoomId && !saved.find(r => r.id === selectedRoomId)) {
      setSelectedRoomId(null);
    }
  };

  const handleCreateRoom = () => navigate(`/room-builder/${examId}`);

  const handleImportRooms = async (event) => {
    const file = event.target.files[0];
    if (!file) return;

    try {
      const text = await file.text();
      const json = JSON.parse(text);

      const existingRooms = JSON.parse(localStorage.getItem(storageKey) || '[]');

      let newRooms = [];

      // Case 1: file is a SINGLE layout like the JSON you sent 
      if (json.roomConfig && json.benches) {
        const room = layoutJsonToRoom(json);
        newRooms = [...existingRooms, room];
      }
      // Case 2: maybe later you export a whole ROOM LIBRARY file
      else if (Array.isArray(json)) {
        // If array already in room format, push directly
        if (json.length > 0 && json[0].layout && json[0].layout.roomConfig) {
          newRooms = [...existingRooms, ...json];
        } 
        // Or if it's array of raw {roomConfig, benches}
        else if (json.length > 0 && json[0].roomConfig && json[0].benches) {
          const converted = json.map((layout) => layoutJsonToRoom(layout));
          newRooms = [...existingRooms, ...converted];
        }
      } else {
        console.error('Unknown JSON structure for rooms import');
        return;
      }

      localStorage.setItem(storageKey, JSON.stringify(newRooms));
      setRooms(newRooms);
      event.target.value = ''; // reset input

    } catch (error) {
      console.error('Failed to import rooms:', error);
    }
  };

  const handleDeleteRoom = (roomId) => {
    const updated = rooms.filter(room => room.id !== roomId);
    localStorage.setItem(storageKey, JSON.stringify(updated));
    setRooms(updated);

    if (selectedRoomId === roomId) setSelectedRoomId(null);
  };

  const handleEditRoom = (roomId) => navigate(`/room-builder/${examId}?edit=${roomId}`);


  const selectedRoom = rooms.find(r => r.id === selectedRoomId);

  return (
    <div className="h-screen flex flex-col bg-gradient-to-br from-[#06091e] via to-[#26667c]">

      {/* HEADER */}
      <header className="bg-black/30 backdrop-blur-md border-b border-white/10 px-4 py-1 flex justify-between items-center">

        <h1 className="text-xl font-bold text-slate-200">
          Rooms · {examTitle} 
        </h1>

        <div className="flex space-x-3">
          <RoomStats rooms={rooms} />

          <button
            onClick={() => navigate(`/atomicdash/${examId}`)}
            className="bg-emerald-500 hover:bg-emerald-600 text-slate-700 px-2 py-1 rounded-lg text-sm font-medium transition"
          >
            Atomic Dashboard →
          </button>
        </div>

      </header>


      {/* BODY */}
      <div className="flex flex-1 overflow-hidden h-full">

        {/* LEFT PANEL */}
        <div className="w-[20%] bg-black/30 border-r border-white/10 flex flex-col">

          <div className="p-4 border-b border-white/10 space-y-2">
            <button
              onClick={handleCreateRoom} 
              className="w-full bg-cyan-500 hover:bg-blue-700 text- py-2 rounded-lg"
            >
              + Create Room
            </button>

            <label className="block">
              <input type="file" accept=".json" onChange={handleImportRooms} className="hidden" />
              <div className="w-full bg-white/10 hover:bg-white/20 text-white py-2 rounded-lg text-center cursor-pointer">
                Import Rooms (JSON)
              </div>
            </label>
          </div>

          <div className="flex-1 overflow-y-auto p-4 space-y-3">
            {rooms.length === 0 && (
              <div className="text-center text-gray-300 py-8">
                No rooms created yet
              </div>
            )}

            {rooms.map(room => (
              <RoomCard
                key={room.id}
                room={room}
                isSelected={room.id === selectedRoomId}
                onSelect={() => setSelectedRoomId(room.id)}
                onEdit={() => handleEditRoom(room.id)}
                onDelete={() => handleDeleteRoom(room.id)}
              />
            ))}
          </div>
        </div>

        {/* RIGHT PANEL */}
        <div className="w-[80%] bg-black/10 h-full flex">
          <RoomPreview room={selectedRoom} />
        </div>

      </div>
    </div>
  );
};

export default RoomsPage;
