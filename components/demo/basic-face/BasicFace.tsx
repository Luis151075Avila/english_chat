/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
*/
import { useEffect, useRef, useState } from 'react';

import useFace from '../../../hooks/demo/use-face';
import useHover from '../../../hooks/demo/use-hover';
import useTilt from '../../../hooks/demo/use-tilt';
import { useLiveAPIContext } from '../../../contexts/LiveAPIContext';

// Minimum volume level that indicates audio output is occurring
const AUDIO_OUTPUT_DETECTION_THRESHOLD = 0.05;

// Amount of delay between end of audio output and setting talking state to false
const TALKING_STATE_COOLDOWN_MS = 2000;

type BasicFaceProps = {
  /** The color of the face. */
  color?: string;
};

export default function BasicFace({ color }: BasicFaceProps) {
  // FIX: In a browser environment, the return type of `setTimeout` is `number`, not `NodeJS.Timeout`.
  const timeoutRef = useRef<number | null>(null);

  // Audio output volume
  const { volume } = useLiveAPIContext();

  // Talking state
  const [isTalking, setIsTalking] = useState(false);

  const [scale, setScale] = useState(1);

  // Face state
  const { leftEyeScale, rightEyeScale, mouthScale } = useFace();
  const hoverPosition = useHover();
  const tiltAngle = useTilt({
    maxAngle: 5,
    speed: 0.075,
    isActive: isTalking,
  });

  useEffect(() => {
    function calculateScale() {
      setScale(Math.min(window.innerWidth, window.innerHeight) / 1000);
    }
    window.addEventListener('resize', calculateScale);
    calculateScale();
    return () => window.removeEventListener('resize', calculateScale);
  }, []);

  // Detect whether the agent is talking based on audio output volume
  // Set talking state when volume is detected
  useEffect(() => {
    if (volume > AUDIO_OUTPUT_DETECTION_THRESHOLD) {
      setIsTalking(true);
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
      // Enforce a slight delay between end of audio output and setting talking state to false
      timeoutRef.current = window.setTimeout(
        () => setIsTalking(false),
        TALKING_STATE_COOLDOWN_MS
      );
    }
  }, [volume]);

  return (
    <div
      style={{
        transform: `translateY(${hoverPosition}px) rotate(${tiltAngle}deg) scale(${
          scale * 2
        })`,
        transition: 'transform 0.1s ease-out',
      }}
    >
      <svg
        width="250"
        height="250"
        viewBox="0 0 250 250"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        aria-label="An animated robot avatar representing the AI assistant."
        role="img"
      >
        <defs>
          <linearGradient
            id="robotBodyGradient"
            x1="0%"
            y1="0%"
            x2="0%"
            y2="100%"
          >
            <stop offset="0%" stopColor="#B0B0B0" />
            <stop offset="100%" stopColor="#707070" />
          </linearGradient>
          <radialGradient id="eyeGlow" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor="#64FFDA" stopOpacity="1" />
            <stop offset="70%" stopColor="#1DE9B6" stopOpacity="0.5" />
            <stop offset="100%" stopColor="#00BFA5" stopOpacity="0" />
          </radialGradient>
        </defs>
        <g id="avatar">
          {/* Body */}
          <path
            id="body-fill"
            d="M85 250 L85 180 Q125 160 165 180 L165 250 Z"
            fill={color || '#4285f4'}
          />
          {/* Neck */}
          <rect x="115" y="160" width="20" height="20" fill="#555" />

          {/* Head */}
          <g id="head" transform="translate(0, 0)">
            {/* Face shape */}
            <rect
              x="80"
              y="60"
              width="90"
              height="100"
              rx="15"
              fill="url(#robotBodyGradient)"
              stroke="#444"
              strokeWidth="2"
            />

            {/* "Ears" */}
            <rect x="70" y="95" width="10" height="30" rx="5" fill="#999" />
            <rect x="170" y="95" width="10" height="30" rx="5" fill="#999" />

            {/* Antenna */}
            <line
              x1="125"
              y1="60"
              x2="125"
              y2="40"
              stroke="#777"
              strokeWidth="3"
            />
            <circle cx="125" cy="35" r="5" fill="#fbbc04" />
            <circle cx="125" cy="35" r="8" fill="#fbbc04" fillOpacity="0.3" />

            {/* Eyebrows/Panels */}
            <g transform="translate(125, 80)">
              <rect
                x="-35"
                y="-5"
                width="25"
                height="5"
                rx="2"
                fill="#999"
                style={{
                  transform: `rotate(${isTalking ? -10 : 0}deg)`,
                  transformOrigin: 'right center',
                  transition: 'transform 0.2s ease-out',
                }}
              />
              <rect
                x="10"
                y="-5"
                width="25"
                height="5"
                rx="2"
                fill="#999"
                style={{
                  transform: `rotate(${isTalking ? 10 : 0}deg)`,
                  transformOrigin: 'left center',
                  transition: 'transform 0.2s ease-out',
                }}
              />
            </g>

            {/* Eyes */}
            <g id="eyes" transform="translate(125, 100)">
              {/* Left Eye */}
              <g id="eye-left" transform="translateX(-22)">
                <circle cx="0" cy="0" r="12" fill="#111" />
                <circle cx="0" cy="0" r="8" fill="#64FFDA" />
                <circle cx="0" cy="0" r="15" fill="url(#eyeGlow)" />
                {/* Eyelid */}
                <rect
                  x="-13"
                  y="-13"
                  width="26"
                  height="26"
                  fill="url(#robotBodyGradient)"
                  style={{
                    transform: `scaleY(${1 - leftEyeScale})`,
                    transformOrigin: 'center top',
                  }}
                />
              </g>
              {/* Right Eye */}
              <g id="eye-right" transform="translateX(22)">
                <circle cx="0" cy="0" r="12" fill="#111" />
                <circle cx="0" cy="0" r="8" fill="#64FFDA" />
                <circle cx="0" cy="0" r="15" fill="url(#eyeGlow)" />
                {/* Eyelid */}
                <rect
                  x="-13"
                  y="-13"
                  width="26"
                  height="26"
                  fill="url(#robotBodyGradient)"
                  style={{
                    transform: `scaleY(${1 - rightEyeScale})`,
                    transformOrigin: 'center top',
                  }}
                />
              </g>
            </g>

            {/* Mouth */}
            <g
              id="mouth"
              transform="translate(125, 140)"
              opacity={isTalking ? 1 : 0.3}
              style={{ transition: 'opacity 0.2s' }}
            >
              <rect
                x="-25"
                y="-2.5"
                width="50"
                height="5"
                rx="2.5"
                fill="#64FFDA"
                fillOpacity={mouthScale * 2}
              />
              <rect
                x="-25"
                y="-2.5"
                width="50"
                height="5"
                rx="2.5"
                stroke="#333"
                fill="none"
              />
            </g>
          </g>
        </g>
      </svg>
    </div>
  );
}
