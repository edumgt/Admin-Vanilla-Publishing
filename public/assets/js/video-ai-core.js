const clamp = (value, min = 0, max = 1) => Math.min(max, Math.max(min, value));

const average = (values) => {
  if (!values.length) {
    return 0;
  }

  return values.reduce((sum, value) => sum + value, 0) / values.length;
};

const standardDeviation = (values) => {
  if (values.length < 2) {
    return 0;
  }

  const mean = average(values);
  const variance = average(values.map((value) => (value - mean) ** 2));
  return Math.sqrt(variance);
};

const toFixedNumber = (value, digits = 4) => Number(value.toFixed(digits));

export function buildSamplingPlan(duration, sampleCount = 8) {
  const safeDuration = Number.isFinite(duration) && duration > 0 ? duration : 1;
  const safeCount = Math.max(1, Math.floor(sampleCount));

  if (safeCount === 1) {
    return [toFixedNumber(safeDuration / 2, 3)];
  }

  const edgePadding = Math.min(0.45, safeDuration * 0.08);
  const start = edgePadding;
  const end = Math.max(edgePadding, safeDuration - edgePadding);
  const step = (end - start) / (safeCount - 1 || 1);

  return Array.from({ length: safeCount }, (_, index) => toFixedNumber(start + (step * index), 3));
}

export function calculateTemporalDelta(signatureA = [], signatureB = []) {
  const safeLength = Math.min(signatureA.length, signatureB.length);

  if (!safeLength) {
    return 0;
  }

  let totalDelta = 0;

  for (let index = 0; index < safeLength; index += 1) {
    totalDelta += Math.abs(signatureA[index] - signatureB[index]);
  }

  return totalDelta / safeLength;
}

function buildMetadataProfile(metadata = {}) {
  const duration = Number.isFinite(metadata.duration) ? metadata.duration : 0;
  const width = Number.isFinite(metadata.width) ? metadata.width : 0;
  const height = Number.isFinite(metadata.height) ? metadata.height : 0;
  const size = Number.isFinite(metadata.size) ? metadata.size : 0;
  const aspectRatio = height > 0 ? width / height : 1;
  const bitrateMbps = duration > 0 ? (size * 8) / (duration * 1_000_000) : 0;

  return {
    ...metadata,
    duration,
    width,
    height,
    size,
    aspectRatio,
    bitrateMbps,
  };
}

function summarizeFrameSamples(frames = []) {
  const safeFrames = frames.filter(Boolean).map((frame) => ({
    ...frame,
    signature: Array.isArray(frame.signature) ? frame.signature : [],
  }));

  if (!safeFrames.length) {
    return {
      averageFrameScore: 0,
      averages: {
        brightness: 0,
        saturation: 0,
        edgeDensity: 0,
        microTexture: 0,
        highlightRatio: 0,
        temporalDelta: 0,
        brightnessSpread: 0,
      },
      frames: [],
    };
  }

  const temporalDeltas = safeFrames.map((frame, index) => {
    if (index === 0) {
      return 0;
    }

    return calculateTemporalDelta(frame.signature, safeFrames[index - 1].signature);
  });

  const scoredFrames = safeFrames.map((frame, index) => {
    const temporalDelta = temporalDeltas[index];
    const aiScore = clamp(
      (0.32 * clamp(1 - (frame.microTexture / 0.11))) +
      (0.24 * clamp(frame.highlightRatio / 0.09)) +
      (0.18 * clamp(frame.saturation / 0.46)) +
      (0.14 * clamp(frame.edgeDensity / 0.19)) +
      (0.12 * clamp(1 - (temporalDelta / 0.18)))
    );

    return {
      ...frame,
      temporalDelta,
      aiScore: toFixedNumber(aiScore, 4),
    };
  });

  return {
    averageFrameScore: average(scoredFrames.map((frame) => frame.aiScore)),
    averages: {
      brightness: average(scoredFrames.map((frame) => frame.brightness)),
      saturation: average(scoredFrames.map((frame) => frame.saturation)),
      edgeDensity: average(scoredFrames.map((frame) => frame.edgeDensity)),
      microTexture: average(scoredFrames.map((frame) => frame.microTexture)),
      highlightRatio: average(scoredFrames.map((frame) => frame.highlightRatio)),
      temporalDelta: average(temporalDeltas.slice(1)),
      brightnessSpread: standardDeviation(scoredFrames.map((frame) => frame.brightness)),
    },
    frames: scoredFrames,
  };
}

