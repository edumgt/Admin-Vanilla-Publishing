import { buildSamplingPlan, generateVideoAnalysisReport } from './video-ai-core.js';

const MAX_ANALYSIS_SIDE = 160;
const SIGNATURE_GRID = 8;

const once = (target, eventName) => new Promise((resolve, reject) => {
  const onEvent = () => {
    cleanup();
    resolve();
  };

  const onError = () => {
    cleanup();
    reject(new Error('영상 정보를 읽는 중 오류가 발생했습니다.'));
  };

  const cleanup = () => {
    target.removeEventListener(eventName, onEvent);
    target.removeEventListener('error', onError);
  };

  target.addEventListener(eventName, onEvent, { once: true });
  target.addEventListener('error', onError, { once: true });
});

const clamp = (value, min = 0, max = 1) => Math.min(max, Math.max(min, value));

function fitWithinBounds(width, height) {
  const safeWidth = Math.max(1, width);
  const safeHeight = Math.max(1, height);
  const longestSide = Math.max(safeWidth, safeHeight);
  const scale = longestSide > MAX_ANALYSIS_SIDE ? MAX_ANALYSIS_SIDE / longestSide : 1;

  return {
    width: Math.max(32, Math.round(safeWidth * scale)),
    height: Math.max(32, Math.round(safeHeight * scale)),
  };
}

async function loadVideoElement(objectUrl) {
  const video = document.createElement('video');
  video.preload = 'auto';
  video.muted = true;
  video.playsInline = true;
  video.crossOrigin = 'anonymous';
  video.style.position = 'fixed';
  video.style.width = '1px';
  video.style.height = '1px';
  video.style.opacity = '0';
  video.style.pointerEvents = 'none';
  video.style.left = '-9999px';
  document.body.appendChild(video);
  video.src = objectUrl;
  const metadataReady = once(video, 'loadedmetadata');
  video.load();

  await metadataReady;

  return video;
}

async function seekVideo(video, time) {
  const boundedTime = Math.min(Math.max(time, 0), Math.max(video.duration - 0.001, 0));

  if (Math.abs(video.currentTime - boundedTime) < 0.005) {
    return;
  }

  await new Promise((resolve, reject) => {
    const onSeeked = () => {
      cleanup();
      resolve();
    };

    const onError = () => {
      cleanup();
      reject(new Error('프레임 이동 중 오류가 발생했습니다.'));
    };

    const cleanup = () => {
      video.removeEventListener('seeked', onSeeked);
      video.removeEventListener('error', onError);
    };

    video.addEventListener('seeked', onSeeked, { once: true });
    video.addEventListener('error', onError, { once: true });
    video.currentTime = boundedTime;
  });
}

