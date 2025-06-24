"use client";
import React, { useState } from 'react';
import { Rnd } from 'react-rnd';
import './ResizeableTable.css';

const ResizableTable = () => {
  const [cells, setCells] = useState([
    { id: 'a1', content: 'Cell A1', width: 100, height: 60 },
    { id: 'a2', content: 'Cell A2', width: 100, height: 60 },
    { id: 'b1', content: 'Cell B1', width: 100, height: 60 },
    { id: 'b2', content: 'Cell B2', width: 100, height: 60 },
  ]);

  const handleResize = (index, ref) => {
    const newCells = [...cells];
    newCells[index].width = parseInt(ref.style.width, 10);
    newCells[index].height = parseInt(ref.style.height, 10);
    setCells(newCells);
  };

  return (
    <div className="table-grid">
      {cells.map((cell, index) => (
        <Rnd
          key={cell.id}
          size={{ width: cell.width, height: cell.height }}
          enableResizing
          disableDragging
          onResizeStop={(e, direction, ref) => handleResize(index, ref)}
          className="resizable-cell"
        >
          {cell.content}
        </Rnd>
      ))}
    </div>
  );
};

export default ResizableTable;