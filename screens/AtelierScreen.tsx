import React, { useState, useRef } from 'react';
import ScreenLayout from '../components/ScreenLayout';
import type { AIResponse } from '../types';
import { catalogue } from '../data/catalogue';
import { useAppContext } from '../contexts/AppContext';

type AtelierElement = VitrailShape | PeinturePath;

interface VitrailShape {
  id: number;
  type: 'rect' | 'circle';
  x: number;
  y: number;
  width: number;
  height: number;
  fill: string;
}

interface PeinturePath {
  id: number;
  type: 'path';
  d: string;
  stroke: string;
  strokeWidth: number;
  strokeLinecap: 'round' | 'square';
  strokeLinejoin: 'round' | 'miter';
}

type DragInfo = {
  elementId: number;
  startX: number;
  startY: number;
  elementStartX: number;
  elementStartY: number;
};

const AtelierScreen: React.FC<{ response: AIResponse }> = ({ response }) => {
  const { saveCreation, sendMessage } = useAppContext();
  const [elements, setElements] = useState<AtelierElement[]>([]);
  const { oeuvre_id, mode = 'vitrail' } = response.context || {};
  const oeuvre = catalogue.oeuvres.find(o => o.id === oeuvre_id);

  const defaultPalette = ["#EF4444", "#3B82F6", "#FACC15", "#22C55E", "#000000", "#FFFFFF"];
  const palette = oeuvre?.palette_atelier || defaultPalette;
  const defi = oeuvre?.defi_2min || (mode === 'vitrail' ? ["Crée un vitrail géométrique !"] : ["Peins une toile expressive !"]);

  const [selectedColor, setSelectedColor] = useState(palette[0]);
  const [selectedElementId, setSelectedElementId] = useState<number | null>(null);
  const [brushSize, setBrushSize] = useState(1.6);
  const [brushShape, setBrushShape] = useState<'round' | 'square'>('round');

  const svgRef = useRef<SVGSVGElement>(null);
  const dragInfo = useRef<DragInfo | null>(null);
  const paintingRef = useRef<number | null>(null);

  const addVitrailShape = (type: 'rect' | 'circle') => {
    const newShape: VitrailShape = {
      id: Date.now(),
      type,
      x: Math.random() * 80 + 10,
      y: Math.random() * 80 + 10,
      width: Math.random() * 20 + 10,
      height: Math.random() * 20 + 10,
      fill: selectedColor,
    };
    setElements(prev => [...prev, newShape]);
  };

  const deleteSelectedElement = () => {
    if (selectedElementId === null) return;
    setElements(elements.filter(el => el.id !== selectedElementId));
    setSelectedElementId(null);
  };

  const finishAndSave = () => {
    if (!svgRef.current) return;
    setSelectedElementId(null);

    setTimeout(() => {
      const svgNode = svgRef.current!;
      const serializer = new XMLSerializer();
      let source = serializer.serializeToString(svgNode);

      if (!source.includes('xmlns="http://www.w3.org/2000/svg"')) {
        source = source.replace(/^<svg/, '<svg xmlns="http://www.w3.org/2000/svg"');
      }
      if (!source.includes('xmlns:xlink="http://www.w3.org/1999/xlink"')) {
        source = source.replace(/^<svg/, '<svg xmlns:xlink="http://www.w3.org/1999/xlink"');
      }

      const dataUrl = "data:image/svg+xml;base64," + btoa(source);
      saveCreation(dataUrl);
      sendMessage("Mon œuvre est terminée.");
    }, 100);
  };

  const getCoordinates = (e: React.PointerEvent) => {
    if (!svgRef.current) return { x: 0, y: 0 };
    const svg = svgRef.current;
    const pt = svg.createSVGPoint();
    pt.x = e.clientX;
    pt.y = e.clientY;
    const ctm = svg.getScreenCTM();
    if (!ctm) {
      return { x: 0, y: 0 };
    }
    const { x, y } = pt.matrixTransform(ctm.inverse());
    return { x, y };
  };

  const onShapePointerDown = (e: React.PointerEvent, el: VitrailShape) => {
    e.stopPropagation();
    setSelectedElementId(el.id);
    const { x: mouseX, y: mouseY } = getCoordinates(e);
    (e.currentTarget as Element).setPointerCapture?.(e.pointerId);
    dragInfo.current = {
      elementId: el.id,
      startX: mouseX,
      startY: mouseY,
      elementStartX: el.x,
      elementStartY: el.y,
    };
  };

  const startPaint = (e: React.PointerEvent) => {
    if (mode !== 'peinture') return;
    if (e.target !== svgRef.current) return;
    const { x, y } = getCoordinates(e);
    const id = Date.now();
    const newPath: PeinturePath = {
      id,
      type: 'path',
      d: `M ${x} ${y}`,
      stroke: selectedColor,
      strokeWidth: brushSize,
      strokeLinecap: brushShape,
      strokeLinejoin: brushShape === 'round' ? 'round' : 'miter',
    };
    (e.currentTarget as Element).setPointerCapture?.(e.pointerId);
    paintingRef.current = id;
    setElements(prev => [...prev, newPath]);
  };

  const onCanvasPointerMove = (e: React.PointerEvent) => {
    if (paintingRef.current) {
      const { x, y } = getCoordinates(e);
      const paintId = paintingRef.current;
      setElements(prev =>
        prev.map(el => {
          if (el.type === 'path' && el.id === paintId) {
            return { ...el, d: `${el.d} L ${x} ${y}` };
          }
          return el;
        })
      );
      return;
    }

    const currentDrag = dragInfo.current;
    if (!currentDrag) return;

    const { x: mouseX, y: mouseY } = getCoordinates(e);
    const dx = mouseX - currentDrag.startX;
    const dy = mouseY - currentDrag.startY;

    setElements(prevElements =>
      prevElements.map(el => {
        if (el.id === currentDrag.elementId && el.type !== 'path') {
          return {
            ...el,
            x: currentDrag.elementStartX + dx,
            y: currentDrag.elementStartY + dy,
          };
        }
        return el;
      })
    );
  };

  const onCanvasPointerUp = () => {
    dragInfo.current = null;
    paintingRef.current = null;
  };

  const canvasContainerClass = mode === 'vitrail' ? 'bg-cover bg-center' : 'bg-white';
  const canvasContainerStyle = mode === 'vitrail'
    ? { backgroundImage: "url('https://images.unsplash.com/photo-1467269204594-9661b134dd2b?q=80&w=1600&auto=format&fit=crop')" }
    : {};

  return (
    <ScreenLayout response={response}>
      <div className="flex flex-col md:flex-row gap-6 h-full max-h-[calc(100vh-350px)]">
        <div className="w-full md:w-1/3 bg-gray-900/50 p-4 rounded-lg flex flex-col justify-between">
          <div>
            <h3 className="text-xl font-bold text-yellow-400 mb-2">Défi créatif (2 min)</h3>
            <ul className="list-disc list-inside text-gray-300 space-y-1">
              {defi.map((step, i) => <li key={i}>{step}</li>)}
            </ul>
          </div>
          <div className="space-y-4">
            <div>
              <h4 className="text-lg font-bold mb-2">Palette</h4>
              <div className="grid grid-cols-3 gap-2">
                {palette.map(color => (
                  <button
                    key={color}
                    style={{ backgroundColor: color }}
                    className={`h-12 w-full rounded-md border-2 transition-transform transform hover:scale-110 ${selectedColor === color ? 'border-white scale-110' : 'border-transparent'}`}
                    onClick={() => setSelectedColor(color)}
                  />
                ))}
              </div>
            </div>

            <div>
              <h4 className="text-lg font-bold mb-2">Outils</h4>
              {mode === 'vitrail' && (
                <div className="space-y-2">
                  <div className="flex gap-2">
                    <button onClick={() => addVitrailShape('rect')} className="bg-cyan-600 hover:bg-cyan-500 w-full p-2 rounded-md">Ajouter carré</button>
                    <button onClick={() => addVitrailShape('circle')} className="bg-cyan-600 hover:bg-cyan-500 w-full p-2 rounded-md">Ajouter cercle</button>
                  </div>
                  <button onClick={deleteSelectedElement} disabled={selectedElementId === null} className="bg-red-600 hover:bg-red-500 w-full p-2 rounded-md disabled:bg-gray-600 disabled:cursor-not-allowed">Supprimer la forme</button>
                </div>
              )}
              {mode === 'peinture' && (
                <div className="space-y-3">
                  <div>
                    <p className="text-sm text-gray-300 mb-2">Épaisseur</p>
                    <div className="flex gap-2">
                      {[0.8, 1.6, 2.6, 4].map(size => (
                        <button
                          key={size}
                          onClick={() => setBrushSize(size)}
                          className={`flex-1 rounded-md border ${brushSize === size ? 'border-white' : 'border-white/20'} bg-gray-800/60 py-2`}
                        >
                          <div className="mx-auto w-10" style={{ height: 10 }}>
                            <div className="bg-white rounded-full" style={{ height: Math.max(2, size * 2) }}></div>
                          </div>
                        </button>
                      ))}
                    </div>
                  </div>
                  <div>
                    <p className="text-sm text-gray-300 mb-2">Forme</p>
                    <div className="flex gap-2">
                      <button
                        onClick={() => setBrushShape('round')}
                        className={`flex-1 rounded-md border ${brushShape === 'round' ? 'border-white' : 'border-white/20'} bg-gray-800/60 py-2 text-sm`}
                      >
                        Rond
                      </button>
                      <button
                        onClick={() => setBrushShape('square')}
                        className={`flex-1 rounded-md border ${brushShape === 'square' ? 'border-white' : 'border-white/20'} bg-gray-800/60 py-2 text-sm`}
                      >
                        Carré
                      </button>
                    </div>
                  </div>
                </div>
              )}
            </div>
            <button onClick={finishAndSave} className="bg-green-600 hover:bg-green-500 w-full p-3 rounded-md font-bold text-lg">Terminer et Enregistrer</button>
          </div>
        </div>

        <div className={`w-full md:w-2/3 rounded-lg overflow-hidden relative ${canvasContainerClass}`} style={canvasContainerStyle}>
          {mode === 'vitrail' && (
            <div
              className="absolute inset-0 pointer-events-none"
              style={{
                backgroundImage:
                  'linear-gradient(90deg, rgba(0,0,0,0.55) 0 2px, transparent 2px 48px), linear-gradient(0deg, rgba(0,0,0,0.55) 0 2px, transparent 2px 48px)',
                backgroundSize: '48px 48px',
                mixBlendMode: 'multiply',
                opacity: 0.6,
              }}
            />
          )}
          <svg
            ref={svgRef}
            viewBox="0 0 100 100"
            className="w-full h-full absolute top-0 left-0"
            preserveAspectRatio="xMidYMid slice"
            onPointerDown={startPaint}
            onPointerMove={onCanvasPointerMove}
            onPointerUp={onCanvasPointerUp}
            onPointerLeave={onCanvasPointerUp}
            style={{ touchAction: 'none' }}
          >
            {elements.map(el => {
              if (el.type === 'rect') {
                const isSelected = el.id === selectedElementId;
                return (
                  <rect
                    key={el.id}
                    onPointerDown={(e) => onShapePointerDown(e, el)}
                    x={el.x}
                    y={el.y}
                    width={el.width}
                    height={el.height}
                    fill={el.fill}
                    fillOpacity={mode === 'vitrail' ? 0.55 : 0.9}
                    stroke={isSelected ? '#FACC15' : '#0f172a'}
                    strokeWidth={mode === 'vitrail' ? 0.9 : 0.5}
                    className="cursor-move"
                  />
                );
              }
              if (el.type === 'circle') {
                const isSelected = el.id === selectedElementId;
                return (
                  <circle
                    key={el.id}
                    onPointerDown={(e) => onShapePointerDown(e, el)}
                    cx={el.x + el.width / 2}
                    cy={el.y + el.height / 2}
                    r={el.width / 2}
                    fill={el.fill}
                    fillOpacity={mode === 'vitrail' ? 0.55 : 0.9}
                    stroke={isSelected ? '#FACC15' : '#0f172a'}
                    strokeWidth={mode === 'vitrail' ? 0.9 : 0.5}
                    className="cursor-move"
                  />
                );
              }
              if (el.type === 'path') {
                return (
                  <path
                    key={el.id}
                    d={el.d}
                    stroke={el.stroke}
                    strokeWidth={el.strokeWidth}
                    fill="none"
                    strokeLinecap={el.strokeLinecap}
                    strokeLinejoin={el.strokeLinejoin}
                  />
                );
              }
              return null;
            })}
          </svg>
        </div>
      </div>
    </ScreenLayout>
  );
};

export default AtelierScreen;