function computeFrameMetrics(imageData, width, height, time) {
  const totalPixels = width * height;
  const signature = new Array(SIGNATURE_GRID * SIGNATURE_GRID).fill(0);
  const signatureCounts = new Array(signature.length).fill(0);
  const previousRow = new Float32Array(width);

  let luminanceSum = 0;
  let luminanceSquaredSum = 0;
  let saturationSum = 0;
  let highlightCount = 0;
  let edgeAccumulator = 0;
  let microTextureAccumulator = 0;

  for (let y = 0; y < height; y += 1) {
    let leftLuma = 0;
    let previousUpLuma = 0;

    for (let x = 0; x < width; x += 1) {
      const pixelIndex = (y * width + x) * 4;
      const red = imageData[pixelIndex] / 255;
      const green = imageData[pixelIndex + 1] / 255;
      const blue = imageData[pixelIndex + 2] / 255;

      const maxChannel = Math.max(red, green, blue);
      const minChannel = Math.min(red, green, blue);
      const luminance = (0.2126 * red) + (0.7152 * green) + (0.0722 * blue);
      const saturation = maxChannel === 0 ? 0 : (maxChannel - minChannel) / maxChannel;

      const upLuma = y > 0 ? previousRow[x] : luminance;
      const upLeftLuma = y > 0 && x > 0 ? previousUpLuma : luminance;
      const neighbourhoodBase = x > 0 || y > 0
        ? (leftLuma + upLuma + upLeftLuma) / (x > 0 && y > 0 ? 3 : 2)
        : luminance;

      if (x > 0 || y > 0) {
        edgeAccumulator += Math.abs(luminance - leftLuma) + Math.abs(luminance - upLuma);
        microTextureAccumulator += Math.abs(luminance - neighbourhoodBase);
      }

      luminanceSum += luminance;
      luminanceSquaredSum += luminance * luminance;
      saturationSum += saturation;

      if (luminance >= 0.92) {
        highlightCount += 1;
      }

      const signatureX = Math.min(SIGNATURE_GRID - 1, Math.floor((x / width) * SIGNATURE_GRID));
      const signatureY = Math.min(SIGNATURE_GRID - 1, Math.floor((y / height) * SIGNATURE_GRID));
      const signatureIndex = (signatureY * SIGNATURE_GRID) + signatureX;
      signature[signatureIndex] += luminance;
      signatureCounts[signatureIndex] += 1;

      previousUpLuma = upLuma;
      previousRow[x] = luminance;
      leftLuma = luminance;
    }
  }

  const averageBrightness = luminanceSum / totalPixels;
  const brightnessVariance = Math.max(0, (luminanceSquaredSum / totalPixels) - (averageBrightness ** 2));

  return {
    time,
    brightness: averageBrightness,
    brightnessVariance,
    saturation: saturationSum / totalPixels,
    highlightRatio: highlightCount / totalPixels,
    edgeDensity: edgeAccumulator / Math.max(totalPixels * 2, 1),
    microTexture: microTextureAccumulator / Math.max(totalPixels, 1),
    signature: signature.map((value, index) => value / Math.max(signatureCounts[index], 1)),
  };
}

export async function analyzeVideoFile(file, { sampleCount = 8 } = {}) {
  if (!(file instanceof File)) {
    throw new Error('올바른 동영상 파일이 아닙니다.');
  }

  const objectUrl = URL.createObjectURL(file);
  let video;

  try {
    video = await loadVideoElement(objectUrl);
    const metadata = {
      name: file.name,
      size: file.size,
      type: file.type,
      duration: video.duration,
      width: video.videoWidth,
      height: video.videoHeight,
    };
    const framePlan = buildSamplingPlan(video.duration, sampleCount);
    const canvasSize = fitWithinBounds(video.videoWidth, video.videoHeight);
    const canvas = document.createElement('canvas');
    const context = canvas.getContext('2d', { willReadFrequently: true });

    if (!context) {
      throw new Error('캔버스 컨텍스트를 생성하지 못했습니다.');
    }

    canvas.width = canvasSize.width;
    canvas.height = canvasSize.height;

    const frames = [];

    for (const sampleTime of framePlan) {
      await seekVideo(video, sampleTime);
      context.drawImage(video, 0, 0, canvas.width, canvas.height);
      const imageData = context.getImageData(0, 0, canvas.width, canvas.height).data;
      frames.push(computeFrameMetrics(imageData, canvas.width, canvas.height, sampleTime));
    }

    return generateVideoAnalysisReport({ metadata, frames });
  } finally {
    if (video) {
      video.remove();
    }
    URL.revokeObjectURL(objectUrl);
  }
}

export function formatPercent(value) {
  if (!Number.isFinite(value)) {
    return '-';
  }

  return `${Math.round(clamp(value) * 100)}%`;
}

export function formatBytes(bytes) {
  if (!Number.isFinite(bytes) || bytes <= 0) {
    return '-';
  }

  const units = ['B', 'KB', 'MB', 'GB'];
  let currentValue = bytes;
  let unitIndex = 0;

  while (currentValue >= 1024 && unitIndex < units.length - 1) {
    currentValue /= 1024;
    unitIndex += 1;
  }

  return `${currentValue.toFixed(currentValue >= 10 || unitIndex === 0 ? 0 : 1)} ${units[unitIndex]}`;
}

export function formatDuration(seconds) {
  if (!Number.isFinite(seconds) || seconds <= 0) {
    return '-';
  }

  const minutes = Math.floor(seconds / 60);
  const remainingSeconds = seconds % 60;

  if (minutes === 0) {
    return `${remainingSeconds.toFixed(1)}초`;
  }

  return `${minutes}분 ${remainingSeconds.toFixed(1)}초`;
}
