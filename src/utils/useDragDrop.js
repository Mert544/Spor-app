import { useState, useRef, useCallback, useEffect } from 'react';

export function useDragDrop({ items, onReorder, threshold = 20 }) {
  const [draggingId, setDraggingId] = useState(null);
  const [dragOffset, setDragOffset] = useState(0);
  const [dragItems, setDragItems] = useState(items);
  const dragRef = useRef(null);
  const startY = useRef(0);
  const currentY = useRef(0);

  useEffect(() => {
    setDragItems(items);
  }, [items]);

  const handleTouchStart = useCallback((e, id) => {
    const touch = e.touches[0];
    startY.current = touch.clientY;
    currentY.current = touch.clientY;
    setDraggingId(id);
    setDragOffset(0);
  }, []);

  const handleTouchMove = useCallback((e) => {
    if (!draggingId) return;
    const touch = e.touches[0];
    currentY.current = touch.clientY;
    const delta = touch.clientY - startY.current;
    setDragOffset(delta);

    const dragIndex = dragItems.findIndex(item => item.id === draggingId);
    const itemHeight = 64;
    const newIndex = Math.max(0, Math.min(dragItems.length - 1, dragIndex + Math.round(delta / itemHeight)));

    if (newIndex !== dragIndex) {
      const newItems = [...dragItems];
      const [removed] = newItems.splice(dragIndex, 1);
      newItems.splice(newIndex, 0, removed);
      setDragItems(newItems);
      startY.current = touch.clientY;
    }
  }, [draggingId, dragItems]);

  const handleTouchEnd = useCallback(() => {
    if (!draggingId) return;
    const dragIndex = dragItems.findIndex(item => item.id === draggingId);
    if (Math.abs(dragOffset) > threshold && dragIndex !== items.findIndex(i => i.id === draggingId)) {
      onReorder(dragItems);
    }
    setDraggingId(null);
    setDragOffset(0);
    setDragItems(items);
  }, [draggingId, dragOffset, dragItems, items, onReorder, threshold]);

  return {
    dragItems,
    draggingId,
    dragOffset,
    handlers: {
      onTouchStart: (e, id) => handleTouchStart(e, id),
      onTouchMove: handleTouchMove,
      onTouchEnd: handleTouchEnd,
    },
  };
}

export function SortableItem({ children, id, draggingId, dragOffset, style }) {
  const isDragging = id === draggingId;
  return (
    <div
      style={{
        ...style,
        transform: isDragging ? 	ranslateY(px) : undefined,
        opacity: isDragging ? 0.8 : 1,
        transition: isDragging ? 'none' : 'transform 0.2s ease',
        zIndex: isDragging ? 100 : 1,
      }}
    >
      {children}
    </div>
  );
}
