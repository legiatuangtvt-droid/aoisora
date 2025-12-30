'use client';

import { useState, useRef, useEffect, useCallback } from 'react';
import {
  Square,
  Circle,
  Type,
  Eraser,
  Highlighter,
  ArrowRight,
  MousePointer,
  Trash2,
  Undo,
  Redo,
  Download,
  X,
  Check,
} from 'lucide-react';
import { Annotation } from '@/types/api';

interface ImageEditorProps {
  imageUrl: string;
  annotations: Annotation[];
  onSave: (annotations: Annotation[]) => void;
  onClose: () => void;
}

type Tool = 'select' | 'rectangle' | 'circle' | 'text' | 'arrow' | 'blur' | 'highlight';

interface DrawingState {
  isDrawing: boolean;
  startX: number;
  startY: number;
  currentX: number;
  currentY: number;
}

const COLORS = ['#FF0000', '#00FF00', '#0000FF', '#FFFF00', '#FF00FF', '#00FFFF', '#FFA500', '#000000', '#FFFFFF'];

export default function ImageEditor({ imageUrl, annotations: initialAnnotations, onSave, onClose }: ImageEditorProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const overlayCanvasRef = useRef<HTMLCanvasElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const imageRef = useRef<HTMLImageElement | null>(null);

  const [tool, setTool] = useState<Tool>('select');
  const [color, setColor] = useState('#FF0000');
  const [strokeWidth, setStrokeWidth] = useState(3);
  const [annotations, setAnnotations] = useState<Annotation[]>(initialAnnotations);
  const [selectedIndex, setSelectedIndex] = useState<number | null>(null);
  const [history, setHistory] = useState<Annotation[][]>([initialAnnotations]);
  const [historyIndex, setHistoryIndex] = useState(0);

  const [drawing, setDrawing] = useState<DrawingState>({
    isDrawing: false,
    startX: 0,
    startY: 0,
    currentX: 0,
    currentY: 0,
  });

  const [textInput, setTextInput] = useState({ show: false, x: 0, y: 0, text: '' });

  // Load image and setup canvas
  useEffect(() => {
    const img = new Image();
    img.crossOrigin = 'anonymous';
    img.onload = () => {
      imageRef.current = img;
      const canvas = canvasRef.current;
      const overlay = overlayCanvasRef.current;
      if (canvas && overlay) {
        // Set canvas size to match image aspect ratio
        const maxWidth = containerRef.current?.clientWidth || 800;
        const maxHeight = containerRef.current?.clientHeight || 600;
        const scale = Math.min(maxWidth / img.width, maxHeight / img.height);

        canvas.width = img.width * scale;
        canvas.height = img.height * scale;
        overlay.width = canvas.width;
        overlay.height = canvas.height;

        redrawCanvas();
      }
    };
    img.src = imageUrl;
  }, [imageUrl]);

  // Redraw canvas whenever annotations change
  useEffect(() => {
    redrawCanvas();
  }, [annotations, selectedIndex]);

  const redrawCanvas = useCallback(() => {
    const canvas = canvasRef.current;
    const ctx = canvas?.getContext('2d');
    const img = imageRef.current;

    if (!canvas || !ctx || !img) return;

    // Clear and draw image
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.drawImage(img, 0, 0, canvas.width, canvas.height);

    // Draw annotations
    annotations.forEach((ann, index) => {
      const isSelected = index === selectedIndex;
      drawAnnotation(ctx, ann, canvas.width, canvas.height, isSelected);
    });
  }, [annotations, selectedIndex]);

  const drawAnnotation = (
    ctx: CanvasRenderingContext2D,
    ann: Annotation,
    canvasWidth: number,
    canvasHeight: number,
    isSelected: boolean
  ) => {
    // For arrow: x, y = start point; width, height = end point (stored as percentages)
    // For others: x, y = top-left; width, height = size
    const x = (ann.x || 0) * canvasWidth / 100;
    const y = (ann.y || 0) * canvasHeight / 100;
    const width = (ann.width || 0) * canvasWidth / 100;
    const height = (ann.height || 0) * canvasHeight / 100;

    ctx.save();

    switch (ann.type) {
      case 'rectangle':
        ctx.strokeStyle = ann.color || '#FF0000';
        ctx.lineWidth = ann.stroke_width || 3;
        ctx.strokeRect(x, y, width, height);
        if (ann.fill_color) {
          ctx.fillStyle = ann.fill_color;
          ctx.fillRect(x, y, width, height);
        }
        break;

      case 'circle':
        ctx.strokeStyle = ann.color || '#FF0000';
        ctx.lineWidth = ann.stroke_width || 3;
        ctx.beginPath();
        ctx.ellipse(x + width / 2, y + height / 2, Math.abs(width / 2), Math.abs(height / 2), 0, 0, 2 * Math.PI);
        ctx.stroke();
        if (ann.fill_color) {
          ctx.fillStyle = ann.fill_color;
          ctx.fill();
        }
        break;

      case 'text':
        ctx.font = `${ann.font_size || 16}px Arial`;
        ctx.fillStyle = ann.color || '#FF0000';
        ctx.fillText(ann.text || '', x, y);
        break;

      case 'arrow': {
        // For arrow: x,y = start; width,height = end coordinates (not size!)
        const startX = x;
        const startY = y;
        const endX = width;  // width stores endX coordinate
        const endY = height; // height stores endY coordinate

        ctx.strokeStyle = ann.color || '#FF0000';
        ctx.lineWidth = ann.stroke_width || 3;
        ctx.fillStyle = ann.color || '#FF0000';

        // Draw line from start to end
        ctx.beginPath();
        ctx.moveTo(startX, startY);
        ctx.lineTo(endX, endY);
        ctx.stroke();

        // Draw arrowhead at end point
        const angle = Math.atan2(endY - startY, endX - startX);
        const headLength = 15 + (ann.stroke_width || 3) * 2;
        ctx.beginPath();
        ctx.moveTo(endX, endY);
        ctx.lineTo(
          endX - headLength * Math.cos(angle - Math.PI / 6),
          endY - headLength * Math.sin(angle - Math.PI / 6)
        );
        ctx.lineTo(
          endX - headLength * Math.cos(angle + Math.PI / 6),
          endY - headLength * Math.sin(angle + Math.PI / 6)
        );
        ctx.closePath();
        ctx.fill();

        // Draw selection for arrow
        if (isSelected) {
          ctx.strokeStyle = '#0066FF';
          ctx.lineWidth = 2;
          ctx.setLineDash([5, 5]);
          // Draw circles at start and end points
          const handleSize = 8;
          ctx.fillStyle = '#0066FF';
          ctx.beginPath();
          ctx.arc(startX, startY, handleSize, 0, 2 * Math.PI);
          ctx.fill();
          ctx.beginPath();
          ctx.arc(endX, endY, handleSize, 0, 2 * Math.PI);
          ctx.fill();
          ctx.setLineDash([]);
        }
        break;
      }

      case 'blur':
        // Simulate blur with semi-transparent overlay
        ctx.fillStyle = 'rgba(128, 128, 128, 0.7)';
        ctx.fillRect(x, y, width, height);
        break;

      case 'highlight':
        ctx.fillStyle = 'rgba(255, 255, 0, 0.3)';
        ctx.fillRect(x, y, width, height);
        break;
    }

    // Draw selection handles (for non-arrow types)
    if (isSelected && ann.type !== 'text' && ann.type !== 'arrow') {
      ctx.strokeStyle = '#0066FF';
      ctx.lineWidth = 2;
      ctx.setLineDash([5, 5]);
      ctx.strokeRect(x - 2, y - 2, width + 4, height + 4);
      ctx.setLineDash([]);

      // Corner handles
      const handleSize = 8;
      ctx.fillStyle = '#0066FF';
      ctx.fillRect(x - handleSize / 2, y - handleSize / 2, handleSize, handleSize);
      ctx.fillRect(x + width - handleSize / 2, y - handleSize / 2, handleSize, handleSize);
      ctx.fillRect(x - handleSize / 2, y + height - handleSize / 2, handleSize, handleSize);
      ctx.fillRect(x + width - handleSize / 2, y + height - handleSize / 2, handleSize, handleSize);
    }

    ctx.restore();
  };

  const getCanvasCoords = (e: React.MouseEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current;
    if (!canvas) return { x: 0, y: 0 };

    const rect = canvas.getBoundingClientRect();
    const x = ((e.clientX - rect.left) / canvas.width) * 100;
    const y = ((e.clientY - rect.top) / canvas.height) * 100;
    return { x, y };
  };

  const handleMouseDown = (e: React.MouseEvent<HTMLCanvasElement>) => {
    const { x, y } = getCanvasCoords(e);

    if (tool === 'select') {
      // Check if clicking on existing annotation
      const clickedIndex = annotations.findIndex((ann) => {
        const ax = ann.x || 0;
        const ay = ann.y || 0;
        const aw = ann.width || 0;
        const ah = ann.height || 0;
        return x >= ax && x <= ax + aw && y >= ay && y <= ay + ah;
      });
      setSelectedIndex(clickedIndex >= 0 ? clickedIndex : null);
      return;
    }

    if (tool === 'text') {
      setTextInput({ show: true, x, y, text: '' });
      return;
    }

    setDrawing({
      isDrawing: true,
      startX: x,
      startY: y,
      currentX: x,
      currentY: y,
    });
  };

  const handleMouseMove = (e: React.MouseEvent<HTMLCanvasElement>) => {
    if (!drawing.isDrawing) return;

    const { x, y } = getCanvasCoords(e);
    setDrawing((prev) => ({ ...prev, currentX: x, currentY: y }));

    // Draw preview on overlay canvas
    const overlay = overlayCanvasRef.current;
    const ctx = overlay?.getContext('2d');
    if (!overlay || !ctx) return;

    ctx.clearRect(0, 0, overlay.width, overlay.height);

    let previewAnn: Annotation;

    if (tool === 'arrow') {
      // For arrow: store start and end coordinates directly
      previewAnn = {
        type: 'arrow',
        x: drawing.startX,
        y: drawing.startY,
        width: x,   // endX stored in width
        height: y,  // endY stored in height
        color,
        stroke_width: strokeWidth,
      };
    } else {
      // For other shapes: store top-left and size
      previewAnn = {
        type: tool as any,
        x: Math.min(drawing.startX, x),
        y: Math.min(drawing.startY, y),
        width: Math.abs(x - drawing.startX),
        height: Math.abs(y - drawing.startY),
        color,
        stroke_width: strokeWidth,
      };
    }

    drawAnnotation(ctx, previewAnn, overlay.width, overlay.height, false);
  };

  const handleMouseUp = () => {
    if (!drawing.isDrawing) return;

    const overlay = overlayCanvasRef.current;
    const ctx = overlay?.getContext('2d');
    if (ctx && overlay) {
      ctx.clearRect(0, 0, overlay.width, overlay.height);
    }

    let newAnnotation: Annotation;

    if (tool === 'arrow') {
      // For arrow: store start (x, y) and end (width, height) coordinates
      newAnnotation = {
        type: 'arrow',
        x: drawing.startX,
        y: drawing.startY,
        width: drawing.currentX,   // endX
        height: drawing.currentY,  // endY
        color,
        stroke_width: strokeWidth,
      };

      // Only add if arrow length is significant
      const length = Math.sqrt(
        Math.pow(drawing.currentX - drawing.startX, 2) +
        Math.pow(drawing.currentY - drawing.startY, 2)
      );
      if (length > 2) {
        addAnnotation(newAnnotation);
      }
    } else {
      // For other shapes: store top-left and size
      newAnnotation = {
        type: tool as any,
        x: Math.min(drawing.startX, drawing.currentX),
        y: Math.min(drawing.startY, drawing.currentY),
        width: Math.abs(drawing.currentX - drawing.startX),
        height: Math.abs(drawing.currentY - drawing.startY),
        color,
        stroke_width: strokeWidth,
      };

      // Only add if size is significant
      if ((newAnnotation.width || 0) > 1 && (newAnnotation.height || 0) > 1) {
        addAnnotation(newAnnotation);
      }
    }

    setDrawing({
      isDrawing: false,
      startX: 0,
      startY: 0,
      currentX: 0,
      currentY: 0,
    });
  };

  const addAnnotation = (ann: Annotation) => {
    const newAnnotations = [...annotations, ann];
    setAnnotations(newAnnotations);
    addToHistory(newAnnotations);
  };

  const addToHistory = (newAnnotations: Annotation[]) => {
    const newHistory = history.slice(0, historyIndex + 1);
    newHistory.push(newAnnotations);
    setHistory(newHistory);
    setHistoryIndex(newHistory.length - 1);
  };

  const handleTextSubmit = () => {
    if (textInput.text.trim()) {
      const newAnnotation: Annotation = {
        type: 'text',
        x: textInput.x,
        y: textInput.y,
        text: textInput.text,
        color,
        font_size: 24,
      };
      addAnnotation(newAnnotation);
    }
    setTextInput({ show: false, x: 0, y: 0, text: '' });
  };

  const undo = () => {
    if (historyIndex > 0) {
      setHistoryIndex(historyIndex - 1);
      setAnnotations(history[historyIndex - 1]);
    }
  };

  const redo = () => {
    if (historyIndex < history.length - 1) {
      setHistoryIndex(historyIndex + 1);
      setAnnotations(history[historyIndex + 1]);
    }
  };

  const deleteSelected = () => {
    if (selectedIndex !== null) {
      const newAnnotations = annotations.filter((_, i) => i !== selectedIndex);
      setAnnotations(newAnnotations);
      addToHistory(newAnnotations);
      setSelectedIndex(null);
    }
  };

  const handleSave = () => {
    onSave(annotations);
    onClose();
  };

  const tools: { id: Tool; icon: React.ReactNode; label: string }[] = [
    { id: 'select', icon: <MousePointer className="w-5 h-5" />, label: 'Chon' },
    { id: 'rectangle', icon: <Square className="w-5 h-5" />, label: 'Hinh chu nhat' },
    { id: 'circle', icon: <Circle className="w-5 h-5" />, label: 'Hinh tron' },
    { id: 'arrow', icon: <ArrowRight className="w-5 h-5" />, label: 'Mui ten' },
    { id: 'text', icon: <Type className="w-5 h-5" />, label: 'Van ban' },
    { id: 'blur', icon: <Eraser className="w-5 h-5" />, label: 'Lam mo' },
    { id: 'highlight', icon: <Highlighter className="w-5 h-5" />, label: 'Danh dau' },
  ];

  return (
    <div className="fixed inset-0 bg-black/80 z-50 flex flex-col">
      {/* Header */}
      <div className="bg-gray-900 px-4 py-3 flex items-center justify-between">
        <div className="flex items-center gap-4">
          <button onClick={onClose} className="p-2 hover:bg-gray-800 rounded-lg text-white">
            <X className="w-5 h-5" />
          </button>
          <h2 className="text-white font-medium">Chinh sua hinh anh</h2>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={undo}
            disabled={historyIndex === 0}
            className="p-2 hover:bg-gray-800 rounded-lg text-white disabled:opacity-50"
          >
            <Undo className="w-5 h-5" />
          </button>
          <button
            onClick={redo}
            disabled={historyIndex === history.length - 1}
            className="p-2 hover:bg-gray-800 rounded-lg text-white disabled:opacity-50"
          >
            <Redo className="w-5 h-5" />
          </button>
          <div className="w-px h-6 bg-gray-700 mx-2"></div>
          <button
            onClick={handleSave}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg flex items-center gap-2 hover:bg-blue-700"
          >
            <Check className="w-4 h-4" />
            Luu
          </button>
        </div>
      </div>

      {/* Main Editor Area */}
      <div className="flex-1 flex">
        {/* Tools Sidebar */}
        <div className="w-16 bg-gray-900 flex flex-col items-center py-4 gap-2">
          {tools.map((t) => (
            <button
              key={t.id}
              onClick={() => setTool(t.id)}
              className={`p-3 rounded-lg transition-colors ${
                tool === t.id
                  ? 'bg-blue-600 text-white'
                  : 'text-gray-400 hover:bg-gray-800 hover:text-white'
              }`}
              title={t.label}
            >
              {t.icon}
            </button>
          ))}

          <div className="w-10 h-px bg-gray-700 my-2"></div>

          {selectedIndex !== null && (
            <button
              onClick={deleteSelected}
              className="p-3 rounded-lg text-red-400 hover:bg-gray-800 hover:text-red-300"
              title="Xoa"
            >
              <Trash2 className="w-5 h-5" />
            </button>
          )}
        </div>

        {/* Canvas Area */}
        <div
          ref={containerRef}
          className="flex-1 flex items-center justify-center p-4 overflow-auto"
        >
          <div className="relative">
            <canvas
              ref={canvasRef}
              onMouseDown={handleMouseDown}
              onMouseMove={handleMouseMove}
              onMouseUp={handleMouseUp}
              onMouseLeave={handleMouseUp}
              className="cursor-crosshair max-w-full max-h-full"
              style={{ boxShadow: '0 4px 20px rgba(0,0,0,0.5)' }}
            />
            <canvas
              ref={overlayCanvasRef}
              className="absolute inset-0 pointer-events-none"
            />

            {/* Text Input */}
            {textInput.show && (
              <div
                className="absolute"
                style={{
                  left: `${textInput.x}%`,
                  top: `${textInput.y}%`,
                }}
              >
                <input
                  type="text"
                  value={textInput.text}
                  onChange={(e) => setTextInput({ ...textInput, text: e.target.value })}
                  onKeyDown={(e) => e.key === 'Enter' && handleTextSubmit()}
                  onBlur={handleTextSubmit}
                  autoFocus
                  className="px-2 py-1 text-lg border-2 border-blue-500 outline-none min-w-[100px]"
                  style={{ color }}
                  placeholder="Nhap van ban..."
                />
              </div>
            )}
          </div>
        </div>

        {/* Properties Panel */}
        <div className="w-64 bg-gray-900 p-4">
          <h3 className="text-white font-medium mb-4">Thuoc tinh</h3>

          {/* Color Picker */}
          <div className="mb-4">
            <label className="text-gray-400 text-sm block mb-2">Mau sac</label>
            <div className="flex flex-wrap gap-2">
              {COLORS.map((c) => (
                <button
                  key={c}
                  onClick={() => setColor(c)}
                  className={`w-8 h-8 rounded-lg border-2 ${
                    color === c ? 'border-white' : 'border-transparent'
                  }`}
                  style={{ backgroundColor: c }}
                />
              ))}
            </div>
          </div>

          {/* Stroke Width */}
          <div className="mb-4">
            <label className="text-gray-400 text-sm block mb-2">Do day: {strokeWidth}px</label>
            <input
              type="range"
              min="1"
              max="10"
              value={strokeWidth}
              onChange={(e) => setStrokeWidth(parseInt(e.target.value))}
              className="w-full"
            />
          </div>

          {/* Annotations List */}
          <div>
            <label className="text-gray-400 text-sm block mb-2">
              Annotations ({annotations.length})
            </label>
            <div className="space-y-1 max-h-60 overflow-y-auto">
              {annotations.map((ann, index) => (
                <div
                  key={index}
                  onClick={() => setSelectedIndex(index)}
                  className={`px-3 py-2 rounded cursor-pointer text-sm ${
                    selectedIndex === index
                      ? 'bg-blue-600 text-white'
                      : 'bg-gray-800 text-gray-300 hover:bg-gray-700'
                  }`}
                >
                  {ann.type} {ann.text ? `"${ann.text}"` : ''}
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
