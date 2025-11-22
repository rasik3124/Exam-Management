// src/components/RoomBuilder.jsx
import React, { useState, useEffect, useCallback } from 'react';
import { gsap } from 'gsap';
import ControlPanel from './ControlPanel/ControlPanel';
import VisualRoom from './VisualRoom/VisualRoom';

/**
 * Main RoomBuilder component that orchestrates the entire room building interface
 * Manages room configuration, benches state, and coordinates between control panel and visual room
 */
const RoomBuilder = () => {
  // Room configuration state
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
    const savedLayout = localStorage.getItem('roomBuilderLayout');
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
    localStorage.setItem('roomBuilderLayout', JSON.stringify(layoutData));
  }, [roomConfig, benches, nextBenchId]);

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
  const exportLayout = useCallback(() => {
    const layoutData = {
      roomConfig,
      benches,
      exportedAt: new Date().toISOString()
    };

    const dataStr = JSON.stringify(layoutData, null, 2);
    const dataBlob = new Blob([dataStr], { type: 'application/json' });
    
    const link = document.createElement('a');
    link.href = URL.createObjectURL(dataBlob);
    link.download = `${roomConfig.roomName || 'room'}-layout.json`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  }, [roomConfig, benches]);

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
        onExportLayout={exportLayout}
        isExpanded={isPanelExpanded}
        onToggleExpand={() => setIsPanelExpanded(!isPanelExpanded)}
      />
      
      <VisualRoom
        roomConfig={roomConfig}
        benches={benches}
        onAddBench={addBench}
        onRemoveBench={removeBench}
        isPanelExpanded={isPanelExpanded}
      />
    </div>
  );
};

export default RoomBuilder;