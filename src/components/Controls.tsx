import React, { useRef } from "react";
import { type CardState, type AspectRatio, type Layout as LayoutType } from "@/types/card";
import { Download, Layout as LayoutIcon, Type, Palette, User, Maximize, Sparkles, AlignLeft, AlignCenter, Image as ImageIcon, Quote, MessageSquare, List as ListIcon, BookOpen, BookType, HelpCircle, ListOrdered, Terminal, Wand2, Grid } from "lucide-react";
import { cn } from "@/lib/utils";

interface ControlsProps {
  state: CardState;
  onChange: (updates: Partial<CardState>) => void;
  onDownload: () => void;
}

const THEMES = [
  { id: 'sunset', name: 'Sunset', bg: '#ff4d4d', text: '#ffffff', type: 'gradient', pattern: 'none' },
  { id: 'cyberpunk', name: 'Cyberpunk', bg: '#000000', text: '#00ffcc', type: 'solid', pattern: 'grid' },
  { id: 'minimalist', name: 'White', bg: '#ffffff', text: '#171717', type: 'solid', pattern: 'dots' },
  { id: 'klein', name: 'Klein Blue', bg: '#002fa7', text: '#ffffff', type: 'solid', pattern: 'none' },
  { id: 'vintage', name: 'Vintage', bg: '#f4ebd8', text: '#3e3a35', type: 'solid', pattern: 'lines' },
];

