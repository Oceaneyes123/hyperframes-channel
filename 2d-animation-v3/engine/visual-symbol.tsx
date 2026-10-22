const paths: Record<string, string> = {
  document: "M20 5H62L85 28V95H20ZM62 5V28H85M32 45H72M32 60H72M32 75H60",
  browser: "M5 15H95V85H5ZM5 32H95M15 23H18M25 23H28M35 23H38M20 48H50M20 60H75M20 72H65",
  database: "M12 20C12 0 88 0 88 20V80C88 100 12 100 12 80ZM12 20C12 40 88 40 88 20M12 48C12 68 88 68 88 48M12 74C12 94 88 94 88 74",
  server: "M12 8H88V32H12ZM12 38H88V62H12ZM12 68H88V92H12ZM22 20H26M22 50H26M22 80H26M40 20H76M40 50H76M40 80H76",
  cloud: "M25 78C0 78 0 40 25 40C25 5 78 5 78 40C103 40 103 78 78 78Z",
  person: "M35 25A15 15 0 1 0 65 25A15 15 0 1 0 35 25ZM18 95V75C18 40 82 40 82 75V95Z",
  chip: "M20 20H80V80H20ZM35 35H65V65H35ZM30 2V20M50 2V20M70 2V20M30 80V98M50 80V98M70 80V98M2 30H20M2 50H20M2 70H20M80 30H98M80 50H98M80 70H98",
  coin: "M50 5A45 45 0 1 0 50 95A45 45 0 1 0 50 5ZM50 22V78M68 30H42C22 30 22 50 42 50H58C78 50 78 70 58 70H32",
};
export function isSymbol(type: string) { return Object.hasOwn(paths, type); }
export default function VisualSymbol({ type, x = 0, y = 0, width, height, color }: { type: string; x?: number; y?: number; width: number; height: number; color: string }) {
  if (!isSymbol(type)) throw new Error("Unsupported visual symbol.");
  return <svg data-shape x={x} y={y} width={width} height={height} viewBox="-3 -3 106 106" color={color} fill={color}>
    <path d={paths[type]} fill="none" stroke="currentColor" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round" />
  </svg>;
}
