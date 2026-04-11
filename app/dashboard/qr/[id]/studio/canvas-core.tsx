import React, { useState, useRef, useEffect } from "react";
import { Stage, Layer, Text, Image as KonvaImage, Rect, Transformer } from "react-konva";
import useImage from "use-image";
import { v4 as uuidv4 } from "uuid";

interface ElementData {
  id: string;
  type: "text" | "image" | "rect";
  x: number;
  y: number;
  width?: number;
  height?: number;
  text?: string;
  fontSize?: number;
  fontFamily?: string;
  fill?: string;
  opacity?: number;
  src?: string;
}

// Sub-component for resizable nodes
const ResizableElement = ({
  shapeProps,
  isSelected,
  onSelect,
  onChange,
}: any) => {
  const shapeRef = useRef<any>(null);
  const trRef = useRef<any>(null);
  const [img] = useImage(shapeProps.src || "", "anonymous");

  useEffect(() => {
    if (isSelected && trRef.current && shapeRef.current) {
      trRef.current.nodes([shapeRef.current]);
      trRef.current.getLayer().batchDraw();
    }
  }, [isSelected]);

  return (
    <React.Fragment>
      {shapeProps.type === "text" && (
        <Text
          onClick={onSelect}
          onTap={onSelect}
          ref={shapeRef}
          {...shapeProps}
          draggable
          onDragEnd={(e) => {
            onChange({
              ...shapeProps,
              x: e.target.x(),
              y: e.target.y(),
            });
          }}
          onTransformEnd={(e) => {
            const node = shapeRef.current;
            const scaleX = node.scaleX();
            const scaleY = node.scaleY();
            node.scaleX(1);
            node.scaleY(1);
            onChange({
              ...shapeProps,
              x: node.x(),
              y: node.y(),
              // width: Math.max(5, node.width() * scaleX),
              fontSize: shapeProps.fontSize * scaleX,
            });
          }}
        />
      )}

      {shapeProps.type === "image" && (
        <KonvaImage
          image={img}
          onClick={onSelect}
          onTap={onSelect}
          ref={shapeRef}
          {...shapeProps}
          draggable
          onDragEnd={(e) => {
            onChange({
              ...shapeProps,
              x: e.target.x(),
              y: e.target.y(),
            });
          }}
          onTransformEnd={(e) => {
            const node = shapeRef.current;
            const scaleX = node.scaleX();
            const scaleY = node.scaleY();
            node.scaleX(1);
            node.scaleY(1);
            onChange({
              ...shapeProps,
              x: node.x(),
              y: node.y(),
              width: Math.max(5, node.width() * scaleX),
              height: Math.max(5, node.height() * scaleY),
            });
          }}
        />
      )}

      {shapeProps.type === "rect" && (
        <Rect
          onClick={onSelect}
          onTap={onSelect}
          ref={shapeRef}
          {...shapeProps}
          draggable
          onDragEnd={(e) => {
            onChange({
              ...shapeProps,
              x: e.target.x(),
              y: e.target.y(),
            });
          }}
          onTransformEnd={(e) => {
            const node = shapeRef.current;
            const scaleX = node.scaleX();
            const scaleY = node.scaleY();
            node.scaleX(1);
            node.scaleY(1);
            onChange({
              ...shapeProps,
              x: node.x(),
              y: node.y(),
              width: Math.max(5, node.width() * scaleX),
              height: Math.max(5, node.height() * scaleY),
            });
          }}
        />
      )}

      {isSelected && (
        <Transformer
          ref={trRef}
          boundBoxFunc={(oldBox, newBox) => {
            // limit resize
            if (newBox.width < 5 || newBox.height < 5) return oldBox;
            return newBox;
          }}
        />
      )}
    </React.Fragment>
  );
};

