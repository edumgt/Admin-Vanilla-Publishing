import test from 'node:test';
import assert from 'node:assert/strict';

import { buildSamplingPlan, generateVideoAnalysisReport } from '../public/assets/js/video-ai-core.js';

function createFrame(time, overrides = {}) {
  const signatureSeed = overrides.signatureSeed ?? 0.5;

  return {
    time,
    brightness: 0.54,
    brightnessVariance: 0.024,
    saturation: 0.42,
    highlightRatio: 0.08,
    edgeDensity: 0.16,
    microTexture: 0.06,
    signature: Array.from({ length: 64 }, (_, index) => signatureSeed + ((index % 8) * 0.001)),
    ...overrides,
  };
}

test('buildSamplingPlan spreads frames across the clip duration', () => {
  const plan = buildSamplingPlan(5, 4);

  assert.equal(plan.length, 4);
  assert.ok(plan[0] > 0);
  assert.ok(plan.at(-1) < 5);
  assert.ok(plan[0] < plan[1] && plan[1] < plan[2] && plan[2] < plan[3]);
});

test('generateVideoAnalysisReport classifies synthetic-looking footage as AI-heavy', () => {
  const report = generateVideoAnalysisReport({
    metadata: {
      name: '1.mp4',
      duration: 5,
      width: 480,
      height: 720,
      size: 3_033_124,
      type: 'video/mp4',
    },
    frames: [
      createFrame(0.4, { saturation: 0.62, highlightRatio: 0.16, edgeDensity: 0.2, microTexture: 0.026, signatureSeed: 0.61 }),
      createFrame(1.1, { saturation: 0.58, highlightRatio: 0.13, edgeDensity: 0.18, microTexture: 0.028, signatureSeed: 0.612 }),
      createFrame(1.8, { saturation: 0.55, highlightRatio: 0.12, edgeDensity: 0.19, microTexture: 0.03, signatureSeed: 0.614 }),
      createFrame(2.5, { saturation: 0.57, highlightRatio: 0.14, edgeDensity: 0.21, microTexture: 0.027, signatureSeed: 0.611 }),
      createFrame(3.2, { saturation: 0.56, highlightRatio: 0.11, edgeDensity: 0.18, microTexture: 0.029, signatureSeed: 0.615 }),
    ],
  });

  assert.equal(report.verdict, 'AI 생성 가능성 높음');
  assert.ok(report.aiProbability >= 0.68);
  assert.equal(report.frameSeries.length, 5);
  assert.equal(report.highlights.length, 3);
});

test('generateVideoAnalysisReport keeps noisy longer footage on the real side', () => {
  const report = generateVideoAnalysisReport({
    metadata: {
      name: 'camera.mp4',
      duration: 36,
      width: 1920,
      height: 1080,
      size: 12_200_000,
      type: 'video/mp4',
    },
    frames: [
      createFrame(2.5, { saturation: 0.18, highlightRatio: 0.018, edgeDensity: 0.07, microTexture: 0.16, signatureSeed: 0.22 }),
      createFrame(9.5, { saturation: 0.2, highlightRatio: 0.022, edgeDensity: 0.08, microTexture: 0.15, signatureSeed: 0.35 }),
      createFrame(16.5, { saturation: 0.16, highlightRatio: 0.02, edgeDensity: 0.075, microTexture: 0.155, signatureSeed: 0.41 }),
      createFrame(23.5, { saturation: 0.17, highlightRatio: 0.015, edgeDensity: 0.085, microTexture: 0.162, signatureSeed: 0.29 }),
      createFrame(30.5, { saturation: 0.19, highlightRatio: 0.018, edgeDensity: 0.08, microTexture: 0.158, signatureSeed: 0.47 }),
    ],
  });

  assert.equal(report.verdict, '실사 가능성 높음');
  assert.ok(report.aiProbability <= 0.4);
});