function buildIndicators(metadata, frameSummary) {
  const { averages } = frameSummary;

  return [
    {
      key: 'smooth-surface',
      label: '미세 질감 균일성',
      description: '센서 노이즈와 피부/재질의 미세 결이 약하게 나타나면 생성형 영상으로 가중합니다.',
      score: clamp(1 - (averages.microTexture / 0.12)),
      weight: 0.23,
    },
    {
      key: 'specular-light',
      label: '하이라이트 / 네온 반사',
      description: '강한 반사광과 높은 채도가 반복되면 렌더링 또는 생성형 합성 패턴으로 봅니다.',
      score: clamp((averages.highlightRatio / 0.11) * 0.62 + (averages.saturation / 0.44) * 0.38),
      weight: 0.18,
    },
    {
      key: 'temporal-stability',
      label: '프레임 변화의 매끈함',
      description: '프레임 사이 변화가 과하게 안정적이면 합성된 모션일 가능성을 높게 반영합니다.',
      score: clamp(1 - (averages.temporalDelta / 0.18)),
      weight: 0.13,
    },
    {
      key: 'edge-definition',
      label: '윤곽선 정돈도',
      description: '윤곽선이 과하게 정리된 경우 생성형 모델 특유의 선명도를 의심합니다.',
      score: clamp(averages.edgeDensity / 0.17),
      weight: 0.09,
    },
    {
      key: 'short-form',
      label: '쇼트폼 길이 패턴',
      description: '짧은 데모형 클립은 생성형 샘플 비중이 높아 보조 신호로 반영합니다.',
      score: clamp(1 - (metadata.duration / 18)),
      weight: 0.18,
    },
    {
      key: 'portrait-composition',
      label: '세로형 구도',
      description: '세로형 구도는 생성형 데모와 광고 샘플에서 자주 보이는 편입니다.',
      score: metadata.aspectRatio < 0.95 ? 0.74 : 0.26,
      weight: 0.12,
    },
    {
      key: 'bitrate-density',
      label: '길이 대비 비트레이트',
      description: '짧은 길이 대비 높은 비트레이트는 렌더 기반 결과물에서 자주 보입니다.',
      score: clamp((metadata.bitrateMbps - 2.5) / 4.2),
      weight: 0.07,
    },
  ].map((indicator) => ({
    ...indicator,
    score: toFixedNumber(indicator.score, 4),
    contribution: toFixedNumber(indicator.score * indicator.weight, 4),
  }));
}

function buildVerdict(aiProbability) {
  if (aiProbability >= 0.5) {
    return {
      tone: 'ai',
      badge: 'AI 우세',
      verdict: 'AI 생성 가능성 높음',
      summary: '질감이 매우 균일하고 반사광 패턴이 강해 생성형 또는 렌더링 기반 영상으로 추정됩니다.',
    };
  }

  if (aiProbability <= 0.34) {
    return {
      tone: 'real',
      badge: '실사 우세',
      verdict: '실사 가능성 높음',
      summary: '프레임 간 변화와 질감 노이즈가 자연스러워 실사 촬영 영상으로 추정됩니다.',
    };
  }

  return {
    tone: 'mixed',
    badge: '판단 보류',
    verdict: '판단 보류',
    summary: '일부 생성형 패턴이 보이지만 실사 신호도 함께 있어 추가 검토가 필요합니다.',
  };
}

export function generateVideoAnalysisReport({ metadata = {}, frames = [] } = {}) {
  const metadataProfile = buildMetadataProfile(metadata);
  const frameSummary = summarizeFrameSamples(frames);
  const indicators = buildIndicators(metadataProfile, frameSummary);

  const aiProbability = indicators.reduce((sum, indicator) => sum + (indicator.score * indicator.weight), 0);
  const confidence = clamp(0.56 + (Math.abs(aiProbability - 0.5) * 0.92), 0.56, 0.98);
  const verdictInfo = buildVerdict(aiProbability);
  const highlights = [...indicators]
    .sort((left, right) => right.contribution - left.contribution)
    .slice(0, 3)
    .map((indicator) => ({
      label: indicator.label,
      detail: indicator.description,
      score: indicator.score,
    }));

  return {
    metadata: metadataProfile,
    aiProbability: toFixedNumber(aiProbability, 4),
    confidence: toFixedNumber(confidence, 4),
    tone: verdictInfo.tone,
    badge: verdictInfo.badge,
    verdict: verdictInfo.verdict,
    summary: verdictInfo.summary,
    indicators,
    highlights,
    averageFrameScore: toFixedNumber(frameSummary.averageFrameScore, 4),
    frameSeries: frameSummary.frames.map((frame) => ({
      label: `${frame.time.toFixed(1)}s`,
      score: toFixedNumber(frame.aiScore, 4),
      temporalDelta: toFixedNumber(frame.temporalDelta, 4),
    })),
    frameAverages: {
      ...Object.fromEntries(
        Object.entries(frameSummary.averages).map(([key, value]) => [key, toFixedNumber(value, 4)])
      ),
    },
  };
}
