export type AspectRatio = "3:4" | "4:3" | "1:1" | "9:16";
export type Layout = "left" | "center" | "quote" | "tweet" | "list" | "magazine" | "dictionary" | "qa" | "steps" | "code";
export type BackgroundType = "solid" | "gradient" | "image" | "pattern";
export type PatternType = "none" | "dots" | "grid" | "lines" | "blobs";

export interface CardState {
  title: string;
  subtitle: string;
  content: string;
  author: string;
  watermark: string;
  backgroundType: BackgroundType;
  patternType: PatternType;
  useGlass: boolean;
  aspectRatio: AspectRatio;
  layout: Layout;
  fontSize: number;
  textColor: string;
  backgroundColor: string;
  backgroundImage?: string;
}

export const INITIAL_STATE: CardState = {
  title: "Example Title",
  subtitle: "Insightful Subtitle",
  content: "This is a beautiful knowledge card. You can now toggle Glass effects on images and adjust text colors independently.",
  author: "@tangxiaobin",
  watermark: "© 2026 KNOWLEDGE SHARE",
  backgroundType: "gradient",
  patternType: "none",
  useGlass: false,
  aspectRatio: "3:4",
  layout: "center",
  fontSize: 24,
  textColor: "#ffffff",
  backgroundColor: "#ff4d4d",
};
