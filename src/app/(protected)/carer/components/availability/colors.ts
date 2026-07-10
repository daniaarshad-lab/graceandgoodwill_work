export const RANGE_COLORS = [
  {
    bgClass: "bg-gold-DEFAULT",
    textClass: "text-white",
    hoverBgClass: "hover:bg-gold-400",
    shadowClass: "shadow-[0_0_12px_rgba(212,175,55,0.3)]",
    dotClass: "bg-gold-300 shadow-[0_0_8px_rgba(212,175,55,0.5)]",
    ringClass: "bg-navy-950 text-gold-50 shadow-[0_0_12px_rgba(212,175,55,0.8)]",
    previewClass: "bg-gold-DEFAULT/50",
    middleClass: "bg-gold-DEFAULT/20",
    textHoverClass: "hover:text-gold-300",
    hexColor: "#d4af37"
  },
  {
    bgClass: "bg-blue-500",
    textClass: "text-white",
    hoverBgClass: "hover:bg-blue-600",
    shadowClass: "shadow-[0_0_12px_rgba(59,130,246,0.3)]",
    dotClass: "bg-blue-400 shadow-[0_0_8px_rgba(96,165,250,0.5)]",
    ringClass: "bg-navy-950 text-blue-50 shadow-[0_0_12px_rgba(96,165,250,0.8)]",
    previewClass: "bg-blue-500/50",
    middleClass: "bg-blue-500/20",
    textHoverClass: "hover:text-blue-400",
    hexColor: "#3b82f6"
  },
  {
    bgClass: "bg-purple-500",
    textClass: "text-white",
    hoverBgClass: "hover:bg-purple-600",
    shadowClass: "shadow-[0_0_12px_rgba(168,85,247,0.3)]",
    dotClass: "bg-purple-400 shadow-[0_0_8px_rgba(192,132,252,0.5)]",
    ringClass: "bg-navy-950 text-purple-50 shadow-[0_0_12px_rgba(192,132,252,0.8)]",
    previewClass: "bg-purple-500/50",
    middleClass: "bg-purple-500/20",
    textHoverClass: "hover:text-purple-400",
    hexColor: "#a855f7"
  },
  {
    bgClass: "bg-rose-500",
    textClass: "text-white",
    hoverBgClass: "hover:bg-rose-600",
    shadowClass: "shadow-[0_0_12px_rgba(244,63,94,0.3)]",
    dotClass: "bg-rose-400 shadow-[0_0_8px_rgba(251,113,133,0.5)]",
    ringClass: "bg-navy-950 text-rose-50 shadow-[0_0_12px_rgba(251,113,133,0.8)]",
    previewClass: "bg-rose-500/50",
    middleClass: "bg-rose-500/20",
    textHoverClass: "hover:text-rose-400",
    hexColor: "#f43f5e"
  },
  {
    bgClass: "bg-amber-500",
    textClass: "text-white",
    hoverBgClass: "hover:bg-amber-600",
    shadowClass: "shadow-[0_0_12px_rgba(245,158,11,0.3)]",
    dotClass: "bg-amber-400 shadow-[0_0_8px_rgba(251,191,36,0.5)]",
    ringClass: "bg-navy-950 text-amber-50 shadow-[0_0_12px_rgba(251,191,36,0.8)]",
    previewClass: "bg-amber-500/50",
    middleClass: "bg-amber-500/20",
    textHoverClass: "hover:text-amber-400",
    hexColor: "#f59e0b"
  }
];

export function getRangeColor(index: number) {
  return RANGE_COLORS[index % RANGE_COLORS.length];
}