export default function CanvasCore({ qrSpot }: any) {
  const stageRef = useRef<any>(null);
  const [elements, setElements] = useState<ElementData[]>([]);
  const [selectedId, selectShape] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);
  const [canvasSize, setCanvasSize] = useState({ width: 800, height: 1080 }); // Vertical story format

  // Unselect when clicking on empty stage space
  const checkDeselect = (e: any) => {
    const clickedOnEmpty = e.target === e.target.getStage();
    if (clickedOnEmpty) {
      selectShape(null);
    }
  };

  const handleAddText = () => {
    setElements([...elements, {
      id: uuidv4(),
      type: "text",
      text: "Nuovo Testo",
      x: 100,
      y: 100,
      fontSize: 48,
      fontFamily: "sans-serif",
      fill: "#ffffff",
    }]);
  };

  const handleAddImage = (src: string) => {
    setElements([...elements, {
      id: uuidv4(),
      type: "image",
      src: src,
      x: 0,
      y: 0,
      width: canvasSize.width, // auto fit width
      height: undefined, // height auto-computed by konva if only width provided, but let's provide a rough height
    }]);
  };

  const handleAddOverlay = () => {
    setElements([...elements, {
      id: uuidv4(),
      type: "rect",
      x: 0,
      y: 0,
      width: canvasSize.width,
      height: canvasSize.height,
      fill: "#000000",
      opacity: 0.5,
    }]);
  };

  const handleDeleteSelected = () => {
    if (!selectedId) return;
    setElements(elements.filter((el) => el.id !== selectedId));
    selectShape(null);
  };

  const selectedElement = elements.find((el) => el.id === selectedId);

  const handleExportAndSave = async () => {
    if (!stageRef.current) return;
    setSaving(true);
    selectShape(null); // Deselect before capturing so transformer goes away
    
    // Wait for state propagation so transformer borders disappear
    setTimeout(async () => {
      try {
        const dataUrl = stageRef.current.toDataURL({ pixelRatio: 2 }); // High res
        // Convert base64 to file
        const res = await fetch(dataUrl);
        const blob = await res.blob();
        const file = new File([blob], `promo_${Date.now()}.png`, { type: "image/png" });
        
        const fd = new FormData();
        fd.append("file", file);
        fd.append("qrSpotId", qrSpot.id);

        const apiRes = await fetch("/api/creativita", {
          method: "POST",
          body: fd,
        });

        if (apiRes.ok) {
           window.location.href = `/dashboard/qr/${qrSpot.id}`;
        } else {
           alert("Errore salvataggio!");
        }
      } catch (err) {
        console.error(err);
        alert("Errore generazione immagine");
      }
      setSaving(false);
    }, 100);
  };

  return (
    <div style={{ flex: 1, display: "flex", overflow: "hidden" }}>
      {/* Left Panel */}
      <div style={{ width: 300, background: "hsl(240 6% 6%)", borderRight: "1px solid rgba(255,255,255,0.06)", display: "flex", flexDirection: "column", padding: 20, zIndex: 10 }}>
        <h3 style={{ color: "white", fontSize: 16, marginBottom: 20 }}>Libreria Elementi</h3>
        
        <div style={{ display: "flex", flexDirection: "column", gap: 12, marginBottom: 40 }}>
           <button onClick={handleAddText} className="btn-secondary" style={{ width: "100%", justifyContent: "center" }}>✍️ Aggiungi Testo</button>
           <button onClick={handleAddOverlay} className="btn-secondary" style={{ width: "100%", justifyContent: "center" }}>⬛ Aggiungi Sfondo Scurito</button>
           <button onClick={() => handleAddImage("https://images.unsplash.com/photo-1513104890138-7c749659a591?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w1NTM1NDB8MHwxfHNlYXJjaHwxfHxwaXp6YXxlbnwwfHx8fDE3MTI4MzE2MzZ8MA&ixlib=rb-4.0.3&q=80&w=1080")} className="btn-secondary" style={{ width: "100%", justifyContent: "center" }}>🍕 Sfondo Pizza Demo</button>
           <button onClick={() => handleAddImage("https://images.unsplash.com/photo-1544148103-0773bf10d330?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w1NTM1NDB8MHwxfHNlYXJjaHwxfHxiZWVyfGVufDB8fHx8MTcxMjgzODI1M3ww&ixlib=rb-4.0.3&q=80&w=1080")} className="btn-secondary" style={{ width: "100%", justifyContent: "center" }}>🍺 Sfondo Birra Demo</button>
        </div>

        {selectedElement && selectedElement.type === "text" && (
          <div style={{ background: "rgba(255,255,255,0.03)", padding: 16, borderRadius: 12, marginBottom: 20 }}>
            <div style={{ fontSize: 12, color: "hsl(240 5% 60%)", marginBottom: 8, textTransform: "uppercase" }}>Modifica Testo</div>
            <textarea 
               value={selectedElement.text} 
               onChange={(e) => {
                 setElements(elements.map(el => el.id === selectedId ? { ...el, text: e.target.value } : el));
               }}
               style={{ width: "100%", background: "black", color: "white", border: "1px solid rgba(255,255,255,0.1)", borderRadius: 6, padding: 8, minHeight: 80, fontSize: 14 }}
            />
            <div style={{ display: "flex", gap: 10, marginTop: 12 }}>
               <label style={{ fontSize: 13, color: "hsl(240 5% 65%)", display: "flex", flexDirection: "column", gap: 4 }}>
                 Colore
                 <input type="color" value={selectedElement.fill} onChange={e => setElements(elements.map(el => el.id === selectedId ? { ...el, fill: e.target.value } : el))} />
               </label>
            </div>
          </div>
        )}

        <div style={{ marginTop: "auto" }}>
           <button onClick={handleDeleteSelected} disabled={!selectedId} className="btn-secondary" style={{ width: "100%", justifyContent: "center", marginBottom: 12, color: "hsl(340 82% 65%)" }}>🗑️ Elimina Elemento</button>
           <button onClick={handleExportAndSave} disabled={saving || elements.length === 0} className="btn-primary" style={{ width: "100%", justifyContent: "center", padding: 16 }}>
             {saving ? "Salvataggio..." : "⚡ Applica al QR"}
           </button>
        </div>
      </div>

      {/* Editor Center Container */}
      <div style={{ flex: 1, position: "relative", background: "hsl(240 8% 8%)", display: "flex", alignItems: "center", justifyContent: "center", overflow: "auto" }}>
        {/* Shadow Drop zone wrapper */}
        <div style={{ 
          width: canvasSize.width, 
          height: canvasSize.height, 
          background: "white", 
          boxShadow: "0 20px 60px rgba(0,0,0,0.5)", 
          transform: "scale(0.6)", // Scalato visivamente per entrare nello schermo
          transformOrigin: "center"
        }}>
           <Stage
             width={canvasSize.width}
             height={canvasSize.height}
             onMouseDown={checkDeselect}
             onTouchStart={checkDeselect}
             ref={stageRef}
           >
             <Layer>
                {/* Il background bianco lo garantisce lo Stage se draw, ma in jpg serve metterlo come rect */}
                <Rect x={0} y={0} width={canvasSize.width} height={canvasSize.height} fill="white" />
                
                {elements.map((el, i) => (
                  <ResizableElement
                    key={el.id}
                    shapeProps={el}
                    isSelected={el.id === selectedId}
                    onSelect={() => selectShape(el.id)}
                    onChange={(newAttrs: any) => {
                      const rects = elements.slice();
                      rects[i] = newAttrs;
                      setElements(rects);
                    }}
                  />
                ))}
             </Layer>
           </Stage>
        </div>
      </div>
    </div>
  );
}
