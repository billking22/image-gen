import React, { forwardRef, useRef, useState, useEffect } from "react";
import { cn } from "@/lib/utils";
import { type CardState } from "@/types/card";
import { Quote, CheckCircle2, MessageCircle, Heart, Bookmark, BookType, Sparkles } from "lucide-react";
import ReactMarkdown from "react-markdown";
import type { Components } from "react-markdown";

interface CardProps {
  state: CardState;
}

const MarkdownComponents: Components = {
  p: ({node, ...props}) => <p className="mb-2 last:mb-0 break-words whitespace-pre-wrap" {...props} />,
  strong: ({node, ...props}) => <strong className="font-black" {...props} />,
  em: ({node, ...props}) => <em className="italic" {...props} />,
  ul: ({node, ...props}) => <ul className="list-disc pl-5 mb-2 space-y-1" {...props} />,
  ol: ({node, ...props}) => <ol className="list-decimal pl-5 mb-2 space-y-1" {...props} />,
  li: ({node, ...props}) => <li className="" {...props} />,
  a: ({node, ...props}) => <a className="underline decoration-2 underline-offset-4 opacity-90" {...props} />,
  h1: ({node, ...props}) => <h1 className="text-2xl font-black mb-2" {...props} />,
  h2: ({node, ...props}) => <h2 className="text-xl font-bold mb-2" {...props} />,
  h3: ({node, ...props}) => <h3 className="text-lg font-bold mb-2" {...props} />,
  blockquote: ({node, ...props}) => <blockquote className="border-l-4 border-current pl-4 mb-2 opacity-80 italic" {...props} />,
  code: ({node, className, children, ...props}) => {
    return <code className="bg-black/10 dark:bg-white/10 rounded px-1.5 py-0.5 font-mono text-[0.9em]" {...props}>{children}</code>;
  }
};

