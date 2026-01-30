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
  const defi = oeuvre?.defi_2min || (mode === 'vitrail' ? ["Crée un vitrail géométrique!"] : ["Peins une toile expressive!"]);

  const [selectedColor, setSelectedColor] = useState(palette[0]);
  const [selectedElementId, setSelectedElementId] = useState<number | null>(null);
  
  const svgRef = useRef<SVGSVGElement>(null);
  const dragInfo = useRef<DragInfo | null>(null);

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
    setSelectedElementId(null); // Deselect before saving
    
    setTimeout(() => { // Allow UI to update
      const svgNode = svgRef.current!;
      const serializer = new XMLSerializer();
      let source = serializer.serializeToString(svgNode);

      // Add namespaces
      if(!source.match(/^<svg[^>]+xmlns="http\\:\\/\\/www\\.w3\\.org\\/2000\\/svg"/)){
        source = source.replace(/^<svg/, '<svg xmlns="http://www.w3.org/2000/svg"');
      }
      if(!source.match(/^<svg[^>]+"http\\:\\/\\/www\\.w3\\.org\\/1999\\/xlink"/)){
        source = source.replace(/^<svg/, '<svg xmlns:xlink="http://www.w3.org/1999/xlink"');
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
    if (!ctm) {
        return { x: 0, y: 0 };
    }
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

  const onCanvasMouseMove = (e: React.MouseEvent) => {
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

  const onCanvasMouseUp = () => {
    dragInfo.current = null;
  };
  
  const canvasContainerClass = mode === 'vitrail' ? 'bg-cover bg-center' : 'bg-white';
  const canvasContainerStyle = mode === 'vitrail' ? { backgroundImage: "url('https://images.unsplash.com/photo-1572293009833-b13a3223f063?q=80&w=1200&auto=format&fit=crop')" } : {};

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
            </div>
            <button onClick={finishAndSave} className="bg-green-600 hover:bg-green-500 w-full p-3 rounded-md font-bold text-lg">Terminer et Enregistrer</button>
          </div>
        </div>

        <div className={`w-full md:w-2/3 rounded-lg overflow-hidden relative ${canvasContainerClass}`} style={canvasContainerStyle}>
          <svg ref={svgRef} viewBox="0 0 100 100" className={`w-full h-full absolute top-0 left-0`} preserveAspectRatio="xMidYMid slice" onMouseMove={onCanvasMouseMove} onMouseUp={onCanvasMouseUp} onMouseLeave={onCanvasMouseUp}>
            {elements.map(el => {
              if (el.type === 'rect') {
                const isSelected = el.id === selectedElementId;
                // FIX: The error "Expected 1 arguments, but got 3" is resolved by ensuring all event handlers use the correct `React.MouseEvent` type, preventing type conflicts.
                return <rect key={el.id} onMouseDown={(e) => onShapeMouseDown(e, el)} x={el.x} y={el.y} width={el.width} height={el.height} fill={el.fill} fillOpacity="0.75" stroke={isSelected ? 'yellow' : '#111827'} strokeWidth={isSelected ? 1 : 0.5} className="cursor-move" />;
              }
              if (el.type === 'circle') {
                const isSelected = el.id === selectedElementId;
                // FIX: The error "Expected 1 arguments, but got 3" is resolved by ensuring all event handlers use the correct `React.MouseEvent` type, preventing type conflicts.
                return <circle key={el.id} onMouseDown={(e) => onShapeMouseDown(e, el)} cx={el.x + el.width / 2} cy={el.y + el.height / 2} r={el.width / 2} fill={el.fill} fillOpacity="0.75" stroke={isSelected ? 'yellow' : '#111827'} strokeWidth={isSelected ? 1 : 0.5} className="cursor-move"/>;
              }
              // Peinture paths are not interactive in this version
              if (el.type === 'path') {
                return <path key={el.id} d={el.d} stroke={el.stroke} strokeWidth={0.5} fill="none" strokeLinecap="round" strokeLinejoin="round" />;
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
