"use client";

import React, { useState, useRef, useCallback } from "react";
import { Card } from "@/components/Card";
import { Controls } from "@/components/Controls";
import { INITIAL_STATE, type CardState } from "@/types/card";
import { toPng } from "html-to-image";
import { Sparkles, Image as ImageIcon } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

export default function Home() {
  const [state, setState] = useState<CardState>(INITIAL_STATE);
  const cardRef = useRef<HTMLDivElement>(null);

  const handleUpdate = (updates: Partial<CardState>) => {
    setState((prev) => ({ ...prev, ...updates }));
  };

  const handleDownload = useCallback(() => {
    if (cardRef.current === null) return;

    toPng(cardRef.current, { cacheBust: true, pixelRatio: 2 })
      .then((dataUrl) => {
        const link = document.createElement("a");
        link.download = `knowledge-card-${Date.now()}.png`;
        link.href = dataUrl;
        link.click();
      })
      .catch((err) => {
        console.error("Oops, something went wrong!", err);
      });
  }, [cardRef]);



  return (
    <main className="flex flex-col lg:flex-row h-screen bg-zinc-50 dark:bg-black overflow-hidden font-sans">
      {/* Visual Area */}
      <div className="flex-1 relative flex flex-col items-center justify-center p-8 lg:p-20 overflow-y-auto">
        {/* Header decoration */}
        <div className="absolute top-8 left-8 flex items-center gap-3">
          <div className="w-10 h-10 bg-brand-start rounded-xl rotate-12 flex items-center justify-center shadow-lg">
            <Sparkles className="w-6 h-6 text-white" />
          </div>
          <div>
            <h1 className="font-bold text-xl tracking-tight text-zinc-900 dark:text-white">ImageGen</h1>
            <p className="text-[10px] uppercase tracking-widest text-zinc-400 font-bold">Premium Card Maker</p>
          </div>
        </div>

        <AnimatePresence mode="wait">
          <motion.div
            key={state.aspectRatio + state.backgroundType}
            initial={{ opacity: 0, y: 20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, scale: 1.05 }}
            transition={{ duration: 0.5, ease: "easeOut" }}
            className="w-full max-w-4xl flex items-center justify-center"
          >
            <Card ref={cardRef} state={state} />
          </motion.div>
        </AnimatePresence>

        {/* Floating background blobs */}
        <div className="absolute top-1/4 -left-20 w-64 h-64 bg-brand-start/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-1/4 -right-20 w-80 h-80 bg-brand-end/10 rounded-full blur-3xl pointer-events-none" />
      </div>

      {/* Editor Controls */}
      <Controls 
        state={state} 
        onChange={handleUpdate} 
        onDownload={handleDownload} 
      />
    </main>
  );
}
