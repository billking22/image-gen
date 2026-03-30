export type AspectRatio = "3:4" | "4:3" | "1:1" | "9:16";
export type Layout = "left" | "center";
export type BackgroundType = "solid" | "gradient" | "image";

export interface CardState {
  title: string;
  subtitle: string;
  content: string;
  author: string;
  backgroundType: BackgroundType;
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
  backgroundType: "gradient",
  useGlass: false,
  aspectRatio: "3:4",
  layout: "center",
  fontSize: 24,
  textColor: "#ffffff",
  backgroundColor: "#ff4d4d",
};
