'use client';

import { useState, useRef, useEffect, useCallback } from 'react';
import {
  Play,
  Pause,
  SkipBack,
  SkipForward,
  Volume2,
  VolumeX,
  Scissors,
  Type,
  Target,
  X,
  Check,
  Trash2,
  Square,
  Circle,
  ArrowRight,
  MousePointer,
  Highlighter,
} from 'lucide-react';
import { Annotation } from '@/types/api';

interface VideoEditorProps {
  videoUrl: string;
  annotations: Annotation[];
  trimStart?: number;
  trimEnd?: number;
  muted?: boolean;
  onSave: (data: {
    annotations: Annotation[];
    trimStart: number | null;
    trimEnd: number | null;
    muted: boolean;
  }) => void;
  onClose: () => void;
}

interface Subtitle {
  id: string;
  startTime: number;
  endTime: number;
  text: string;
}

// Video marker with shape and timing
interface VideoMarker {
  id: string;
  type: 'rectangle' | 'circle' | 'arrow' | 'highlight';
  x: number;       // % position
  y: number;
  width: number;   // for arrow: endX
  height: number;  // for arrow: endY
  color: string;
  strokeWidth: number;
  startTime: number;
  endTime: number;
}

type DrawTool = 'select' | 'rectangle' | 'circle' | 'arrow' | 'highlight';

const COLORS = ['#FF0000', '#00FF00', '#0000FF', '#FFFF00', '#FF00FF', '#00FFFF', '#FFA500', '#FFFFFF'];

