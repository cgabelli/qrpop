import React, { useState, useRef, useEffect } from "react";
import { Stage, Layer, Text, Image as KonvaImage, Rect, Transformer } from "react-konva";
import useImage from "use-image";
import { v4 as uuidv4 } from "uuid";
import { Copy, Trash2, Type, Image as ImageIcon, Square, UploadCloud, Save, ChevronLeft, Wand2, X, Sparkles } from "lucide-react";

const GOOGLE_FONTS = [
  "Inter",
  "Playfair Display",
  "Montserrat",
  "Outfit",
  "Bebas Neue",
  "Space Grotesk",
  "Cinzel"
];

const PRESET_COLORS = [
  "#ffffff", "#f8fafc", "#f1f5f9", "#e2e8f0", "#94a3b8", "#475569", "#0f172a", "#000000",
  "#ef4444", "#f97316", "#f59e0b", "#84cc16", "#22c55e", "#06b6d4", "#3b82f6", "#8b5cf6", "#d946ef", "#f43f5e"
];

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
  align?: string;
}

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
          fontFamily={shapeProps.fontFamily}
          onDragEnd={(e) => {
            onChange({ ...shapeProps, x: e.target.x(), y: e.target.y() });
          }}
          onTransformEnd={(e) => {
            const node = shapeRef.current;
            const scaleX = node.scaleX();
            node.scaleX(1);
            node.scaleY(1);
            onChange({
              ...shapeProps,
              x: node.x(),
              y: node.y(),
              fontSize: Math.max(12, shapeProps.fontSize * scaleX),
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
            onChange({ ...shapeProps, x: e.target.x(), y: e.target.y() });
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
            onChange({ ...shapeProps, x: e.target.x(), y: e.target.y() });
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
          borderStroke="hsl(262 83% 68%)"
          anchorFill="hsl(262 83% 68%)"
          anchorStroke="#fff"
          anchorSize={12}
          anchorCornerRadius={6}
          borderDash={[4, 4]}
          padding={8}
          boundBoxFunc={(oldBox, newBox) => {
            if (newBox.width < 10 || newBox.height < 10) return oldBox;
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
  const [aiWizardOpen, setAiWizardOpen] = useState(false);
  const [aiForm, setAiForm] = useState({ prodotto: "", offerta: "", tono: "Accattivante e Persuasivo" });
  const [aiLoading, setAiLoading] = useState(false);
  
  // Format: Instagram Story Portrait (1080x1920) scaled for UI
  const CANVAS_WIDTH = 1080;
  const CANVAS_HEIGHT = 1920;
  
  // Responsive Scale Logic
  const containerRef = useRef<HTMLDivElement>(null);
  const [stageScale, setStageScale] = useState(0.3);

  // Load Fonts
  useEffect(() => {
    const link = document.createElement("link");
    link.href = `https://fonts.googleapis.com/css2?${GOOGLE_FONTS.map(f => `family=${f.replace(/ /g, "+")}:wght@400;600;800`).join("&")}&display=swap`;
    link.rel = "stylesheet";
    document.head.appendChild(link);
    return () => { document.head.removeChild(link); }
  }, []);

  useEffect(() => {
    const handleResize = () => {
      if (containerRef.current) {
        const { width, height } = containerRef.current.getBoundingClientRect();
        // Calculate fit containing 90% of available space
        const scaleX = (width * 0.9) / CANVAS_WIDTH;
        const scaleY = (height * 0.9) / CANVAS_HEIGHT;
        setStageScale(Math.min(scaleX, scaleY));
      }
    };
    window.addEventListener("resize", handleResize);
    handleResize();
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const checkDeselect = (e: any) => {
    if (e.target === e.target.getStage()) {
      selectShape(null);
    }
  };

  const addElement = (element: Partial<ElementData>) => {
    setElements((prev) => [...prev, { id: uuidv4(), ...element } as ElementData]);
  };

  const updateSelected = (attrs: Partial<ElementData>) => {
    setElements(elements.map(el => el.id === selectedId ? { ...el, ...attrs } : el));
  };

  const handleExportAndSave = async () => {
    if (!stageRef.current) return;
    setSaving(true);
    selectShape(null);
    
    setTimeout(async () => {
      try {
        const dataUrl = stageRef.current.toDataURL({ pixelRatio: 2 });
        const res = await fetch(dataUrl);
        const blob = await res.blob();
        const file = new File([blob], `promo_${Date.now()}.png`, { type: "image/png" });
        
        const fd = new FormData();
        fd.append("file", file);
        fd.append("qrSpotId", qrSpot.id);

        const apiRes = await fetch("/api/creativita", { method: "POST", body: fd });
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
    }, 150);
  };

  const selectedElement = elements.find((el) => el.id === selectedId);

  const handleGenerateAi = async () => {
    setAiLoading(true);
    try {
      const res = await fetch("/api/ai/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(aiForm)
      });
      const data = await res.json();
      if (!res.ok) {
        alert(data.error || "Errore AI");
      } else {
        const { titolo, sottotitolo } = data.data;
        // Inject Titolo
        addElement({ type: "text", text: titolo, x: 100, y: 400, fontSize: 120, fontFamily: "Bebas Neue", fill: "#ffffff" });
        // Inject Sottotitolo
        setTimeout(() => {
           addElement({ type: "text", text: sottotitolo, x: 100, y: 550, fontSize: 50, fontFamily: "Montserrat", fill: "#ffffff" });
        }, 100);
        setAiWizardOpen(false);
        setAiForm({ prodotto: "", offerta: "", tono: "Accattivante e Persuasivo" });
      }
    } catch (e) {
      alert("Errore di rete con OpenAI");
    }
    setAiLoading(false);
  };

  return (
    <div style={{ flex: 1, display: "flex", overflow: "hidden", background: "hsl(240 10% 4%)" }}>
      
      {/* LEFT SIDEBAR (TOOLS) */}
      <div style={{ width: 80, background: "hsl(240 6% 6%)", borderRight: "1px solid rgba(255,255,255,0.06)", display: "flex", flexDirection: "column", alignItems: "center", padding: "24px 0", zIndex: 20, gap: 24 }}>
         
         <button className="tool-btn" onClick={() => addElement({ type: "text", text: "INSERISCI TESTO", x: 100, y: 100, fontSize: 80, fontFamily: "Montserrat", fill: "#ffffff" })}>
           <Type size={24} color="hsl(240 5% 70%)" />
           <span style={{ fontSize: 10, color: "hsl(240 5% 60%)", marginTop: 6, fontWeight: 600 }}>Testo</span>
         </button>

         <button className="tool-btn" onClick={() => setAiWizardOpen(true)}>
           <Wand2 size={24} color="hsl(262 83% 68%)" />
           <span style={{ fontSize: 10, color: "hsl(262 83% 68%)", marginTop: 6, fontWeight: 700 }}>AI Copy</span>
         </button>
         
         <button className="tool-btn" onClick={() => addElement({ type: "image", src: "https://images.unsplash.com/photo-1513104890138-7c749659a591?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w1NTM1NDB8MHwxfHNlYXJjaHwxfHxwaXp6YXxlbnwwfHx8fDE3MTI4MzE2MzZ8MA&ixlib=rb-4.0.3&q=80&w=1080", x: 0, y: 0, width: CANVAS_WIDTH })}>
           <ImageIcon size={24} color="hsl(240 5% 70%)" />
           <span style={{ fontSize: 10, color: "hsl(240 5% 60%)", marginTop: 6, fontWeight: 600 }}>Immagine</span>
         </button>

         <button className="tool-btn" onClick={() => addElement({ type: "rect", x: 0, y: 0, width: CANVAS_WIDTH, height: CANVAS_HEIGHT, fill: "#000000", opacity: 0.5 })}>
           <Square size={24} color="hsl(240 5% 70%)" />
           <span style={{ fontSize: 10, color: "hsl(240 5% 60%)", marginTop: 6, fontWeight: 600 }}>Filtro Scuro</span>
         </button>

         <div style={{ flex: 1 }} />
         
         <button onClick={handleExportAndSave} disabled={saving || elements.length === 0} style={{ display: "flex", flexDirection: "column", alignItems: "center", background: "none", border: "none", cursor: "pointer", opacity: (saving || elements.length===0) ? 0.3 : 1 }}>
           <div style={{ width: 44, height: 44, borderRadius: "50%", background: "linear-gradient(135deg, hsl(262 83% 58%), hsl(330 81% 60%))", display: "flex", alignItems: "center", justifyContent: "center", boxShadow: "0 4px 15px rgba(219,39,119,0.4)" }}>
             {saving ? <UploadCloud size={20} color="white" /> : <Save size={20} color="white" />}
             
           </div>
           <span style={{ fontSize: 10, color: "white", marginTop: 8, fontWeight: 700 }}>SALVA</span>
         </button>

      </div>

      {/* MAIN AREA */}
      <div style={{ flex: 1, display: "flex", flexDirection: "column", position: "relative" }}>
        
        {/* CONTEXTUAL TOP BAR */}
        <div style={{ height: 60, background: "rgba(9, 9, 11, 0.8)", backdropFilter: "blur(20px)", borderBottom: "1px solid rgba(255,255,255,0.06)", display: "flex", alignItems: "center", padding: "0 24px", gap: 20, zIndex: 10 }}>
          {selectedElement ? (
            <>
              {selectedElement.type === "text" && (
                <>
                  <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
                    <Type size={16} color="hsl(240 5% 60%)" />
                    <select 
                      value={selectedElement.fontFamily} 
                      onChange={(e) => updateSelected({ fontFamily: e.target.value })}
                      style={{ background: "rgba(255,255,255,0.05)", color: "white", border: "1px solid rgba(255,255,255,0.1)", borderRadius: 6, padding: "6px 12px", outline: "none",fontFamily: selectedElement.fontFamily }}
                    >
                      {GOOGLE_FONTS.map(f => <option key={f} value={f} style={{ color: "black", fontFamily: f }}>{f}</option>)}
                    </select>
                  </div>
                  
                  <div style={{ width: 1, height: 24, background: "rgba(255,255,255,0.1)" }} />
                </>
              )}

              {(selectedElement.type === "text" || selectedElement.type === "rect") && (
                <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                  <div style={{ width: 24, height: 24, borderRadius: "50%", background: selectedElement.fill, border: "2px solid rgba(255,255,255,0.2)" }} />
                  <input type="color" value={selectedElement.fill} onChange={e => updateSelected({ fill: e.target.value })} style={{ opacity: 0, position: "absolute", width: 24, height: 24, cursor: "pointer" }} />
                </div>
              )}

              <div style={{ flex: 1 }} />
              
              <button 
                onClick={() => setElements(elements.filter(el => el.id !== selectedId))}
                style={{ background: "rgba(225,29,72,0.1)", color: "hsl(340 82% 65%)", border: "none", padding: "8px 16px", borderRadius: 8, display: "flex", alignItems: "center", gap: 8, cursor: "pointer" }}
              >
                <Trash2 size={16} /> Elimina
              </button>
            </>
          ) : (
            <div style={{ color: "hsl(240 5% 50%)", fontSize: 13, fontWeight: 500 }}>
              Nessun elemento selezionato. Clicca sul foglio per modificarlo.
            </div>
          )}
        </div>

        {/* WORKSPACE CANVAS */}
        <div ref={containerRef} style={{ flex: 1, position: "relative", display: "flex", alignItems: "center", justifyContent: "center", 
          backgroundImage: "radial-gradient(circle, rgba(255,255,255,0.05) 1px, transparent 1px)", backgroundSize: "20px 20px" }}>
          
          <div style={{
            width: CANVAS_WIDTH * stageScale,
            height: CANVAS_HEIGHT * stageScale,
            boxShadow: "0 40px 100px rgba(0,0,0,0.8), 0 0 0 1px rgba(255,255,255,0.05)",
            background: "white",
            position: "relative"
          }}>
            <Stage
              width={CANVAS_WIDTH * stageScale}
              height={CANVAS_HEIGHT * stageScale}
              scale={{ x: stageScale, y: stageScale }}
              onMouseDown={checkDeselect}
              onTouchStart={checkDeselect}
              ref={stageRef}
            >
              <Layer>
                <Rect x={0} y={0} width={CANVAS_WIDTH} height={CANVAS_HEIGHT} fill="white" />
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

        {/* DOUBLE TAP TEXT EDITOR OVERLAY */}
        {selectedElement?.type === "text" && (
           <div style={{ position: "absolute", bottom: 24, left: "50%", transform: "translateX(-50%)", background: "rgba(9, 9, 11, 0.9)", backdropFilter: "blur(20px)", padding: 16, borderRadius: 16, border: "1px solid rgba(255,255,255,0.1)", display: "flex", flexDirection: "column", gap: 12, width: "90%", maxWidth: 500, zIndex: 30, boxShadow: "0 20px 40px rgba(0,0,0,0.5)"}}>
              <div style={{ fontSize: 12, color: "hsl(240 5% 65%)", fontWeight: 600 }}>Cosa vuoi scrivere?</div>
              <textarea 
                 value={selectedElement.text} 
                 onChange={(e) => updateSelected({ text: e.target.value })}
                 style={{ width: "100%", background: "rgba(0,0,0,0.5)", color: "white", border: "1px solid rgba(255,255,255,0.1)", borderRadius: 8, padding: 12, minHeight: 80, fontSize: 16, fontFamily: selectedElement.fontFamily, resize: "none" }}
              />
           </div>
        )}

        {/* AI WIZARD MODAL */}
        {aiWizardOpen && (
          <div style={{ position: "absolute", top: 0, left: 0, right: 0, bottom: 0, background: "rgba(0,0,0,0.8)", backdropFilter: "blur(5px)", zIndex: 50, display: "flex", alignItems: "center", justifyContent: "center" }}>
            <div style={{ background: "hsl(240 6% 10%)", border: "1px solid rgba(255,255,255,0.1)", borderRadius: 24, width: "100%", maxWidth: 460, padding: 32, position: "relative", boxShadow: "0 20px 60px rgba(0,0,0,0.5)" }}>
              <button 
                onClick={() => setAiWizardOpen(false)} 
                style={{ position: "absolute", top: 24, right: 24, background: "none", border: "none", color: "hsl(240 5% 60%)", cursor: "pointer" }}
              >
                <X size={20} />
              </button>
              
              <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 8 }}>
                <div style={{ width: 40, height: 40, borderRadius: "50%", background: "rgba(124,58,237,0.1)", display: "flex", alignItems: "center", justifyContent: "center" }}>
                  <Sparkles size={20} color="hsl(262 83% 68%)" />
                </div>
                <h2 style={{ fontSize: 20, fontWeight: 700, color: "white" }}>Scrittore AI Integrato</h2>
              </div>
              <p style={{ color: "hsl(240 5% 65%)", fontSize: 14, marginBottom: 24 }}>Comunichiamo con la tua chiave OpenAI per generare hook perfetti per questa grafica.</p>

              <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
                <div>
                  <label style={{ display: "block", fontSize: 13, color: "hsl(240 5% 70%)", marginBottom: 6 }}>Progetto / Cosa vendi?</label>
                  <input type="text" className="input-field" placeholder="Es. Nuova Pokè al Salmone..." value={aiForm.prodotto} onChange={e => setAiForm({ ...aiForm, prodotto: e.target.value })} style={{ width: "100%" }} />
                </div>
                <div>
                  <label style={{ display: "block", fontSize: 13, color: "hsl(240 5% 70%)", marginBottom: 6 }}>Offerta (Opzionale ma consigliato)</label>
                  <input type="text" className="input-field" placeholder="Es. Bibita in omaggio / -20% a pranzo" value={aiForm.offerta} onChange={e => setAiForm({ ...aiForm, offerta: e.target.value })} style={{ width: "100%" }} />
                </div>
                <div>
                  <label style={{ display: "block", fontSize: 13, color: "hsl(240 5% 70%)", marginBottom: 6 }}>Tono di Voce</label>
                  <select className="input-field" value={aiForm.tono} onChange={e => setAiForm({ ...aiForm, tono: e.target.value })} style={{ width: "100%" }}>
                    <option value="Accattivante e Persuasivo">Accattivante e Persuasivo</option>
                    <option value="Giovane e Dinamico">Giovane e Dinamico</option>
                    <option value="Elegante e Formale">Elegante e Formale</option>
                    <option value="Urgente (Scarsità)">Urgente (Call to Action massiva)</option>
                  </select>
                </div>
                <button 
                  onClick={handleGenerateAi} 
                  disabled={aiLoading || !aiForm.prodotto} 
                  className="btn-primary" 
                  style={{ width: "100%", padding: 14, marginTop: 8, justifyContent: "center", display: "flex", alignItems: "center", gap: 8 }}
                >
                  {aiLoading ? "Generazione in corso..." : "Genera Testo in Automatico"}
                </button>
              </div>
            </div>
          </div>
        )}

      </div>
      <style dangerouslySetInnerHTML={{__html: `
        .tool-btn {
          width: 56px;
          height: 56px;
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          background: transparent;
          border: none;
          border-radius: 12px;
          cursor: pointer;
          transition: all 0.2s;
        }
        .tool-btn:hover {
          background: rgba(255,255,255,0.05);
        }
      `}} />
    </div>
  );
}
