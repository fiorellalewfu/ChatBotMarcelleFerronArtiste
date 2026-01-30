
import React, { useState, useRef } from 'react';
import ScreenLayout from '../components/ScreenLayout';
import type { AIResponse } from '../types';
import { catalogue } from '../data/catalogue';
import { useAppContext } from '../contexts/AppContext';

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
}

type AtelierElement = VitrailShape | PeinturePath;


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
  const defi = oeuvre?.defi_2min || (mode === 'vitrail' ? ["Crée un vitrail géométrique!"] : ["Peins une toile expressive!"]);

  const [selectedColor, setSelectedColor] = useState(palette[0]);
  const [selectedElementId, setSelectedElementId] = useState<number | null>(null);
  
  const svgRef = useRef<SVGSVGElement>(null);
  
  // Vitrail state
  const dragInfo = useRef<DragInfo | null>(null);

  // Peinture state
  const isPainting = useRef(false);
  const [livePath, setLivePath] = useState<PeinturePath | null>(null);
  const [brushSize, setBrushSize] = useState(1);
  const [brushShape, setBrushShape] = useState<'round' | 'square'>('round');

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

      if(!source.includes('xmlns="http://www.w3.org/2000/svg"')){
        source = source.replace('<svg', '<svg xmlns="http://www.w3.org/2000/svg"');
      }
      if(!source.includes('xmlns:xlink="http://www.w3.org/1999/xlink"')){
        source = source.replace('<svg', '<svg xmlns:xlink="http://www.w3.org/1999/xlink"');
      }
      
      const dataUrl = "data:image/svg+xml;base64," + btoa(source);
      saveCreation(dataUrl);
      sendMessage("Mon œuvre est terminée. Propose-moi d'aller au mur de souvenirs.");
    }, 100);
  };

  const getCoordinates = (e: React.MouseEvent) => {
    if (!svgRef.current) return { x: 0, y: 0 };
    const svg = svgRef.current;
    const pt = svg.createSVGPoint();
    pt.x = e.clientX;
    pt.y = e.clientY;
    const ctm = svg.getScreenCTM();
    if (!ctm) return { x: 0, y: 0 };
    const { x, y } = pt.matrixTransform(ctm.inverse());
    return { x, y };
  };

  const onShapeMouseDown = (e: React.MouseEvent, el: VitrailShape) => {
    e.stopPropagation();
    setSelectedElementId(el.id);
    const { x: mouseX, y: mouseY } = getCoordinates(e);
    dragInfo.current = {
      elementId: el.id,
      startX: mouseX,
      startY: mouseY,
      elementStartX: el.x,
      elementStartY: el.y,
    };
  };

  const onCanvasMouseDown = (e: React.MouseEvent) => {
    if (mode === 'peinture') {
        isPainting.current = true;
        const { x, y } = getCoordinates(e);
        const newPath: PeinturePath = {
            id: Date.now(),
            type: 'path',
            d: `M ${x.toFixed(2)} ${y.toFixed(2)}`,
            stroke: selectedColor,
            strokeWidth: brushSize,
            strokeLinecap: brushShape,
        };
        setLivePath(newPath);
    }
  };

  const onCanvasMouseMove = (e: React.MouseEvent) => {
    if (mode === 'vitrail' && dragInfo.current) {
        const { x: mouseX, y: mouseY } = getCoordinates(e);
        const dx = mouseX - dragInfo.current.startX;
        const dy = mouseY - dragInfo.current.startY;
        setElements(prevElements => 
          prevElements.map(el => {
            if (el.id === dragInfo.current?.elementId && el.type !== 'path') {
              return { ...el, x: dragInfo.current.elementStartX + dx, y: dragInfo.current.elementStartY + dy };
            }
            return el;
          })
        );
    } else if (mode === 'peinture' && isPainting.current && livePath) {
        const { x, y } = getCoordinates(e);
        setLivePath(prevPath => prevPath ? { ...prevPath, d: prevPath.d + ` L ${x.toFixed(2)} ${y.toFixed(2)}` } : null);
    }
  };

  const onCanvasMouseUp = () => {
    if (mode === 'vitrail') {
        dragInfo.current = null;
    } else if (mode === 'peinture') {
        if (isPainting.current && livePath && livePath.d.length > 20) {
            setElements(prev => [...prev, livePath]);
        }
        isPainting.current = false;
        setLivePath(null);
    }
  };
  
  const canvasContainerClass = mode === 'vitrail' ? 'bg-cover bg-center' : 'bg-white cursor-crosshair';
  const canvasContainerStyle = mode === 'vitrail' ? { backgroundImage: "url('https://images.unsplash.com/photo-1572293009833-b13a3223f063?q=80&w=1200&auto=format&fit=crop')" } : {};

  const brushSizes = [{label: 'Fin', value: 0.5}, {label: 'Moyen', value: 1}, {label: 'Large', value: 2}];
  // Fix: Add `as const` to ensure TypeScript infers the literal types for `value`, not a generic `string`.
  const brushShapes = [{label: 'Rond', value: 'round'}, {label: 'Carré', value: 'square'}] as const;

  return (
    <ScreenLayout response={response}>
      <div className="flex flex-col md:flex-row gap-6 h-full max-h-[calc(100vh-350px)]">
        <div className="w-full md:w-1/3 bg-gray-900/50 p-4 rounded-lg flex flex-col justify-between">
          <div>
            <h3 className="text-xl font-bold text-yellow-400 mb-2">Défi Créatif (2 min)</h3>
            <ul className="list-disc list-inside text-gray-300 space-y-1">
              {defi.map((step, i) => <li key={i}>{step}</li>)}
            </ul>
          </div>
          <div className="space-y-4">
            <div>
              <h4 className="text-lg font-bold mb-2">Palette</h4>
              <div className="grid grid-cols-3 gap-2">
                {palette.map(color => (
                  <button key={color} style={{ backgroundColor: color }} className={`h-12 w-full rounded-md border-2 transition-transform transform hover:scale-110 ${selectedColor === color ? 'border-white scale-110' : 'border-transparent'}`} onClick={() => setSelectedColor(color)} />
                ))}
              </div>
            </div>
            
            <div>
              <h4 className="text-lg font-bold mb-2">Outils</h4>
              {mode === 'vitrail' && (
                <div className="space-y-2">
                  <div className="flex gap-2">
                    <button onClick={() => addVitrailShape('rect')} className="bg-cyan-600 hover:bg-cyan-500 w-full p-2 rounded-md">Ajouter Carré</button>
                    <button onClick={() => addVitrailShape('circle')} className="bg-cyan-600 hover:bg-cyan-500 w-full p-2 rounded-md">Ajouter Cercle</button>
                  </div>
                  <button onClick={deleteSelectedElement} disabled={selectedElementId === null} className="bg-red-600 hover:bg-red-500 w-full p-2 rounded-md disabled:bg-gray-600 disabled:cursor-not-allowed">Supprimer la forme</button>
                </div>
              )}
              {mode === 'peinture' && (
                <div className="space-y-4">
                    <div>
                        <h5 className="font-bold mb-2 text-gray-300">Taille du pinceau</h5>
                        <div className="flex gap-2">
                            {brushSizes.map(({label, value}) => (
                                <button key={value} onClick={() => setBrushSize(value)} className={`w-full p-2 rounded-md transition-colors ${brushSize === value ? 'bg-cyan-500 text-white' : 'bg-gray-700 hover:bg-gray-600 text-gray-300'}`}>{label}</button>
                            ))}
                        </div>
                    </div>
                    <div>
                        <h5 className="font-bold mb-2 text-gray-300">Forme du pinceau</h5>
                        <div className="flex gap-2">
                            {brushShapes.map(({label, value}) => (
                                <button key={value} onClick={() => setBrushShape(value)} className={`w-full p-2 rounded-md transition-colors ${brushShape === value ? 'bg-cyan-500 text-white' : 'bg-gray-700 hover:bg-gray-600 text-gray-300'}`}>{label}</button>
                            ))}
                        </div>
                    </div>
                    <button onClick={() => setElements([])} className="bg-red-600 hover:bg-red-500 w-full p-2 rounded-md">Tout effacer</button>
                </div>
              )}
            </div>
            <button onClick={finishAndSave} className="bg-green-600 hover:bg-green-500 w-full p-3 rounded-md font-bold text-lg">Terminer et Enregistrer</button>
          </div>
        </div>

        <div className={`w-full md:w-2/3 rounded-lg overflow-hidden relative ${canvasContainerClass}`} style={canvasContainerStyle}>
          <svg ref={svgRef} viewBox="0 0 100 100" className={`w-full h-full absolute top-0 left-0`} preserveAspectRatio="xMidYMid slice" onMouseDown={onCanvasMouseDown} onMouseMove={onCanvasMouseMove} onMouseUp={onCanvasMouseUp} onMouseLeave={onCanvasMouseUp}>
            {elements.map(el => {
              if (el.type === 'rect' || el.type === 'circle') {
                const isSelected = el.id === selectedElementId;
                const shapeProps = {
                    key: el.id,
                    onMouseDown: (e: React.MouseEvent) => onShapeMouseDown(e, el),
                    fill: el.fill,
                    fillOpacity: "0.75",
                    stroke: isSelected ? 'yellow' : '#111827',
                    strokeWidth: isSelected ? 1 : 0.5,
                    className: "cursor-move"
                };
                if (el.type === 'rect') {
                    return <rect {...shapeProps} x={el.x} y={el.y} width={el.width} height={el.height} />;
                }
                return <circle {...shapeProps} cx={el.x + el.width / 2} cy={el.y + el.height / 2} r={Math.min(el.width, el.height) / 2} />;
              }
              if (el.type === 'path') {
                return <path key={el.id} d={el.d} stroke={el.stroke} strokeWidth={el.strokeWidth} fill="none" strokeLinecap={el.strokeLinecap} strokeLinejoin="round" />;
              }
              return null;
            })}
            {livePath && <path d={livePath.d} stroke={livePath.stroke} strokeWidth={livePath.strokeWidth} fill="none" strokeLinecap={livePath.strokeLinecap} strokeLinejoin="round" />}
          </svg>
        </div>
      </div>
    </ScreenLayout>
  );
};

export default AtelierScreen;
