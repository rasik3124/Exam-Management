// src/components/RoomBuilder.jsx
import React, { useState, useEffect, useCallback } from 'react';
import { gsap } from 'gsap';
import ControlPanel from './ControlPanel/ControlPanel';
import VisualRoom from './VisualRoom/VisualRoom';
import { useParams, useSearchParams } from 'react-router-dom';

/**
 * Main RoomBuilder component that orchestrates the entire room building interface
 * Manages room configuration, benches state, and coordinates between control panel and visual room
 */
const RoomBuilder = () => {
  // Room configuration state
  const { examId } = useParams()
  const [ params ] = useSearchParams()
  const editRoomId = params.get("edit")
  const storageKey_RB = `roomBuilder_${examId}`
  const storageKey = `rooms_${examId}`
  const [roomConfig, setRoomConfig] = useState({
    roomName: '',
    rows: 4,
    cols: 5,
    benchCapacity: 3
  });

  // Benches array to track placed benches
  const [benches, setBenches] = useState([]);
  const [nextBenchId, setNextBenchId] = useState(1);
  const [isPanelExpanded, setIsPanelExpanded] = useState(false);

  // Calculate derived values
  const totalBenches = benches.length;
  const totalRoomCapacity = totalBenches * roomConfig.benchCapacity;
  const maxBenches = roomConfig.rows * roomConfig.cols;

  // Initialize from localStorage on mount
  useEffect(() => {
    const savedLayout = localStorage.getItem(storageKey_RB);
    if (savedLayout) {
      try {
        const { roomConfig: savedConfig, benches: savedBenches, nextId } = JSON.parse(savedLayout);
        setRoomConfig(savedConfig);
        setBenches(savedBenches);
        setNextBenchId(nextId || savedBenches.length + 1);
      } catch (error) {
        console.error('Failed to load saved layout:', error);
      }
    }
  }, []);

  // Save to localStorage when layout changes
  useEffect(() => {
      const layoutData = {
        roomConfig,
        benches,
        nextId: nextBenchId
      };
      localStorage.setItem(storageKey_RB, JSON.stringify(layoutData));
    }, [roomConfig, benches, nextBenchId]);

    //Edit Room
    useEffect(() => {
    if (!editRoomId) return;

    const rooms = JSON.parse(localStorage.getItem(storageKey) || "[]");
    const room = rooms.find(r => r.id === editRoomId);

    if (!room) {
      alert("⚠️ Room not found");
      return;
    }

    setRoomConfig(room.layout.roomConfig);
    setBenches(room.layout.benches);
    setNextBenchId(room.layout.benches.length + 1);

  }, [editRoomId, storageKey]);

  /**
   * Add a new bench to the next available grid slot
   * Uses row-major order to find first empty position
   */
  const addBench = useCallback(() => {
    if (totalBenches >= maxBenches) return;

    // Find first available slot in row-major order
    const occupiedPositions = new Set(benches.map(bench => `${bench.row},${bench.col}`));
    let newRow = 0;
    let newCol = 0;
    let found = false;

    for (let row = 0; row < roomConfig.rows && !found; row++) {
      for (let col = 0; col < roomConfig.cols && !found; col++) {
        if (!occupiedPositions.has(`${row},${col}`)) {
          newRow = row;
          newCol = col;
          found = true;
        }
      }
    }

    if (found) {
      const newBench = {
        id: `b${nextBenchId}`,
        row: newRow,
        col: newCol,
        capacity: roomConfig.benchCapacity,
        createdAt: Date.now()
      };

      setBenches(prev => [...prev, newBench]);
      setNextBenchId(prev => prev + 1);
    }
  }, [totalBenches, maxBenches, benches, roomConfig, nextBenchId]);

  /**
   * Remove a bench by ID with cleanup
   */
  const removeBench = useCallback((benchId) => {
    setBenches(prev => prev.filter(bench => bench.id !== benchId));
  }, []);

  /**
   * Update bench capacity for all benches
   */
  const setBenchCapacity = useCallback((capacity) => {
    const newCapacity = Math.max(1, Math.min(5, capacity));
    setRoomConfig(prev => ({ ...prev, benchCapacity: newCapacity }));
    
    // Update capacity for all existing benches
    setBenches(prev => prev.map(bench => ({
      ...bench,
      capacity: newCapacity
    })));
  }, []);

  /**
   * Update rows and columns, removing benches that fall outside new bounds
   */
  const setRowsCols = useCallback((rows, cols) => {
    const newRows = Math.max(1, Math.min(10, rows));
    const newCols = Math.max(1, Math.min(10, cols));

    setRoomConfig(prev => ({ ...prev, rows: newRows, cols: newCols }));

    // Remove benches that are outside new grid boundaries
    setBenches(prev => prev.filter(bench => 
      bench.row < newRows && bench.col < newCols
    ));
  }, []);

  /**
   * Reset the entire scene to initial state
   */
  const resetScene = useCallback(() => {
    setRoomConfig({
      roomName: '',
      rows: 4,
      cols: 5,
      benchCapacity: 3
    });
    setBenches([]);
    setNextBenchId(1);
  }, []);

  /**
   * Export current layout as JSON file
   */
  const exportToJSON = useCallback(() => {
    const data = {
      roomConfig,
      benches,
      exportedAt: new Date().toISOString()
    };

    const blob = new Blob([JSON.stringify(data, null, 2)], { type: "application/json" });
    const link = document.createElement("a");

    link.href = URL.createObjectURL(blob);
    link.download = `${roomConfig.roomName || "room"}.json`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  },[roomConfig, benches]);

  const saveRoomToSession = useCallback(() => {
    if (!roomConfig.roomName.trim()) {
      alert("⚠️ Enter room name");
      return;
    }

    const roomId = editRoomId || Date.now().toString();

    const room = {
      id: roomId,
      name: roomConfig.roomName,
      capacity: benches.length * roomConfig.benchCapacity,
      layout: {
        roomConfig,
        benches
      },
      updatedAt: new Date().toISOString()
    };

    const existing = JSON.parse(localStorage.getItem(storageKey) || "[]");

    const updated = editRoomId
      ? existing.map(r => (r.id === roomId ? room : r))
      : [...existing, room];

    localStorage.setItem(storageKey, JSON.stringify(updated));

    alert("✅ Room saved successfully!");

  }, [roomConfig, benches, editRoomId, storageKey]);

  return (
    <div className=" min-w-screen flex flex-col md:flex-row h-screen bg-gray-50 overflow-hidden">

      <ControlPanel
        roomConfig={roomConfig}
        totalBenches={totalBenches}
        totalRoomCapacity={totalRoomCapacity}
        maxBenches={maxBenches}
        onRoomConfigChange={setRoomConfig}
        onBenchCapacityChange={setBenchCapacity}
        onRowsColsChange={setRowsCols}
        onAddBench={addBench}
        onResetScene={resetScene}
        onSaveSession={saveRoomToSession}
        onExportJSON={exportToJSON}
        isExpanded={isPanelExpanded}
        onToggleExpand={() => setIsPanelExpanded(!isPanelExpanded)}
      />

      
      <VisualRoom
        roomConfig={roomConfig}
        benches={benches}
        onAddBench={addBench}
        onRemoveBench={removeBench}
        isPanelExpanded={isPanelExpanded}
        mode="builder"
      />
    </div>
  );
};

export default RoomBuilder;