import React, { forwardRef } from "react";
import { cn } from "@/lib/utils";
import { type CardState } from "@/types/card";

interface CardProps {
  state: CardState;
}

export const Card = forwardRef<HTMLDivElement, CardProps>(({ state }, ref) => {
  const { 
    title, 
    subtitle, 
    content, 
    author, 
    backgroundType, 
    useGlass,
    aspectRatio, 
    layout,
    fontSize, 
    textColor, 
    backgroundColor,
    backgroundImage
  } = state;

  const aspectClass = {
    "3:4": "aspect-[3/4]",
    "4:3": "aspect-[4/3]",
    "1:1": "aspect-square",
    "9:16": "aspect-[9/16]",
  }[aspectRatio];

  const ratioValue = {
    "3:4": 3 / 4,
    "4:3": 4 / 3,
    "1:1": 1,
    "9:16": 9 / 16,
  }[aspectRatio];

  const isCentered = layout === "center";
  const showGlass = backgroundType === "image" && useGlass;

  return (
    <div
      ref={ref}
      id="card-to-export"
      className={cn(
        "relative flex flex-col justify-between p-10 overflow-hidden shadow-2xl transition-all duration-500",
        aspectClass,
        isCentered ? "text-center items-center" : "text-left items-start",
        "w-[500px] shrink-0 mx-auto"
      )}
      style={{
        background: backgroundType === "gradient" 
          ? `linear-gradient(135deg, ${backgroundColor}, #f9cb28)` 
          : backgroundType === "image" && backgroundImage
          ? `url(${backgroundImage}) center/cover no-repeat`
          : backgroundColor,
        color: textColor,
      }}
    >
      {/* Glass Effect Overlay */}
      {showGlass && (
        <div className="absolute inset-0 glass z-0" />
      )}

      {/* Basic Overlay for background images */}
      {backgroundType === "image" && backgroundImage && !useGlass && (
        <div className="absolute inset-0 bg-black/20 z-0" />
      )}

      {/* Decorative Background Elements */}
      {backgroundType === "gradient" && (
        <div className="absolute top-0 right-0 w-48 h-48 bg-white opacity-10 rounded-full -mr-24 -mt-24 blur-3xl" />
      )}

      {/* Content */}
      <div className={cn("space-y-6 z-10 w-full", isCentered ? "my-auto" : "")}>
        <div className="space-y-2">
          <p className="text-xs font-bold tracking-[0.2em] uppercase opacity-70">
            {subtitle}
          </p>
          <h1 className={cn(
            "font-black leading-[1.1] tracking-tight",
            aspectRatio === "4:3" ? "text-5xl" : "text-4xl"
          )}>
            {title}
          </h1>
        </div>
        
        <div className={cn(
          "w-16 h-1.5 bg-current opacity-20 rounded-full",
          isCentered ? "mx-auto" : ""
        )} />
        
        <p className="leading-relaxed font-normal opacity-90 max-w-[90%]" style={{ fontSize: `${fontSize}px`, marginLeft: isCentered ? "auto" : "0", marginRight: isCentered ? "auto" : "0" }}>
          {content}
        </p>
      </div>

      {/* Footer */}
      <div className={cn(
        "flex items-center w-full z-10 pt-8 mt-auto border-t border-white/10",
        isCentered ? "justify-center gap-4" : "justify-between"
      )}>
        {author && (
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 rounded-full bg-white/20 backdrop-blur-md flex items-center justify-center font-bold text-sm ring-1 ring-white/30 overflow-hidden shadow-inner uppercase">
              {author[1] || "T"}
            </div>
            <span className="text-sm font-semibold tracking-wide opacity-80">{author}</span>
          </div>
        )}
        {!isCentered && (
          <div className="px-4 py-1.5 bg-white/10 backdrop-blur-sm rounded-full text-[10px] font-black tracking-[0.15em] uppercase border border-white/10">
            Premium Card
          </div>
        )}
      </div>
    </div>
  );
});

Card.displayName = "Card";
