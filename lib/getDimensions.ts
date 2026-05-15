const MM_TO_PX = 3.7795; // 96 dpi

export type IssueDimensions = {
  cover?: { width: number; height: number };
  spine?: { width: number };
};

export type ParsedDimensions = {
  coverAspectRatio: number;
  spineAspectRatio: number;
  coverWidthPx: number;
  coverHeightPx: number;
  spineWidthPx: number;
};

const DEFAULTS = {
  cover: { width: 170, height: 240 },
  spine: { width: 7 },
};

export function getDimensions(dimensions?: IssueDimensions): ParsedDimensions {
  const cover = dimensions?.cover ?? DEFAULTS.cover;
  const spine = dimensions?.spine ?? DEFAULTS.spine;

  return {
    coverAspectRatio: cover.width / cover.height,
    spineAspectRatio: spine.width / cover.height,
    coverWidthPx: cover.width * MM_TO_PX,
    coverHeightPx: cover.height * MM_TO_PX,
    spineWidthPx: spine.width * MM_TO_PX,
  };
}
