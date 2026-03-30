import React, { forwardRef } from "react";
import { cn } from "@/lib/utils";
import { type CardState } from "@/types/card";
import { Quote, CheckCircle2, MessageCircle, Heart, Bookmark, BookType, Sparkles } from "lucide-react";

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
            ? backgroundColor // Provide fallback
            : backgroundColor,
        color: textColor,
      }}
    >
      {/* True Gaussian Blur Background Image Layer */}
      {backgroundType === "image" && backgroundImage && (
        <div
          className="absolute inset-0 z-0 bg-center bg-cover bg-no-repeat"
          style={{
            backgroundImage: `url(${backgroundImage})`,
            ...(useGlass ? { filter: 'blur(12px)', transform: 'scale(1.15)' } : {})
          }}
        />
      )}

      {/* Dim overlay for text readability */}
      {backgroundType === "image" && backgroundImage && (
        <div className={cn("absolute inset-0 z-0", useGlass ? "bg-black/10" : "bg-black/20")} />
      )}

      {/* Decorative Background Elements */}
      {backgroundType === "gradient" && (
        <div className="absolute top-0 right-0 w-48 h-48 bg-white opacity-10 rounded-full -mr-24 -mt-24 blur-3xl" />
      )}

      {/* LAYOT TEMPLATES */}

      {/* 1. STANDARD (Left / Center) */}
      {(layout === "left" || layout === "center") && (
        <>
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

            <p className="leading-relaxed font-normal opacity-90 max-w-[90%] whitespace-pre-wrap" style={{ fontSize: `${fontSize}px`, marginLeft: isCentered ? "auto" : "0", marginRight: isCentered ? "auto" : "0" }}>
              {content}
            </p>
          </div>

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
        </>
      )}

      {/* 2. QUOTE */}
      {layout === "quote" && (
        <div className="flex-1 flex flex-col items-center justify-center relative z-10 text-center px-4 w-full">
          <div className="relative w-full max-w-[85%] mx-auto py-12">
            <Quote className="w-20 h-20 opacity-20 absolute top-0 -left-6 z-0" />
            <p className="font-bold leading-relaxed tracking-wide opacity-95 z-10 relative whitespace-pre-wrap" style={{ fontSize: `${fontSize * 1.2}px` }}>
              {content}
            </p>
            <Quote className="w-20 h-20 opacity-20 absolute bottom-0 -right-4 rotate-180 z-0" />
          </div>
          <div className="mt-8 opacity-80 font-black tracking-[0.2em] uppercase text-sm z-10">
            — {author}
          </div>
        </div>
      )}

      {/* 3. LIST (干货清单风) */}
      {layout === "list" && (
        <div className="flex-1 flex flex-col z-10 w-full pt-4">
          <div className="space-y-3 mb-10 text-center">
            <h1 className="font-black text-4xl leading-[1.2] tracking-tight relative inline-block mx-auto">
              <span className="relative z-10">{title}</span>
              <div className="absolute bottom-1 left-0 w-full h-4 bg-white/30 dark:bg-black/30 -z-0 rounded" />
            </h1>
            <p className="text-xs font-bold tracking-[0.2em] uppercase opacity-80">
              {subtitle}
            </p>
          </div>
          <div className="space-y-4 flex-1">
            {content.split('\n').filter(Boolean).map((line, i) => (
              <div key={i} className="flex items-start gap-4 p-4 rounded-2xl bg-white/15 dark:bg-black/15 backdrop-blur-md border border-white/20 shadow-sm">
                <CheckCircle2 className="w-6 h-6 shrink-0 opacity-80 mt-1" />
                <p className="leading-relaxed font-bold opacity-95 flex-1" style={{ fontSize: `${fontSize * 0.9}px` }}>
                  {line}
                </p>
              </div>
            ))}
          </div>
          <div className="mt-auto pt-6 w-full text-center">
            <span className="px-6 py-2 bg-white/20 backdrop-blur-md rounded-full text-xs font-black tracking-widest uppercase shadow-sm">
              {author}
            </span>
          </div>
        </div>
      )}

      {/* 4. TWEET (类似社交推文) */}
      {layout === "tweet" && (
        <div className="flex-1 flex items-center justify-center z-10 w-full relative">
          <div className="w-full bg-white/95 dark:bg-black/80 backdrop-blur-3xl rounded-3xl p-8 shadow-2xl border border-white/40 text-zinc-900 dark:text-zinc-100">
            <div className="flex items-center gap-4 mb-6">
              <div className="w-12 h-12 rounded-full bg-brand-start flex items-center justify-center font-bold text-white text-lg shadow-inner uppercase">
                {author?.[1] || "T"}
              </div>
              <div className="flex-1 text-left">
                <div className="font-bold text-lg">{author}</div>
                <div className="text-xs opacity-50 font-medium">@knowledge_share • Just now</div>
              </div>
            </div>
            {title && <h2 className="font-black text-2xl mb-4 tracking-tight text-left">{title}</h2>}
            <p className="leading-relaxed opacity-90 whitespace-pre-wrap text-left font-medium" style={{ fontSize: `${fontSize}px` }}>
              {content}
            </p>
            <div className="mt-8 pt-6 border-t border-zinc-200 dark:border-zinc-800 flex justify-between items-center opacity-60">
              <div className="flex items-center gap-6 text-sm font-bold">
                <span className="flex items-center gap-1.5"><Heart className="w-5 h-5" /> 12.4k</span>
                <span className="flex items-center gap-1.5"><MessageCircle className="w-5 h-5" /> 842</span>
              </div>
              <Bookmark className="w-5 h-5" />
            </div>
          </div>
        </div>
      )}

      {/* 5. MAGAZINE (杂志封面风) */}
      {layout === "magazine" && (
        <div className="flex-1 flex flex-col justify-between z-10 w-full h-full text-left relative">
          <div className="mt-4 relative z-10">
            <h1 className="font-black text-7xl leading-[0.85] tracking-tighter mix-blend-overlay opacity-90 drop-shadow-sm uppercase break-words w-[80%]">
              {title}
            </h1>
            <div className="absolute top-2 right-0 max-w-[120px] text-right">
              <p className="text-[10px] font-black tracking-[0.2em] uppercase opacity-90 border-b-2 border-current pb-2 mb-2">
                {subtitle}
              </p>
              <p className="text-[8px] font-bold tracking-widest opacity-70">VOL. {new Date().getMonth() + 1}</p>
            </div>
          </div>

          <div className="mb-4 max-w-[85%] bg-black/50 backdrop-blur-xl p-8 rounded-[2rem] border-t border-r border-white/20 text-white shadow-2xl relative overflow-hidden">
            <div className="absolute top-0 right-0 w-32 h-32 bg-brand-start/20 rounded-full blur-3xl" />
            <Quote className="w-8 h-8 mb-4 opacity-70 text-brand-end" />
            <p className="leading-relaxed font-semibold opacity-95 relative z-10 whitespace-pre-wrap" style={{ fontSize: `${fontSize}px` }}>
              {content}
            </p>
            <div className="mt-6 font-black text-sm tracking-[0.2em] uppercase text-brand-start relative z-10">
              — {author}
            </div>
          </div>
        </div>
      )}

      {/* 6. DICTIONARY (百科词典风) */}
      {layout === "dictionary" && (
        <div className="flex-1 flex flex-col justify-center z-10 w-full bg-white/95 dark:bg-black/95 p-10 rounded-3xl border border-zinc-200 dark:border-zinc-800 shadow-xl backdrop-blur-xl h-full mt-4 mb-2 text-left">
          <div className="flex justify-between items-start mb-6">
            <div className="max-w-[80%]">
              <h1 className="font-serif font-black text-5xl tracking-tight text-zinc-900 dark:text-zinc-100 mb-3 break-words leading-none">
                {title}
              </h1>
              {subtitle && (
                <div className="flex items-center gap-2">
                  <span className="px-2 py-0.5 bg-zinc-100 dark:bg-zinc-800 rounded text-xs font-mono text-zinc-500 dark:text-zinc-400 font-bold tracking-widest uppercase">
                    [{subtitle}]
                  </span>
                  <span className="text-zinc-400 dark:text-zinc-500 text-xs italic font-serif">n.</span>
                </div>
              )}
            </div>
            {author && (
              <div className="w-10 h-10 rounded-full bg-zinc-100 dark:bg-zinc-800 flex items-center justify-center font-bold text-sm text-zinc-500 border border-zinc-200 dark:border-zinc-700 uppercase shrink-0">
                {author[1] || "T"}
              </div>
            )}
          </div>

          <div className="w-full h-px bg-zinc-200 dark:bg-zinc-800 mb-6" />

          <div className="relative pl-6">
            <div className="absolute left-0 top-0 bottom-0 w-1 bg-brand-start rounded-full opacity-60" />
            <div className="flex items-center gap-2 mb-3 text-brand-start font-black text-xs uppercase tracking-widest">
              <BookType className="w-4 h-4" />
              <span>Definition</span>
            </div>
            <p className="leading-relaxed font-semibold text-zinc-700 dark:text-zinc-300 whitespace-pre-wrap" style={{ fontSize: `${fontSize}px` }}>
              {content}
            </p>
          </div>
        </div>
      )}

      {/* 7. Q&A (问答风) */}
      {layout === "qa" && (
        <div className="flex-1 flex flex-col z-10 w-full justify-center space-y-6 pt-4 text-left">
          {/* Question Box */}
          <div className="bg-white/95 dark:bg-zinc-900/95 rounded-3xl p-8 shadow-xl border border-zinc-100 dark:border-zinc-800 relative mt-4">
            <div className="absolute -top-5 -left-3 w-12 h-12 bg-zinc-900 dark:bg-white rounded-2xl rotate-12 flex items-center justify-center shadow-xl text-white dark:text-zinc-900 font-black text-2xl">
              Q
            </div>
            <h2 className="font-black text-3xl tracking-tight text-zinc-900 dark:text-zinc-100 pl-4 leading-tight">
              {title}
            </h2>
            {subtitle && <p className="text-sm font-bold tracking-widest uppercase text-zinc-400 mt-4 pl-4">{subtitle}</p>}
          </div>

          {/* Answer Box */}
          <div className="bg-brand-start/15 dark:bg-brand-start/20 rounded-3xl p-8 border border-brand-start/30 relative">
            <div className="absolute -top-5 -right-3 w-12 h-12 bg-brand-end rounded-2xl -rotate-12 flex items-center justify-center shadow-xl text-white font-black text-2xl">
              A
            </div>
            <div className="flex items-center gap-3 mb-6">
              {author && (
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-full bg-white flex items-center justify-center font-bold text-xs text-zinc-900 shadow uppercase">
                    {author[1] || "T"}
                  </div>
                  <span className="text-sm font-black tracking-widest uppercase opacity-80">{author}</span>
                </div>
              )}
            </div>
            <p className="leading-relaxed font-semibold opacity-95 whitespace-pre-wrap" style={{ fontSize: `${fontSize}px` }}>
              {content}
            </p>
          </div>
        </div>
      )}

      {/* 8. STEPS (大字步骤流) */}
      {layout === "steps" && (
        <div className="flex-1 flex flex-col z-10 w-full pt-4 h-full text-left">
          <div className="mb-10 text-center">
            <h1 className="font-black text-5xl tracking-tight bg-clip-text text-transparent bg-gradient-to-br from-white to-white/60 drop-shadow-sm mb-3">
              {title}
            </h1>
            <p className="text-xs font-black tracking-[0.3em] uppercase opacity-80">
              {subtitle}
            </p>
          </div>
          <div className="flex-1 flex flex-col gap-5">
            {content.split('\n').filter(Boolean).map((line, i) => (
              <div key={i} className="relative flex items-center p-6 rounded-[2rem] bg-white/10 dark:bg-black/20 backdrop-blur-xl border border-white/20 shadow-lg overflow-hidden group">
                {/* Large watermark number */}
                <div className="absolute -left-4 -top-8 text-[100px] font-black opacity-[0.07] italic pointer-events-none drop-shadow-md">
                  {(i + 1).toString().padStart(2, '0')}
                </div>
                {/* Actual content */}
                <div className="relative z-10 flex gap-5 items-center w-full">
                  <div className="w-10 h-10 rounded-2xl bg-gradient-to-br from-brand-start to-brand-end flex items-center justify-center text-white font-black text-lg shadow-inner shrink-0 rotate-3">
                    {i + 1}
                  </div>
                  <p className="leading-relaxed font-bold opacity-95 flex-1" style={{ fontSize: `${fontSize * 0.9}px` }}>
                    {line}
                  </p>
                </div>
              </div>
            ))}
          </div>
          <div className="mt-8 flex justify-center w-full opacity-70 text-xs font-black uppercase tracking-[0.2em] gap-2 items-center">
            <Sparkles className="w-4 h-4" />
            {author && <span>{author}</span>}
          </div>
        </div>
      )}

      {/* 9. CODE TERMINAL (极客代码终端风) */}
      {layout === "code" && (
        <div className="flex-1 flex flex-col items-center justify-center z-10 w-full h-full pb-4 text-left">
          <div className="w-full bg-[#1e1e1e]/95 backdrop-blur-2xl rounded-2xl shadow-2xl border border-white/20 overflow-hidden flex flex-col h-[95%]">
            {/* Window Header */}
            <div className="h-12 bg-[#2d2d2d] flex items-center px-4 relative border-b border-black/50 shrink-0">
              <div className="flex gap-2.5 absolute left-4">
                <div className="w-3.5 h-3.5 rounded-full bg-[#ff5f56] shadow-inner" />
                <div className="w-3.5 h-3.5 rounded-full bg-[#ffbd2e] shadow-inner" />
                <div className="w-3.5 h-3.5 rounded-full bg-[#27c93f] shadow-inner" />
              </div>
              <div className="w-full text-center text-[#999999] text-xs font-mono font-bold tracking-widest truncate px-20">
                {author ? `~/${author.replace('@', '')}` : '~/terminal'} — bash
              </div>
            </div>

            {/* Terminal Body */}
            <div className="p-8 font-mono space-y-5 flex-1 overflow-hidden flex flex-col justify-start">
              <div>
                <span className="text-[#27c93f] font-black text-lg">➜</span>{" "}
                <span className="text-[#3fc9ff] font-bold text-lg">~</span>{" "}
                <span className="text-white font-bold text-lg ml-2">./run_insight.sh</span>
              </div>
              <div>
                <span className="text-[#ffbd2e] font-bold text-xl"># {title}</span>
              </div>
              {subtitle && (
                <div>
                  <span className="text-[#858585] italic font-medium text-sm">// {subtitle}</span>
                </div>
              )}
              <div className="text-[#e6e6e6] whitespace-pre-wrap leading-relaxed pb-4 pt-2 font-medium" style={{ fontSize: `${fontSize * 0.85}px` }}>
                {content}
              </div>
              <div className="mt-auto pt-4 flex items-center gap-2 text-[#27c93f] text-2xl">
                <span className="animate-pulse font-black">_</span>
              </div>
            </div>
          </div>
        </div>
      )}

    </div>
  );
});

Card.displayName = "Card";
