"use client";
import { useEffect, useId, useState, type ReactNode } from "react";
import { staticFile, getRemotionEnvironment, useDelayRender } from "remotion";
import { editorialCollage as scene, rasterAsset, verifyRaster, type RasterReference } from "../../workflow/raster.ts";
import type { PartState } from "../../workflow/components.ts";
import VisualSymbol from "../visual-symbol.tsx";
import { HeadingText } from "../heading-text.tsx";

const decoded = new Map<string, Promise<string>>();
function load(reference: RasterReference) {
  let task = decoded.get(reference.contentHash);
  if (!task) {
    task = (async () => {
      const asset = rasterAsset(reference), response = await fetch(getRemotionEnvironment().isRendering ? staticFile(asset.path) : `/${asset.path}`);
      if (!response.ok) throw new Error("Registered local raster is missing.");
      const bytes = await response.arrayBuffer(); await verifyRaster(reference, bytes, response.headers.get("content-type") ?? "");
      const url = await new Promise<string>((resolve, reject) => { const reader = new FileReader(); reader.onload = () => resolve(String(reader.result)); reader.onerror = () => reject(new Error("Raster read failed.")); reader.readAsDataURL(new Blob([bytes], { type: asset.mime })); });
      const image = new Image(); image.src = url; await image.decode();
      if (image.naturalWidth !== asset.width || image.naturalHeight !== asset.height) throw new Error("Decoded raster dimensions changed.");
      return url;
    })();
    decoded.set(reference.contentHash, task);
  }
  return task;
}
export function EditorialCollage({ width, height, states, actorId, coordinateScale = 1 }: { width: number; height: number; states: Record<string, PartState>; actorId?: string; coordinateScale?: number }) {
  const uid = useId(), { delayRender, continueRender } = useDelayRender();
  const [handle] = useState(() => delayRender("Verify and decode local collage assets"));
  const [images, setImages] = useState<string[] | null>(null), [error, setError] = useState<Error | null>(null);
  useEffect(() => {
    let active = true, released = false;
    const release = () => { if (!released) { continueRender(handle); released = true; } };
    Promise.all([load(scene.photo), load(scene.texture)]).then((value) => { if (active) { setImages(value); release(); } }).catch((failure: unknown) => { if (active) { setError(failure instanceof Error ? failure : new Error("Collage load failed.")); release(); } });
    return () => { active = false; release(); };
  }, [handle, continueRender]);
  if (error) throw error;
  const part = (id: string, children: ReactNode) => {
    const state = states[id], clip = `${uid}-${id}`;
    return <g key={id}><defs><clipPath id={clip}><rect data-reveal={actorId ? `${actorId}.${id}` : undefined} width={width * (state.reveal ?? 1)} height={height} /></clipPath></defs>
      <g data-actor={actorId ? `${actorId}.${id}` : undefined} data-part={id} opacity={state.opacity} color={state.color} transform={`translate(${state.x * 10.8 * coordinateScale} ${state.y * 19.2 * coordinateScale}) scale(${state.scale})`} clipPath={`url(#${clip})`}>
        <svg width={width} height={height} viewBox="0 0 600 800">{children}</svg>
      </g></g>;
  };
  const box = scene.photoBox, crop = scene.crop;
  return <g data-shape data-collage={scene.id} data-raster-ready={!!images} role="img" aria-label="Fictional editorial desk with a separate paper, grain, document icon and Review heading">
    <defs><clipPath id={`${uid}-photo-crop`}><rect x={box.x} y={box.y} width={box.width} height={box.height} rx={box.radius} /></clipPath><clipPath id={`${uid}-paper-cut`}><path d={scene.paperPath} /></clipPath><pattern id={`${uid}-grain`} width="64" height="64" patternUnits="userSpaceOnUse"><image href={images?.[1]} width="64" height="64" /></pattern></defs>
    {part("photo", <g clipPath={`url(#${uid}-photo-crop)`}><svg x={box.x} y={box.y} width={box.width} height={box.height} viewBox={`${crop.x} ${crop.y} ${crop.width} ${crop.height}`} preserveAspectRatio="xMidYMid slice"><image data-raster={scene.photo.id} href={images?.[0]} width={rasterAsset(scene.photo).width} height={rasterAsset(scene.photo).height} /></svg></g>)}
    {part("paper", <path d={scene.paperPath} fill="#FFFDF8" />)}
    {part("texture", <g clipPath={`url(#${uid}-paper-cut)`} opacity={scene.textureOpacity}><rect width="600" height="800" fill={`url(#${uid}-grain)`} /></g>)}
    {part("vector", <VisualSymbol type="document" x={68} y={565} width={104} height={140} color="#244E42" />)}
    {part("type", <g transform="translate(205 590)"><HeadingText label={scene.label} color="#244E42" width={320} height={100} scale={1} centered={false} frame={0} /></g>)}
  </g>;
}