export default function VideoEditor({
  videoUrl,
  annotations: initialAnnotations,
  trimStart: initialTrimStart,
  trimEnd: initialTrimEnd,
  muted: initialMuted = false,
  onSave,
  onClose,
}: VideoEditorProps) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const videoContainerRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const timelineRef = useRef<HTMLDivElement>(null);

  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [isMuted, setIsMuted] = useState(initialMuted);

  // Trim settings
  const [trimStart, setTrimStart] = useState(initialTrimStart || 0);
  const [trimEnd, setTrimEnd] = useState(initialTrimEnd || 0);

  // Annotations
  const [subtitles, setSubtitles] = useState<Subtitle[]>([]);
  const [markers, setMarkers] = useState<VideoMarker[]>([]);

  // Active tool and editing state
  const [activeTool, setActiveTool] = useState<'subtitle' | 'marker'>('marker');
  const [drawTool, setDrawTool] = useState<DrawTool>('rectangle');
  const [color, setColor] = useState('#FF0000');
  const [strokeWidth, setStrokeWidth] = useState(3);
  const [editingSubtitle, setEditingSubtitle] = useState<Subtitle | null>(null);
  const [editingMarker, setEditingMarker] = useState<VideoMarker | null>(null);

  // Drawing state
  const [isDrawing, setIsDrawing] = useState(false);
  const [drawStart, setDrawStart] = useState({ x: 0, y: 0 });
  const [drawCurrent, setDrawCurrent] = useState({ x: 0, y: 0 });

  // Load initial annotations
  useEffect(() => {
    const subs: Subtitle[] = [];
    const marks: VideoMarker[] = [];

    initialAnnotations.forEach((ann, index) => {
      if (ann.type === 'subtitle') {
        subs.push({
          id: `sub-${index}`,
          startTime: ann.start_time || 0,
          endTime: ann.end_time || 0,
          text: ann.text || '',
        });
      } else if (['rectangle', 'circle', 'arrow', 'highlight', 'marker'].includes(ann.type)) {
        marks.push({
          id: `marker-${index}`,
          type: ann.type === 'marker' ? 'circle' : (ann.type as VideoMarker['type']),
          x: ann.x || 0,
          y: ann.y || 0,
          width: ann.width || 10,
          height: ann.height || 10,
          color: ann.color || '#FF0000',
          strokeWidth: ann.stroke_width || 3,
          startTime: ann.start_time || 0,
          endTime: ann.end_time || (ann.start_time || 0) + (ann.duration || 1.5),
        });
      }
    });

    setSubtitles(subs);
    setMarkers(marks);
  }, [initialAnnotations]);

  // Video event handlers
  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    const handleLoadedMetadata = () => {
      setDuration(video.duration);
      setTrimEnd(initialTrimEnd || video.duration);
    };

    const handleTimeUpdate = () => {
      setCurrentTime(video.currentTime);

      // Loop within trim range
      if (video.currentTime < trimStart) {
        video.currentTime = trimStart;
      } else if (video.currentTime >= trimEnd) {
        video.currentTime = trimStart;
        video.pause();
        setIsPlaying(false);
      }
    };

    video.addEventListener('loadedmetadata', handleLoadedMetadata);
    video.addEventListener('timeupdate', handleTimeUpdate);

    return () => {
      video.removeEventListener('loadedmetadata', handleLoadedMetadata);
      video.removeEventListener('timeupdate', handleTimeUpdate);
    };
  }, [trimStart, trimEnd, initialTrimEnd]);

  // Redraw canvas when markers change or time changes
  useEffect(() => {
    drawMarkersOnCanvas();
  }, [markers, currentTime, isDrawing, drawStart, drawCurrent, drawTool, color]);

  const drawMarkersOnCanvas = useCallback(() => {
    const canvas = canvasRef.current;
    const video = videoRef.current;
    const ctx = canvas?.getContext('2d');
    if (!canvas || !ctx || !video) return;

    // Match canvas size to video
    const videoRect = video.getBoundingClientRect();
    canvas.width = videoRect.width;
    canvas.height = videoRect.height;

    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Draw markers that are active at current time
    markers.forEach((marker) => {
      if (currentTime >= marker.startTime && currentTime <= marker.endTime) {
        drawMarker(ctx, marker, canvas.width, canvas.height, marker.id === editingMarker?.id);
      }
    });

    // Draw preview while drawing
    if (isDrawing && activeTool === 'marker') {
      const previewMarker: VideoMarker = {
        id: 'preview',
        type: drawTool === 'select' ? 'rectangle' : drawTool,
        x: drawTool === 'arrow' ? drawStart.x : Math.min(drawStart.x, drawCurrent.x),
        y: drawTool === 'arrow' ? drawStart.y : Math.min(drawStart.y, drawCurrent.y),
        width: drawTool === 'arrow' ? drawCurrent.x : Math.abs(drawCurrent.x - drawStart.x),
        height: drawTool === 'arrow' ? drawCurrent.y : Math.abs(drawCurrent.y - drawStart.y),
        color,
        strokeWidth,
        startTime: 0,
        endTime: 0,
      };
      drawMarker(ctx, previewMarker, canvas.width, canvas.height, false);
    }
  }, [markers, currentTime, isDrawing, drawStart, drawCurrent, drawTool, color, editingMarker, activeTool, strokeWidth]);

  const drawMarker = (
    ctx: CanvasRenderingContext2D,
    marker: VideoMarker,
    canvasWidth: number,
    canvasHeight: number,
    isSelected: boolean
  ) => {
    const x = (marker.x / 100) * canvasWidth;
    const y = (marker.y / 100) * canvasHeight;
    const w = (marker.width / 100) * canvasWidth;
    const h = (marker.height / 100) * canvasHeight;

    ctx.save();
    ctx.strokeStyle = marker.color;
    ctx.lineWidth = marker.strokeWidth;
    ctx.fillStyle = marker.color;

    switch (marker.type) {
      case 'rectangle':
        ctx.strokeRect(x, y, w, h);
        break;

      case 'circle':
        ctx.beginPath();
        ctx.ellipse(x + w / 2, y + h / 2, Math.abs(w / 2), Math.abs(h / 2), 0, 0, 2 * Math.PI);
        ctx.stroke();
        break;

      case 'arrow': {
        const startX = x;
        const startY = y;
        const endX = w;
        const endY = h;

        ctx.beginPath();
        ctx.moveTo(startX, startY);
        ctx.lineTo(endX, endY);
        ctx.stroke();

        const angle = Math.atan2(endY - startY, endX - startX);
        const headLength = 15 + marker.strokeWidth * 2;
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
        break;
      }

      case 'highlight':
        ctx.fillStyle = marker.color + '40'; // 25% opacity
        ctx.fillRect(x, y, w, h);
        break;
    }

    // Selection indicator
    if (isSelected) {
      ctx.strokeStyle = '#0066FF';
      ctx.lineWidth = 2;
      ctx.setLineDash([5, 5]);
      if (marker.type === 'arrow') {
        ctx.beginPath();
        ctx.arc(x, y, 8, 0, 2 * Math.PI);
        ctx.stroke();
        ctx.beginPath();
        ctx.arc(w, h, 8, 0, 2 * Math.PI);
        ctx.stroke();
      } else {
        ctx.strokeRect(x - 2, y - 2, w + 4, h + 4);
      }
      ctx.setLineDash([]);
    }

    ctx.restore();
  };

  const getCanvasCoords = (e: React.MouseEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current;
    if (!canvas) return { x: 0, y: 0 };

    const rect = canvas.getBoundingClientRect();
    const x = ((e.clientX - rect.left) / rect.width) * 100;
    const y = ((e.clientY - rect.top) / rect.height) * 100;
    return { x, y };
  };

  const handleCanvasMouseDown = (e: React.MouseEvent<HTMLCanvasElement>) => {
    if (activeTool !== 'marker' || drawTool === 'select') return;

    const { x, y } = getCanvasCoords(e);
    setIsDrawing(true);
    setDrawStart({ x, y });
    setDrawCurrent({ x, y });

    // Pause video while drawing
    if (videoRef.current && isPlaying) {
      videoRef.current.pause();
      setIsPlaying(false);
    }
  };

  const handleCanvasMouseMove = (e: React.MouseEvent<HTMLCanvasElement>) => {
    if (!isDrawing) return;
    const { x, y } = getCanvasCoords(e);
    setDrawCurrent({ x, y });
  };

  const handleCanvasMouseUp = () => {
    if (!isDrawing) return;

    // Create new marker
    const newMarker: VideoMarker = {
      id: `marker-${Date.now()}`,
      type: drawTool === 'select' ? 'rectangle' : drawTool,
      x: drawTool === 'arrow' ? drawStart.x : Math.min(drawStart.x, drawCurrent.x),
      y: drawTool === 'arrow' ? drawStart.y : Math.min(drawStart.y, drawCurrent.y),
      width: drawTool === 'arrow' ? drawCurrent.x : Math.abs(drawCurrent.x - drawStart.x),
      height: drawTool === 'arrow' ? drawCurrent.y : Math.abs(drawCurrent.y - drawStart.y),
      color,
      strokeWidth,
      startTime: currentTime,
      endTime: Math.min(currentTime + 2, duration), // Default 2 seconds duration
    };

    // Only add if size is significant
    const length = drawTool === 'arrow'
      ? Math.sqrt(Math.pow(drawCurrent.x - drawStart.x, 2) + Math.pow(drawCurrent.y - drawStart.y, 2))
      : newMarker.width + newMarker.height;

    if (length > 2) {
      setMarkers([...markers, newMarker]);
      setEditingMarker(newMarker);
    }

    setIsDrawing(false);
  };

  const togglePlay = () => {
    const video = videoRef.current;
    if (!video) return;

    if (isPlaying) {
      video.pause();
    } else {
      if (video.currentTime >= trimEnd) {
        video.currentTime = trimStart;
      }
      video.play();
    }
    setIsPlaying(!isPlaying);
  };

  const seekTo = (time: number) => {
    const video = videoRef.current;
    if (!video) return;

    const clampedTime = Math.max(0, Math.min(duration, time));
    video.currentTime = clampedTime;
    setCurrentTime(clampedTime);
  };

  const handleTimelineClick = (e: React.MouseEvent<HTMLDivElement>) => {
    const timeline = timelineRef.current;
    if (!timeline) return;

    const rect = timeline.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const percentage = x / rect.width;
    const time = percentage * duration;
    seekTo(time);
  };

  const toggleMute = () => {
    const video = videoRef.current;
    if (video) {
      video.muted = !isMuted;
      setIsMuted(!isMuted);
    }
  };

  const formatTime = (time: number) => {
    const minutes = Math.floor(time / 60);
    const seconds = Math.floor(time % 60);
    const ms = Math.floor((time % 1) * 10);
    return `${minutes}:${seconds.toString().padStart(2, '0')}.${ms}`;
  };

  // Get current subtitle
  const currentSubtitle = subtitles.find(
    (sub) => currentTime >= sub.startTime && currentTime <= sub.endTime
  );

  // Add subtitle at current time
  const addSubtitle = () => {
    const newSub: Subtitle = {
      id: `sub-${Date.now()}`,
      startTime: currentTime,
      endTime: Math.min(currentTime + 3, duration),
      text: 'Nhap noi dung phu de...',
    };
    setSubtitles([...subtitles, newSub]);
    setEditingSubtitle(newSub);
  };

  const deleteSubtitle = (id: string) => {
    setSubtitles(subtitles.filter((sub) => sub.id !== id));
    if (editingSubtitle?.id === id) {
      setEditingSubtitle(null);
    }
  };

  const deleteMarker = (id: string) => {
    setMarkers(markers.filter((m) => m.id !== id));
    if (editingMarker?.id === id) {
      setEditingMarker(null);
    }
  };

  const updateMarker = (id: string, updates: Partial<VideoMarker>) => {
    setMarkers(markers.map((m) => (m.id === id ? { ...m, ...updates } : m)));
    if (editingMarker?.id === id) {
      setEditingMarker({ ...editingMarker, ...updates });
    }
  };

  // Save
  const handleSave = () => {
    const annotations: Annotation[] = [
      ...subtitles.map((sub) => ({
        type: 'subtitle' as const,
        start_time: sub.startTime,
        end_time: sub.endTime,
        text: sub.text,
      })),
      ...markers.map((m) => ({
        type: m.type as Annotation['type'],
        x: m.x,
        y: m.y,
        width: m.width,
        height: m.height,
        color: m.color,
        stroke_width: m.strokeWidth,
        start_time: m.startTime,
        end_time: m.endTime,
        duration: m.endTime - m.startTime,
      })),
    ];

    onSave({
      annotations,
      trimStart: trimStart > 0 ? trimStart : null,
      trimEnd: trimEnd < duration ? trimEnd : null,
      muted: isMuted,
    });
    onClose();
  };

  const drawTools: { id: DrawTool; icon: React.ReactNode; label: string }[] = [
    { id: 'select', icon: <MousePointer className="w-4 h-4" />, label: 'Chon' },
    { id: 'rectangle', icon: <Square className="w-4 h-4" />, label: 'Hinh chu nhat' },
    { id: 'circle', icon: <Circle className="w-4 h-4" />, label: 'Hinh tron' },
    { id: 'arrow', icon: <ArrowRight className="w-4 h-4" />, label: 'Mui ten' },
    { id: 'highlight', icon: <Highlighter className="w-4 h-4" />, label: 'Highlight' },
  ];

  return (
    <div className="fixed inset-0 bg-black z-50 flex flex-col">
      {/* Header */}
      <div className="bg-gray-900 px-4 py-3 flex items-center justify-between">
        <div className="flex items-center gap-4">
          <button onClick={onClose} className="p-2 hover:bg-gray-800 rounded-lg text-white">
            <X className="w-5 h-5" />
          </button>
          <h2 className="text-white font-medium">Chinh sua video</h2>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={handleSave}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg flex items-center gap-2 hover:bg-blue-700"
          >
            <Check className="w-4 h-4" />
            Luu
          </button>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex overflow-hidden">
        {/* Video Preview with Drawing Canvas */}
        <div className="flex-1 flex flex-col items-center justify-center bg-black p-4">
          <div ref={videoContainerRef} className="relative max-w-4xl w-full">
            <video
              ref={videoRef}
              src={videoUrl}
              className="w-full rounded-lg"
              muted={isMuted}
              onClick={togglePlay}
            />

            {/* Drawing Canvas Overlay */}
            <canvas
              ref={canvasRef}
              onMouseDown={handleCanvasMouseDown}
              onMouseMove={handleCanvasMouseMove}
              onMouseUp={handleCanvasMouseUp}
              onMouseLeave={handleCanvasMouseUp}
              className="absolute inset-0 w-full h-full"
              style={{ cursor: activeTool === 'marker' && drawTool !== 'select' ? 'crosshair' : 'default' }}
            />

            {/* Subtitle Overlay */}
            {currentSubtitle && (
              <div className="absolute bottom-16 left-0 right-0 text-center pointer-events-none">
                <span className="bg-black/80 text-white px-4 py-2 rounded text-lg">
                  {currentSubtitle.text}
                </span>
              </div>
            )}

            {/* Play/Pause overlay */}
            {!isPlaying && !isDrawing && (
              <div
                className="absolute inset-0 flex items-center justify-center pointer-events-none"
              >
                <div className="w-16 h-16 bg-white/20 rounded-full flex items-center justify-center">
                  <Play className="w-8 h-8 text-white" />
                </div>
              </div>
            )}
          </div>

          {/* Video Controls */}
          <div className="w-full max-w-4xl mt-4">
            {/* Timeline */}
            <div
              ref={timelineRef}
              onClick={handleTimelineClick}
              className="relative h-16 bg-gray-800 rounded-lg cursor-pointer mb-4"
            >
              {/* Trim region */}
              <div
                className="absolute h-full bg-gray-600/50 rounded-lg"
                style={{
                  left: `${(trimStart / duration) * 100}%`,
                  width: `${((trimEnd - trimStart) / duration) * 100}%`,
                }}
              />

              {/* Subtitles on timeline */}
              {subtitles.map((sub) => (
                <div
                  key={sub.id}
                  className={`absolute h-3 rounded top-1 ${editingSubtitle?.id === sub.id ? 'bg-yellow-400' : 'bg-yellow-500'}`}
                  style={{
                    left: `${(sub.startTime / duration) * 100}%`,
                    width: `${((sub.endTime - sub.startTime) / duration) * 100}%`,
                  }}
                  onClick={(e) => {
                    e.stopPropagation();
                    setEditingSubtitle(sub);
                    seekTo(sub.startTime);
                  }}
                />
              ))}

              {/* Markers on timeline */}
              {markers.map((marker) => (
                <div
                  key={marker.id}
                  className={`absolute h-3 rounded bottom-1 ${editingMarker?.id === marker.id ? 'bg-red-400' : 'bg-red-500'}`}
                  style={{
                    left: `${(marker.startTime / duration) * 100}%`,
                    width: `${((marker.endTime - marker.startTime) / duration) * 100}%`,
                  }}
                  onClick={(e) => {
                    e.stopPropagation();
                    setEditingMarker(marker);
                    seekTo(marker.startTime);
                  }}
                />
              ))}

              {/* Current time indicator */}
              <div
                className="absolute w-0.5 h-full bg-white rounded"
                style={{ left: `${(currentTime / duration) * 100}%` }}
              />
            </div>

            {/* Control buttons */}
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <button
                  onClick={() => seekTo(0)}
                  className="p-2 hover:bg-gray-800 rounded-lg text-white"
                >
                  <SkipBack className="w-5 h-5" />
                </button>
                <button
                  onClick={togglePlay}
                  className="p-3 bg-white rounded-full text-black hover:bg-gray-200"
                >
                  {isPlaying ? <Pause className="w-6 h-6" /> : <Play className="w-6 h-6" />}
                </button>
                <button
                  onClick={() => seekTo(duration)}
                  className="p-2 hover:bg-gray-800 rounded-lg text-white"
                >
                  <SkipForward className="w-5 h-5" />
                </button>

                <span className="text-white ml-4 font-mono">
                  {formatTime(currentTime)} / {formatTime(duration)}
                </span>
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={toggleMute}
                  className="p-2 hover:bg-gray-800 rounded-lg text-white"
                >
                  {isMuted ? <VolumeX className="w-5 h-5" /> : <Volume2 className="w-5 h-5" />}
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Tools Panel */}
        <div className="w-80 bg-gray-900 border-l border-gray-800 p-4 overflow-y-auto">
          {/* Tool Tabs */}
          <div className="flex gap-2 mb-4">
            <button
              onClick={() => setActiveTool('marker')}
              className={`flex-1 py-2 px-3 rounded-lg flex items-center justify-center gap-2 ${
                activeTool === 'marker' ? 'bg-blue-600 text-white' : 'bg-gray-800 text-gray-300'
              }`}
            >
              <Target className="w-4 h-4" />
              Danh dau
            </button>
            <button
              onClick={() => setActiveTool('subtitle')}
              className={`flex-1 py-2 px-3 rounded-lg flex items-center justify-center gap-2 ${
                activeTool === 'subtitle' ? 'bg-blue-600 text-white' : 'bg-gray-800 text-gray-300'
              }`}
            >
              <Type className="w-4 h-4" />
              Phu de
            </button>
          </div>

          {/* Marker Tools */}
          {activeTool === 'marker' && (
            <>
              {/* Draw tools */}
              <div className="mb-4">
                <label className="text-gray-400 text-sm block mb-2">Cong cu ve</label>
                <div className="flex gap-1">
                  {drawTools.map((tool) => (
                    <button
                      key={tool.id}
                      onClick={() => setDrawTool(tool.id)}
                      className={`p-2 rounded-lg ${
                        drawTool === tool.id
                          ? 'bg-blue-600 text-white'
                          : 'bg-gray-800 text-gray-300 hover:bg-gray-700'
                      }`}
                      title={tool.label}
                    >
                      {tool.icon}
                    </button>
                  ))}
                </div>
              </div>

              {/* Color picker */}
              <div className="mb-4">
                <label className="text-gray-400 text-sm block mb-2">Mau sac</label>
                <div className="flex flex-wrap gap-2">
                  {COLORS.map((c) => (
                    <button
                      key={c}
                      onClick={() => setColor(c)}
                      className={`w-7 h-7 rounded border-2 ${
                        color === c ? 'border-white' : 'border-transparent'
                      }`}
                      style={{ backgroundColor: c }}
                    />
                  ))}
                </div>
              </div>

              {/* Stroke width */}
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

              {/* Editing marker */}
              {editingMarker && (
                <div className="mb-4 p-3 bg-gray-800 rounded-lg">
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-white text-sm font-medium">
                      Chinh sua marker ({editingMarker.type})
                    </span>
                    <button
                      onClick={() => deleteMarker(editingMarker.id)}
                      className="text-red-400 hover:text-red-300"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                  <div className="grid grid-cols-2 gap-2">
                    <div>
                      <label className="text-xs text-gray-400">Bat dau (s)</label>
                      <input
                        type="number"
                        value={editingMarker.startTime.toFixed(1)}
                        onChange={(e) => updateMarker(editingMarker.id, { startTime: parseFloat(e.target.value) })}
                        step="0.1"
                        min="0"
                        max={duration}
                        className="w-full p-1 bg-gray-700 text-white rounded text-sm"
                      />
                    </div>
                    <div>
                      <label className="text-xs text-gray-400">Ket thuc (s)</label>
                      <input
                        type="number"
                        value={editingMarker.endTime.toFixed(1)}
                        onChange={(e) => updateMarker(editingMarker.id, { endTime: parseFloat(e.target.value) })}
                        step="0.1"
                        min="0"
                        max={duration}
                        className="w-full p-1 bg-gray-700 text-white rounded text-sm"
                      />
                    </div>
                  </div>
                  <div className="mt-2 text-xs text-gray-400">
                    Thoi luong: {(editingMarker.endTime - editingMarker.startTime).toFixed(1)}s
                  </div>
                </div>
              )}

              {/* Markers list */}
              <div className="mb-4">
                <h3 className="text-white text-sm font-medium mb-2">
                  Danh dau ({markers.length})
                </h3>
                <div className="space-y-1 max-h-40 overflow-y-auto">
                  {markers.map((marker) => (
                    <div
                      key={marker.id}
                      onClick={() => {
                        setEditingMarker(marker);
                        seekTo(marker.startTime);
                      }}
                      className={`p-2 rounded cursor-pointer flex justify-between items-center ${
                        editingMarker?.id === marker.id
                          ? 'bg-blue-600'
                          : 'bg-gray-800 hover:bg-gray-700'
                      }`}
                    >
                      <div>
                        <div className="text-white text-sm flex items-center gap-2">
                          <span
                            className="w-3 h-3 rounded"
                            style={{ backgroundColor: marker.color }}
                          />
                          {marker.type}
                        </div>
                        <div className="text-gray-400 text-xs">
                          {formatTime(marker.startTime)} - {formatTime(marker.endTime)}
                        </div>
                      </div>
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          deleteMarker(marker.id);
                        }}
                        className="text-red-400 hover:text-red-300"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            </>
          )}

          {/* Subtitle Tools */}
          {activeTool === 'subtitle' && (
            <>
              <button
                onClick={addSubtitle}
                className="w-full py-2 mb-4 bg-green-600 text-white rounded-lg hover:bg-green-700"
              >
                + Them phu de tai {formatTime(currentTime)}
              </button>

              {/* Editing subtitle */}
              {editingSubtitle && (
                <div className="mb-4 p-3 bg-gray-800 rounded-lg">
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-white text-sm font-medium">Chinh sua phu de</span>
                    <button
                      onClick={() => deleteSubtitle(editingSubtitle.id)}
                      className="text-red-400 hover:text-red-300"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                  <textarea
                    value={editingSubtitle.text}
                    onChange={(e) => {
                      const updated = { ...editingSubtitle, text: e.target.value };
                      setEditingSubtitle(updated);
                      setSubtitles(subtitles.map((s) => (s.id === updated.id ? updated : s)));
                    }}
                    className="w-full p-2 bg-gray-700 text-white rounded text-sm resize-none"
                    rows={2}
                  />
                  <div className="grid grid-cols-2 gap-2 mt-2">
                    <div>
                      <label className="text-xs text-gray-400">Bat dau (s)</label>
                      <input
                        type="number"
                        value={editingSubtitle.startTime.toFixed(1)}
                        onChange={(e) => {
                          const updated = { ...editingSubtitle, startTime: parseFloat(e.target.value) };
                          setEditingSubtitle(updated);
                          setSubtitles(subtitles.map((s) => (s.id === updated.id ? updated : s)));
                        }}
                        step="0.1"
                        className="w-full p-1 bg-gray-700 text-white rounded text-sm"
                      />
                    </div>
                    <div>
                      <label className="text-xs text-gray-400">Ket thuc (s)</label>
                      <input
                        type="number"
                        value={editingSubtitle.endTime.toFixed(1)}
                        onChange={(e) => {
                          const updated = { ...editingSubtitle, endTime: parseFloat(e.target.value) };
                          setEditingSubtitle(updated);
                          setSubtitles(subtitles.map((s) => (s.id === updated.id ? updated : s)));
                        }}
                        step="0.1"
                        className="w-full p-1 bg-gray-700 text-white rounded text-sm"
                      />
                    </div>
                  </div>
                </div>
              )}

              {/* Subtitles list */}
              <div>
                <h3 className="text-white text-sm font-medium mb-2">
                  Phu de ({subtitles.length})
                </h3>
                <div className="space-y-1 max-h-60 overflow-y-auto">
                  {subtitles.map((sub) => (
                    <div
                      key={sub.id}
                      onClick={() => {
                        setEditingSubtitle(sub);
                        seekTo(sub.startTime);
                      }}
                      className={`p-2 rounded cursor-pointer ${
                        editingSubtitle?.id === sub.id
                          ? 'bg-blue-600'
                          : 'bg-gray-800 hover:bg-gray-700'
                      }`}
                    >
                      <div className="text-white text-sm truncate">{sub.text}</div>
                      <div className="text-gray-400 text-xs">
                        {formatTime(sub.startTime)} - {formatTime(sub.endTime)}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </>
          )}

          {/* Trim Section */}
          <div className="mt-4 p-3 bg-gray-800 rounded-lg">
            <div className="flex items-center gap-2 mb-2">
              <Scissors className="w-4 h-4 text-gray-400" />
              <span className="text-white text-sm font-medium">Cat video</span>
            </div>
            <div className="grid grid-cols-2 gap-2">
              <div>
                <label className="text-xs text-gray-400">Bat dau (s)</label>
                <input
                  type="number"
                  value={trimStart.toFixed(1)}
                  onChange={(e) => setTrimStart(parseFloat(e.target.value))}
                  step="0.1"
                  min="0"
                  max={duration}
                  className="w-full p-1 bg-gray-700 text-white rounded text-sm"
                />
              </div>
              <div>
                <label className="text-xs text-gray-400">Ket thuc (s)</label>
                <input
                  type="number"
                  value={trimEnd.toFixed(1)}
                  onChange={(e) => setTrimEnd(parseFloat(e.target.value))}
                  step="0.1"
                  min="0"
                  max={duration}
                  className="w-full p-1 bg-gray-700 text-white rounded text-sm"
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