export const Controls: React.FC<ControlsProps> = ({ state, onChange, onDownload }) => {
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        onChange({ backgroundImage: reader.result as string });
      };
      reader.readAsDataURL(file);
    }
  };

  return (
    <div className="w-full lg:w-[400px] bg-white dark:bg-zinc-900 border-t lg:border-t-0 lg:border-l border-zinc-200 dark:border-zinc-800 p-6 lg:p-8 space-y-8 lg:overflow-y-auto lg:h-screen z-20 relative shadow-2xl lg:shadow-none">
      <div className="space-y-8">
        <h2 className="text-xl font-bold flex items-center gap-2">
          <LayoutIcon className="w-5 h-5 text-brand-start" />
          Card Controls
        </h2>

        {/* Theme Presets */}
        <section className="space-y-4">
          <label className="block text-sm font-bold text-zinc-400 uppercase tracking-widest flex items-center gap-2">
            <Wand2 className="w-4 h-4" /> Magic Themes
          </label>
          <div className="flex gap-4 overflow-x-auto pb-4 scrollbar-hide">
            {THEMES.map(t => (
               <button 
                 key={t.id} 
                 onClick={() => onChange({ backgroundColor: t.bg, textColor: t.text, backgroundType: t.type as any, patternType: t.pattern as any })}
                 className="flex flex-col items-center gap-2 shrink-0 group transition-all"
               >
                 <div className="w-12 h-12 rounded-full shadow-md border-2 border-zinc-200 dark:border-zinc-700 transition-transform group-hover:scale-110 flex items-center justify-center overflow-hidden relative" style={{ background: t.type === 'gradient' ? `linear-gradient(135deg, ${t.bg}, #f9cb28)` : t.bg }}>
                   {t.pattern !== 'none' && <Grid className="w-4 h-4 opacity-50 mix-blend-difference text-white" />}
                 </div>
                 <span className="text-[10px] font-bold text-zinc-500 uppercase tracking-wider">{t.name}</span>
               </button>
            ))}
          </div>
        </section>

        {/* Content Section */}
        <section className="space-y-4">
          <label className="block text-sm font-bold text-zinc-400 uppercase tracking-widest">Content</label>
          <input
            type="text"
            placeholder="Title"
            className="w-full p-3 bg-zinc-100 dark:bg-zinc-800 border-0 rounded-xl focus:ring-2 ring-brand-start transition-all outline-none font-medium"
            value={state.title}
            onChange={(e) => onChange({ title: e.target.value })}
          />
          <input
            type="text"
            placeholder="Subtitle"
            className="w-full p-3 bg-zinc-100 dark:bg-zinc-800 border-0 rounded-xl focus:ring-2 ring-brand-start transition-all outline-none text-sm"
            value={state.subtitle}
            onChange={(e) => onChange({ subtitle: e.target.value })}
          />
          <textarea
            placeholder="Content text..."
            className="w-full p-3 bg-zinc-100 dark:bg-zinc-800 border-0 rounded-xl focus:ring-2 ring-brand-start transition-all outline-none min-h-[100px] text-sm leading-relaxed"
            value={state.content}
            onChange={(e) => onChange({ content: e.target.value })}
          />
          <input
            type="text"
            placeholder="Author"
            className="w-full p-3 bg-zinc-100 dark:bg-zinc-800 border-0 rounded-xl focus:ring-2 ring-brand-start transition-all outline-none text-sm"
            value={state.author}
            onChange={(e) => onChange({ author: e.target.value })}
          />
          <input
            type="text"
            placeholder="Watermark (e.g. © 2026 @knowledge)"
            className="w-full p-3 bg-zinc-100 dark:bg-zinc-800 border-0 rounded-xl focus:ring-2 ring-brand-start transition-all outline-none text-sm text-zinc-500 font-mono"
            value={state.watermark}
            onChange={(e) => onChange({ watermark: e.target.value })}
          />
        </section>

        {/* Layout & Ratio Section */}
        <section className="space-y-4">
          <label className="block text-sm font-bold text-zinc-400 uppercase tracking-widest">Layout & Ratio</label>
          
          <div className="space-y-4">
            <div className="space-y-2">
              <span className="text-[10px] font-bold text-zinc-400 uppercase tracking-widest pl-1">Classic & Social</span>
              <div className="grid grid-cols-3 gap-2">
                {[
                  { id: "left", label: "Left", icon: <AlignLeft className="w-4 h-4" /> },
                  { id: "center", label: "Center", icon: <AlignCenter className="w-4 h-4" /> },
                  { id: "quote", label: "Quote", icon: <Quote className="w-4 h-4" /> },
                  { id: "tweet", label: "Tweet", icon: <MessageSquare className="w-4 h-4" /> },
                  { id: "list", label: "List", icon: <ListIcon className="w-4 h-4" /> },
                  { id: "magazine", label: "Magazine", icon: <BookOpen className="w-4 h-4" /> },
                ].map((l) => (
                  <button
                    key={l.id}
                    onClick={() => onChange({ layout: l.id as LayoutType })}
                    className={cn(
                      "p-3 rounded-xl border transition-all flex flex-col items-center justify-center gap-1",
                      state.layout === l.id 
                        ? "bg-zinc-900 text-white dark:bg-white dark:text-zinc-900 border-zinc-900 dark:border-white shadow-lg" 
                        : "bg-white dark:bg-zinc-900 border-zinc-200 dark:border-zinc-800 hover:border-zinc-400 text-zinc-500 dark:text-zinc-400"
                    )}
                  >
                    {l.icon}
                    <span className="text-[10px] font-bold capitalize">{l.label}</span>
                  </button>
                ))}
              </div>
            </div>

            <div className="space-y-2">
              <span className="text-[10px] font-bold text-zinc-400 uppercase tracking-widest pl-1">Knowledge Cards</span>
              <div className="grid grid-cols-4 gap-2">
                {[
                  { id: "dictionary", label: "Dictionary", icon: <BookType className="w-4 h-4" /> },
                  { id: "qa", label: "Q&A", icon: <HelpCircle className="w-4 h-4" /> },
                  { id: "steps", label: "Steps", icon: <ListOrdered className="w-4 h-4" /> },
                  { id: "code", label: "Terminal", icon: <Terminal className="w-4 h-4" /> },
                ].map((l) => (
                  <button
                    key={l.id}
                    onClick={() => onChange({ layout: l.id as LayoutType })}
                    className={cn(
                      "p-3 rounded-xl border transition-all flex flex-col items-center justify-center gap-1",
                      state.layout === l.id 
                        ? "bg-zinc-900 text-white dark:bg-white dark:text-zinc-900 border-zinc-900 dark:border-white shadow-lg" 
                        : "bg-white dark:bg-zinc-900 border-zinc-200 dark:border-zinc-800 hover:border-zinc-400 text-zinc-500 dark:text-zinc-400"
                    )}
                  >
                    {l.icon}
                    <span className="text-[10px] font-bold capitalize">{l.label.replace(' ', '\n')}</span>
                  </button>
                ))}
              </div>
            </div>
          </div>

          <div className="grid grid-cols-4 gap-2">
            {(["3:4", "4:3", "1:1", "9:16"] as AspectRatio[]).map((ratio) => (
              <button
                key={ratio}
                onClick={() => onChange({ aspectRatio: ratio })}
                className={cn(
                  "p-2 text-[10px] font-black rounded-lg border transition-all",
                  state.aspectRatio === ratio 
                    ? "bg-brand-start text-white border-brand-start shadow-md" 
                    : "bg-white dark:bg-zinc-900 border-zinc-200 dark:border-zinc-800 hover:border-brand-start"
                )}
              >
                {ratio}
              </button>
            ))}
          </div>
        </section>

        {/* Background Section */}
        <section className="space-y-4">
          <label className="block text-sm font-bold text-zinc-400 uppercase tracking-widest">Background</label>
          
          <div className="grid grid-cols-4 gap-2">
            {([
              { id: "solid", label: "Solid" },
              { id: "gradient", label: "Gradi." },
              { id: "pattern", label: "Pattern" },
              { id: "image", label: "Image" }
            ] as const).map((b) => (
              <button
                key={b.id}
                onClick={() => onChange({ backgroundType: b.id })}
                className={cn(
                  "p-2 text-[10px] font-black rounded-lg border transition-all",
                  state.backgroundType === b.id 
                    ? "bg-zinc-900 text-white dark:bg-white dark:text-zinc-900 border-zinc-900 dark:border-white" 
                    : "bg-white dark:bg-zinc-900 border-zinc-200 dark:border-zinc-800"
                )}
              >
                {b.label}
              </button>
            ))}
          </div>

          {state.backgroundType === "pattern" && (
            <div className="grid grid-cols-4 gap-2 animate-in fade-in slide-in-from-top-2">
               {(["dots", "grid", "lines", "blobs"] as const).map(p => (
                 <button
                    key={p}
                    onClick={() => onChange({ patternType: p })}
                    className={cn(
                      "p-2 text-[10px] font-black rounded-lg border transition-all uppercase",
                      state.patternType === p
                        ? "bg-brand-start text-white border-brand-start shadow-md" 
                        : "bg-white dark:bg-zinc-900 border-zinc-200 dark:border-zinc-800 hover:border-brand-start text-zinc-500"
                    )}
                 >
                   {p}
                 </button>
               ))}
            </div>
          )}

          {state.backgroundType === "image" && (
            <div className="space-y-3 animate-in fade-in slide-in-from-top-2">
              <input 
                type="file" 
                ref={fileInputRef} 
                className="hidden" 
                accept="image/*" 
                onChange={handleImageUpload} 
              />
              <button
                onClick={() => fileInputRef.current?.click()}
                className="w-full p-3 bg-zinc-100 dark:bg-zinc-800 rounded-xl border-2 border-dashed border-zinc-300 dark:border-zinc-700 flex items-center justify-center gap-2 text-xs font-bold hover:bg-zinc-200 dark:hover:bg-zinc-700 transition-all"
              >
                <ImageIcon className="w-4 h-4" />
                {state.backgroundImage ? "Change Background" : "Upload Background"}
              </button>
              
              <div className="flex items-center justify-between p-3 bg-zinc-50 dark:bg-zinc-800/50 rounded-xl border border-zinc-100 dark:border-zinc-800">
                <div className="flex flex-col">
                  <span className="text-xs font-bold text-zinc-900 dark:text-zinc-100">Glass Effect</span>
                  <span className="text-[10px] text-zinc-400 font-medium italic">Requires an image</span>
                </div>
                <button
                  onClick={() => onChange({ useGlass: !state.useGlass })}
                  disabled={!state.backgroundImage}
                  className={cn(
                    "w-10 h-6 rounded-full transition-all relative",
                    state.useGlass ? "bg-brand-start" : "bg-zinc-300 dark:bg-zinc-600",
                    !state.backgroundImage && "opacity-50 cursor-not-allowed"
                  )}
                >
                  <div className={cn(
                    "absolute top-1 w-4 h-4 bg-white rounded-full transition-all",
                    state.useGlass ? "left-5" : "left-1"
                  )} />
                </button>
              </div>
            </div>
          )}
        </section>

        {/* Colors & Fonts Section */}
        <section className="space-y-4">
          <label className="block text-sm font-bold text-zinc-400 uppercase tracking-widest">Appearance</label>
          
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <span className="text-[10px] uppercase font-black text-zinc-400 tracking-widest">Bg Color</span>
              <div className="flex items-center gap-2">
                <input
                  type="color"
                  className="w-full h-10 cursor-pointer rounded-xl overflow-hidden border-0 bg-transparent"
                  value={state.backgroundColor}
                  onChange={(e) => onChange({ backgroundColor: e.target.value })}
                />
              </div>
            </div>
            <div className="space-y-2">
              <span className="text-[10px] uppercase font-black text-zinc-400 tracking-widest">Text Color</span>
              <input
                type="color"
                className="w-full h-10 cursor-pointer rounded-xl overflow-hidden border-0 bg-transparent"
                value={state.textColor}
                onChange={(e) => onChange({ textColor: e.target.value })}
              />
            </div>
          </div>

          <div className="space-y-2">
            <div className="flex justify-between items-center">
              <span className="text-[10px] uppercase font-black text-zinc-400 tracking-widest">Text Size</span>
              <span className="text-[10px] font-bold text-brand-start">{state.fontSize}px</span>
            </div>
            <input
              type="range"
              min="14"
              max="60"
              className="w-full h-2 bg-zinc-200 rounded-lg appearance-none cursor-pointer accent-brand-start"
              value={state.fontSize}
              onChange={(e) => onChange({ fontSize: parseInt(e.target.value) })}
            />
          </div>
        </section>
      </div>

      <div className="space-y-3 pt-6 border-t border-zinc-100 dark:border-zinc-800">
        <button
          onClick={onDownload}
          className="w-full py-4 bg-gradient-to-r from-brand-start to-brand-end text-white font-black rounded-2xl shadow-xl hover:shadow-2xl hover:scale-[1.02] active:scale-[0.98] transition-all flex items-center justify-center gap-3 group text-sm uppercase tracking-widest"
        >
          <Download className="w-5 h-5 group-hover:bounce" />
          Download Image
        </button>
        
      </div>
    </div>
  );
};
