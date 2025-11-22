// src/hooks/useGridPositions.js
import { useMemo } from 'react';

/**
 * Custom hook for calculating grid positions and available slots
 */
export const useGridPositions = (benches, rows, cols) => {
  const gridData = useMemo(() => {
    // Create grid representation
    const grid = Array(rows).fill().map(() => Array(cols).fill(false));
    const occupiedPositions = new Set();
    
    // Mark occupied positions
    benches.forEach(bench => {
      if (bench.row < rows && bench.col < cols) {
        grid[bench.row][bench.col] = true;
        occupiedPositions.add(`${bench.row},${bench.col}`);
      }
    });

    // Find next available slot (row-major order)
    let nextAvailableSlot = null;
    for (let row = 0; row < rows && !nextAvailableSlot; row++) {
      for (let col = 0; col < cols && !nextAvailableSlot; col++) {
        if (!grid[row][col]) {
          nextAvailableSlot = { row, col };
        }
      }
    }

    // Calculate grid metrics
    const totalSlots = rows * cols;
    const occupiedSlots = benches.filter(bench => 
      bench.row < rows && bench.col < cols
    ).length;
    const availableSlots = totalSlots - occupiedSlots;

    return {
      grid,
      occupiedPositions,
      nextAvailableSlot,
      totalSlots,
      occupiedSlots,
      availableSlots,
      isGridFull: availableSlots === 0
    };
  }, [benches, rows, cols]);

  return gridData;
};

export default useGridPositions;