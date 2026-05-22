import type { CardStyle } from '../data/cardStyles'

interface EnvelopeSvgProps {
  envelope: CardStyle['envelope']
  motif: string
}

/** Shared vertices: flap bottom & wing tops meet at y=58, full width 0–260 */
const W = 260
const SEAL_Y = 58
const BODY_H = 108
const H = SEAL_Y + BODY_H

export function EnvelopeSvg({ envelope, motif }: EnvelopeSvgProps) {
  return (
    <svg
      className="envelope__svg"
      viewBox={`0 0 ${W} ${H}`}
      width={W}
      height={H}
      aria-hidden="true"
    >
      <defs>
        <filter id="envelope-shadow" x="-8%" y="-4%" width="116%" height="112%">
          <feDropShadow dx="0" dy="8" stdDeviation="10" floodOpacity="0.18" />
        </filter>
      </defs>

      <g filter="url(#envelope-shadow)">
        {/* Body */}
        <path
          d={`M 0 ${SEAL_Y} L 0 ${H - 6} Q 0 ${H} 6 ${H} L ${W - 6} ${H} Q ${W} ${H} ${W} ${H - 6} L ${W} ${SEAL_Y} Z`}
          fill={envelope.inner}
        />

        {/* Side folds */}
        <polygon points={`0,${SEAL_Y} ${W / 2},${SEAL_Y} 0,${H}`} fill={envelope.outer} />
        <polygon points={`${W},${SEAL_Y} ${W / 2},${SEAL_Y} ${W},${H}`} fill={envelope.outer} />

        {/* Top flap — full width at seal line so no corner gaps */}
        <polygon
          points={`0,0 ${W},0 ${W},${SEAL_Y} ${W / 2},${SEAL_Y} 0,${SEAL_Y}`}
          fill={envelope.flap}
        />
      </g>

      {/* Wax seal */}
      <circle cx={W / 2} cy={SEAL_Y} r={22} fill={envelope.seal} />
      <text
        x={W / 2}
        y={SEAL_Y + 1}
        textAnchor="middle"
        dominantBaseline="middle"
        fill={envelope.sealText}
        fontSize={18}
      >
        {motif}
      </text>
    </svg>
  )
}
