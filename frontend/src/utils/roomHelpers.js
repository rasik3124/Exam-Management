// utils/roomHelpers.js
export function layoutJsonToRoom(layoutJson, idOverride) {
  const { roomConfig, benches } = layoutJson;

  const capacity = (benches?.length || 0) * (roomConfig?.benchCapacity || 1);

  return {
    id: idOverride || `room-${Date.now()}`,
    name: roomConfig?.roomName || 'Untitled Room',
    capacity,
    layout: {
      roomConfig,
      benches,
    },
  };
}
