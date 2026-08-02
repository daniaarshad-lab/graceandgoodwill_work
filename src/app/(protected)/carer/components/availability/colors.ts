export const RANGE_COLORS = [
  {
    bgClass: "bg-gold-DEFAULT",
    textClass: "text-white",
    hoverBgClass: "hover:bg-gold-400",
    shadowClass: "shadow-[0_0_12px_rgba(212,175,55,0.3)]",
    dotClass: "bg-gold-300 shadow-[0_0_8px_rgba(212,175,55,0.5)]",
    ringClass:
      "bg-navy-950 text-gold-50 shadow-[0_0_12px_rgba(212,175,55,0.8)]",
    previewClass: "bg-gold-DEFAULT/50",
    middleClass: "bg-gold-DEFAULT/20",
    textHoverClass: "hover:text-gold-300",
    hexColor: "#d4af37",
  },
];

export function getRangeColor(index: number) {
  return RANGE_COLORS[index % RANGE_COLORS.length];
}