export const Card = forwardRef<HTMLDivElement, CardProps>(({ state }, ref) => {
  const {
    title,
    subtitle,
    content,
    author,
    watermark,
    backgroundType,
    patternType,
    useGlass,
    aspectRatio,
    layout,
    fontSize,
    textColor,
    backgroundColor,
    backgroundImage,
    autoScaleText,
    coverImage
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

  const localCardRef = useRef<HTMLDivElement>(null);
  
  // Combine refs
  const setRefs = (node: HTMLDivElement) => {
    localCardRef.current = node;
    if (typeof ref === 'function') ref(node);
    else if (ref && 'current' in ref) (ref as any).current = node;
  };

  const [actualFontSize, setActualFontSize] = useState(fontSize);

  // Reset actual font size whenever state overrides it
  useEffect(() => {
    setActualFontSize(fontSize);
  }, [fontSize, layout, aspectRatio, content, coverImage]);

  // Auto-scale loop
  useEffect(() => {
    if (!autoScaleText || !localCardRef.current) return;
    
    const card = localCardRef.current;
    if (card.scrollHeight > card.clientHeight && actualFontSize > 12) {
      setActualFontSize(prev => prev - 1);
    }
  }, [actualFontSize, content, autoScaleText, layout, aspectRatio, coverImage]);

  return (
    <div
      ref={setRefs}
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
      {/* SVG Patterns */}
      {backgroundType === "pattern" && patternType !== "none" && (
        <div className={cn(
          "absolute inset-0 z-0 pointer-events-none",
          patternType === "blobs" ? "opacity-40" : "opacity-20 mix-blend-overlay"
        )}>
          {patternType === "dots" && (
            <svg width="100%" height="100%" xmlns="http://www.w3.org/2000/svg">
              <defs>
                <pattern id="dots" x="0" y="0" width="24" height="24" patternUnits="userSpaceOnUse">
                  <circle fill="currentColor" cx="3" cy="3" r="3" />
                </pattern>
              </defs>
              <rect x="0" y="0" width="100%" height="100%" fill="url(#dots)" />
            </svg>
          )}
          {patternType === "grid" && (
            <svg width="100%" height="100%" xmlns="http://www.w3.org/2000/svg">
              <defs>
                <pattern id="grid" width="40" height="40" patternUnits="userSpaceOnUse">
                  <path d="M 40 0 L 0 0 0 40" fill="none" stroke="currentColor" strokeWidth="2"/>
                </pattern>
              </defs>
              <rect width="100%" height="100%" fill="url(#grid)" />
            </svg>
          )}
          {patternType === "lines" && (
            <svg width="100%" height="100%" xmlns="http://www.w3.org/2000/svg">
              <defs>
                <pattern id="lines" width="100" height="40" patternUnits="userSpaceOnUse">
                  <path d="M 0 40 L 100 40" fill="none" stroke="currentColor" strokeWidth="2"/>
                </pattern>
              </defs>
              <rect width="100%" height="100%" fill="url(#lines)" />
            </svg>
          )}
          {patternType === "blobs" && (
             <svg width="100%" height="100%" xmlns="http://www.w3.org/2000/svg" className="blur-3xl transform scale-110">
               <circle cx="10%" cy="10%" r="35%" fill="currentColor" opacity="0.5" />
               <circle cx="90%" cy="90%" r="40%" fill="currentColor" opacity="0.6" />
               <circle cx="80%" cy="20%" r="20%" fill="currentColor" opacity="0.4" />
               <circle cx="20%" cy="80%" r="25%" fill="currentColor" opacity="0.5" />
             </svg>
          )}
        </div>
      )}

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

            {coverImage && (
              <img src={coverImage} className="w-full max-h-56 object-cover rounded-xl shadow-md border border-white/10 my-4" alt="Cover" />
            )}

            <div className="leading-relaxed font-normal opacity-90 w-full" style={{ fontSize: `${actualFontSize}px`, marginLeft: isCentered ? "auto" : "0", marginRight: isCentered ? "auto" : "0" }}>
              <ReactMarkdown components={MarkdownComponents}>{content}</ReactMarkdown>
            </div>
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
          {coverImage && (
            <img src={coverImage} className="w-24 h-24 object-cover rounded-full shadow-lg border-2 border-white/20 mb-6" alt="Cover" />
          )}
          <div className="relative w-full max-w-[85%] mx-auto py-12">
            <Quote className="w-20 h-20 opacity-20 absolute top-0 -left-6 z-0" />
            <div className="font-bold leading-relaxed tracking-wide opacity-95 z-10 relative" style={{ fontSize: `${actualFontSize * 1.2}px` }}>
              <ReactMarkdown components={MarkdownComponents}>{content}</ReactMarkdown>
            </div>
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
          
          {coverImage && (
             <img src={coverImage} className="w-full max-h-40 object-cover rounded-xl shadow-md border border-white/10 mb-6" alt="Cover" />
          )}

          <div className="space-y-4 flex-1">
            {content.split('\n').filter(Boolean).map((line, i) => (
              <div key={i} className="flex items-start gap-4 p-4 rounded-2xl bg-white/15 dark:bg-black/15 backdrop-blur-md border border-white/20 shadow-sm">
                <CheckCircle2 className="w-6 h-6 shrink-0 opacity-80 mt-1" />
                <div className="leading-relaxed font-bold opacity-95 flex-1" style={{ fontSize: `${actualFontSize * 0.9}px` }}>
                  <ReactMarkdown components={MarkdownComponents}>{line}</ReactMarkdown>
                </div>
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
              <div className="w-12 h-12 rounded-full bg-brand-start flex items-center justify-center font-bold text-white text-lg shadow-inner uppercase overflow-hidden">
                {coverImage ? <img src={coverImage} className="w-full h-full object-cover" /> : author?.[1] || "T"}
              </div>
              <div className="flex-1 text-left">
                <div className="font-bold text-lg">{author}</div>
                <div className="text-xs opacity-50 font-medium">@knowledge_share • Just now</div>
              </div>
            </div>
            {title && <h2 className="font-black text-2xl mb-4 tracking-tight text-left">{title}</h2>}
            <div className="leading-relaxed opacity-90 text-left font-medium" style={{ fontSize: `${actualFontSize}px` }}>
              <ReactMarkdown components={MarkdownComponents}>{content}</ReactMarkdown>
            </div>
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

          {coverImage && (
             <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full px-8 z-0 opacity-80">
                <img src={coverImage} className="w-full h-64 object-cover rounded-xl mix-blend-overlay" />
             </div>
          )}

          <div className="mb-4 max-w-[85%] bg-black/50 backdrop-blur-xl p-8 rounded-[2rem] border-t border-r border-white/20 text-white shadow-2xl relative overflow-hidden">
            <div className="absolute top-0 right-0 w-32 h-32 bg-brand-start/20 rounded-full blur-3xl" />
            <Quote className="w-8 h-8 mb-4 opacity-70 text-brand-end" />
            <div className="leading-relaxed font-semibold opacity-95 relative z-10" style={{ fontSize: `${actualFontSize}px` }}>
              <ReactMarkdown components={MarkdownComponents}>{content}</ReactMarkdown>
            </div>
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
              <div className="w-10 h-10 rounded-full bg-zinc-100 dark:bg-zinc-800 flex items-center justify-center font-bold text-sm text-zinc-500 border border-zinc-200 dark:border-zinc-700 uppercase shrink-0 overflow-hidden">
                {coverImage ? <img src={coverImage} className="w-full h-full object-cover" /> : author[1] || "T"}
              </div>
            )}
          </div>

          <div className="w-full h-px bg-zinc-200 dark:bg-zinc-800 mb-6" />

          {coverImage && (
             <img src={coverImage} className="w-full max-h-32 object-cover rounded-xl shadow-sm border border-zinc-100 dark:border-zinc-800 mb-6" alt="Cover" />
          )}

          <div className="relative pl-6">
            <div className="absolute left-0 top-0 bottom-0 w-1 bg-brand-start rounded-full opacity-60" />
            <div className="flex items-center gap-2 mb-3 text-brand-start font-black text-xs uppercase tracking-widest">
              <BookType className="w-4 h-4" />
              <span>Definition</span>
            </div>
            <div className="leading-relaxed font-semibold text-zinc-700 dark:text-zinc-300" style={{ fontSize: `${actualFontSize}px` }}>
              <ReactMarkdown components={MarkdownComponents}>{content}</ReactMarkdown>
            </div>
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
                  <div className="w-8 h-8 rounded-full bg-white flex items-center justify-center font-bold text-xs text-zinc-900 shadow uppercase overflow-hidden">
                    {coverImage ? <img src={coverImage} className="w-full h-full object-cover" /> : author[1] || "T"}
                  </div>
                  <span className="text-sm font-black tracking-widest uppercase opacity-80">{author}</span>
                </div>
              )}
            </div>
            <div className="leading-relaxed font-semibold opacity-95" style={{ fontSize: `${actualFontSize}px` }}>
              <ReactMarkdown components={MarkdownComponents}>{content}</ReactMarkdown>
            </div>
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
          
          {coverImage && (
             <img src={coverImage} className="w-full max-h-32 object-cover rounded-[2rem] shadow-lg border border-white/20 mb-6" alt="Cover" />
          )}

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
                  <div className="leading-relaxed font-bold opacity-95 flex-1" style={{ fontSize: `${actualFontSize * 0.9}px` }}>
                    <ReactMarkdown components={MarkdownComponents}>{line}</ReactMarkdown>
                  </div>
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
              {coverImage && (
                 <img src={coverImage} className="w-full max-h-32 object-cover rounded-md border border-white/10 mt-2 mb-2" alt="Cover" />
              )}
              <div className="text-[#e6e6e6] leading-relaxed pb-4 pt-2 font-medium" style={{ fontSize: `${actualFontSize * 0.85}px` }}>
                <ReactMarkdown components={MarkdownComponents}>{content}</ReactMarkdown>
              </div>
              <div className="mt-auto pt-4 flex items-center gap-2 text-[#27c93f] text-2xl">
                <span className="animate-pulse font-black">_</span>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* 10. COVER (封面风) */}
      {layout === "cover" && (
        <div className="flex-1 flex flex-col z-10 w-full h-full text-center relative justify-between">
          <div className="w-full flex-1 flex flex-col items-center justify-center pt-4">
            {coverImage ? (
               <div className="w-full h-[55%] relative rounded-[2.5rem] overflow-hidden shadow-2xl mb-8 border-4 border-white/20 shrink-0">
                 <img src={coverImage} className="w-full h-full object-cover" alt="Cover" />
                 <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
               </div>
            ) : (
               <div className="w-full h-[55%] flex flex-col items-center justify-center rounded-[2.5rem] bg-white/10 backdrop-blur-3xl shadow-2xl mb-8 border border-white/20 shrink-0">
                 {/* fallback icon */}
                 <Sparkles className="w-24 h-24 opacity-20 mb-4" />
                 <span className="text-xs font-bold uppercase tracking-widest opacity-40">Upload Cover Image</span>
               </div>
            )}
            
            <p className="text-sm font-black tracking-[0.4em] uppercase opacity-70 mb-4 bg-brand-start text-white px-4 py-1.5 rounded-full inline-block shadow-lg z-10 shrink-0">
              {subtitle || "FEATURED"}
            </p>
            <h1 className="font-black leading-[1.05] tracking-tight drop-shadow-xl z-10 w-full" style={{ fontSize: `${actualFontSize * 1.5}px` }}>
              {title}
            </h1>
          </div>
          
          <div className="flex items-center justify-between w-full z-10 pt-8 mt-6 border-t border-white/20 shrink-0">
            {author && (
              <div className="flex items-center space-x-3">
                <div className="w-12 h-12 rounded-full bg-white/20 flex items-center justify-center font-bold text-lg ring-2 ring-white/30 overflow-hidden shadow-xl uppercase">
                  {author[1] || "T"}
                </div>
                <div className="text-left">
                  <div className="text-base font-black tracking-widest uppercase">{author}</div>
                  <div className="text-[10px] font-bold opacity-60 tracking-[0.2em]">{new Date().getFullYear()} COLLECTION</div>
                </div>
              </div>
            )}
            <Sparkles className="w-8 h-8 opacity-40 animate-pulse" />
          </div>
        </div>
      )}

      {/* 11. DENSE LIST (高容量干货) */}
      {layout === "denseList" && (
        <div className="flex-1 flex flex-col z-10 w-full">
          <div className="space-y-1 mb-6 text-left border-b-2 border-current pb-4 opacity-90">
            <h1 className="font-black leading-tight tracking-tight" style={{ fontSize: `${actualFontSize * 1.1}px` }}>
              {title}
            </h1>
            {subtitle && (
              <p className="text-[10px] font-bold tracking-[0.2em] uppercase opacity-70 mt-2">
                {subtitle}
              </p>
            )}
          </div>
          
          {coverImage && (
             <img src={coverImage} className="w-full max-h-24 object-cover rounded-lg shadow-sm mb-4 opacity-95" alt="Cover" />
          )}

          <div className="space-y-2 flex-1 relative">
            <div className="absolute left-3 top-0 bottom-0 w-px bg-current opacity-20" />
            {content.split('\n').filter(Boolean).map((line, i) => (
              <div key={i} className="flex items-start gap-4 p-3 rounded-xl bg-white/5 dark:bg-black/10 backdrop-blur-sm border border-white/10 hover:bg-white/10 transition-colors">
                <div className="w-6 h-6 rounded flex items-center justify-center bg-current/10 border border-current/20 font-black text-[10px] shrink-0 shadow-sm z-10 relative">
                  <span>{i + 1}</span>
                </div>
                <div className="leading-snug font-semibold opacity-90 flex-1" style={{ fontSize: `${actualFontSize * 0.75}px` }}>
                  <ReactMarkdown components={{...MarkdownComponents, p: ({node, ...props}) => <p className="mb-0" {...props} />}}>{line}</ReactMarkdown>
                </div>
              </div>
            ))}
          </div>
          <div className="mt-auto pt-4 w-full flex justify-end shrink-0">
            <span className="text-[10px] font-black tracking-widest uppercase opacity-50 bg-current/10 px-3 py-1 rounded">
              {author}
            </span>
          </div>
        </div>
      )}

      {/* 12. MINIMAL (极简艺术) */}
      {layout === "minimal" && (
        <div className="flex-1 flex flex-col z-10 w-full h-full p-6 text-center justify-center items-center bg-transparent">
          <div className="w-12 h-0.5 bg-current opacity-20 mb-8" />
          <h1 className="font-serif font-black text-4xl leading-tight tracking-wide mb-6">
            {title}
          </h1>
          {subtitle && (
            <p className="text-[10px] font-bold tracking-[0.3em] uppercase opacity-50 mb-10">
              {subtitle}
            </p>
          )}
          
          {coverImage && (
             <img src={coverImage} className="w-3/4 max-h-48 object-cover rounded shadow-md mb-8 grayscale hover:grayscale-0 transition-all" alt="Cover" />
          )}

          <div className="leading-relaxed font-normal opacity-80 max-w-[85%]" style={{ fontSize: `${actualFontSize}px` }}>
            <ReactMarkdown components={MarkdownComponents}>{content}</ReactMarkdown>
          </div>
          <div className="w-12 h-0.5 bg-current opacity-20 mt-12 mb-6" />
          {author && (
            <span className="text-xs font-serif italic opacity-60">
              {author}
            </span>
          )}
        </div>
      )}

      {/* 13. NOTION (文档笔记) */}
      {layout === "notion" && (
        <div className="flex-1 flex flex-col z-10 w-full h-full text-left relative overflow-hidden rounded-lg">
          {coverImage && (
             <div className="absolute top-0 left-0 right-0 h-32 z-0">
               <img src={coverImage} className="w-full h-full object-cover" alt="Cover" />
             </div>
          )}
          <div className={cn("relative z-10", coverImage ? "mt-24" : "")}>
             <div className="w-16 h-16 text-5xl mb-4 rounded-lg flex items-center justify-center">
               {author?.[0] || "📄"}
             </div>
             <h1 className="font-bold text-4xl tracking-tight mb-2">
               {title}
             </h1>
             {subtitle && (
               <p className="text-sm font-medium opacity-50 mb-6 border-b border-current/10 pb-4">
                 {subtitle}
               </p>
             )}
          </div>
          
          <div className="flex-1 relative z-10 mt-2">
            <div className="leading-relaxed font-normal opacity-90" style={{ fontSize: `${actualFontSize}px` }}>
              <ReactMarkdown components={MarkdownComponents}>{content}</ReactMarkdown>
            </div>
          </div>
        </div>
      )}

      {/* Watermarks */}
      {watermark && (
        <>
          <div className="absolute inset-0 z-0 pointer-events-none flex items-center justify-center overflow-hidden opacity-[0.03] mix-blend-overlay">
             <div className="text-[120px] font-black uppercase tracking-widest whitespace-nowrap rotate-[-35deg] select-none">
               {watermark} {watermark}
             </div>
          </div>
          <div className="absolute bottom-6 right-8 z-30 pointer-events-none mix-blend-overlay opacity-80">
            <p className="text-[10px] font-black tracking-[0.3em] uppercase whitespace-nowrap drop-shadow-sm">
              {watermark}
            </p>
          </div>
        </>
      )}

    </div>
  );
});

Card.displayName = "Card";
