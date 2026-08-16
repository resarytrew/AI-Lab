type IllustrationProps = {
  className?: string;
};

const visualStyle = {
  width: '100%',
  height: 'auto',
  maxHeight: '72svh',
  overflow: 'visible',
} as const;

const networkInputs = [
  {id: 'i1', x: 442, y: 238},
  {id: 'i2', x: 442, y: 302},
  {id: 'i3', x: 442, y: 366},
];
const networkHidden = [
  {id: 'h1', x: 536, y: 218},
  {id: 'h2', x: 536, y: 280},
  {id: 'h3', x: 536, y: 342},
  {id: 'h4', x: 536, y: 404},
];
const networkOutputs = [
  {id: 'o1', x: 636, y: 270},
  {id: 'o2', x: 636, y: 352},
];

function SceneDefs() {
  return (
    <defs>
      <linearGradient id="peachBlob" x1="0" y1="0" x2="1" y2="1">
        <stop offset="0" stopColor="#ffe8db" />
        <stop offset="1" stopColor="#ffc9ad" />
      </linearGradient>
      <linearGradient id="orangeGlow" x1="0" y1="0" x2="1" y2="1">
        <stop offset="0" stopColor="#ff9b63" />
        <stop offset="1" stopColor="#ef6326" />
      </linearGradient>
      <filter id="softShadow" x="-30%" y="-30%" width="160%" height="180%">
        <feDropShadow dx="0" dy="18" stdDeviation="18" floodColor="#5f3523" floodOpacity="0.14" />
      </filter>
      <filter id="smallShadow" x="-30%" y="-30%" width="160%" height="180%">
        <feDropShadow dx="0" dy="8" stdDeviation="10" floodColor="#5f3523" floodOpacity="0.1" />
      </filter>
    </defs>
  );
}

function MainPanel({title = 'AI LAB / SYSTEM VIEW'}: {title?: string}) {
  return (
    <g filter="url(#softShadow)">
      <rect x="285" y="108" width="470" height="386" rx="30" fill="#fffdfa" stroke="#7f4b35" strokeWidth="2.2" />
      <rect x="307" y="132" width="426" height="338" rx="22" fill="#ffffff" stroke="#efd8cc" strokeWidth="1.4" />
      <circle cx="332" cy="157" r="6" fill="#ef6b2f" />
      <circle cx="353" cy="157" r="6" fill="#f6a37c" />
      <circle cx="374" cy="157" r="6" fill="#e7d8d0" />
      <text x="705" y="162" textAnchor="end" fontFamily="Arial, sans-serif" fontSize="11" fontWeight="700" fill="#8f7e75" letterSpacing="1.2">{title}</text>
    </g>
  );
}

function FloatingCard({x, y, width, height, children}: {x: number; y: number; width: number; height: number; children: React.ReactNode}) {
  return (
    <g filter="url(#smallShadow)">
      <rect x={x} y={y} width={width} height={height} rx="18" fill="#fffdfa" stroke="#efc9b6" strokeWidth="1.4" />
      {children}
    </g>
  );
}

function NetworkDiagram() {
  return (
    <g>
      {networkInputs.flatMap((input) => networkHidden.map((hidden) => (
        <line key={`${input.id}-${hidden.id}`} x1={input.x + 14} y1={input.y} x2={hidden.x - 16} y2={hidden.y} stroke="#8c5a43" strokeWidth="1.45" opacity="0.72" />
      )))}
      {networkHidden.flatMap((hidden) => networkOutputs.map((output) => (
        <line key={`${hidden.id}-${output.id}`} x1={hidden.x + 16} y1={hidden.y} x2={output.x - 16} y2={output.y} stroke="#8c5a43" strokeWidth="1.45" opacity="0.72" />
      )))}
      {networkInputs.map((node) => <circle key={node.id} cx={node.x} cy={node.y} r="13" fill="#ffd7c2" stroke="#8c5a43" strokeWidth="1.8" />)}
      {networkHidden.map((node) => <circle key={node.id} cx={node.x} cy={node.y} r="17" fill="#ff8f52" stroke="#8c4a2f" strokeWidth="1.8" />)}
      {networkOutputs.map((node, index) => <circle key={node.id} cx={node.x} cy={node.y} r="16" fill={index === 0 ? '#ed5d1c' : '#ffb184'} stroke="#8c4a2f" strokeWidth="1.8" />)}
    </g>
  );
}

export function IntroIllustration({className}: IllustrationProps) {
  return (
    <svg className={className} style={visualStyle} viewBox="0 0 820 610" role="img" aria-label="Премиальная визуализация лаборатории искусственного интеллекта">
      <SceneDefs />
      <path d="M147 490C88 367 117 209 248 116c126-89 355-85 471 18 104 93 111 246 13 351-105 111-510 119-585 5Z" fill="url(#peachBlob)" />
      <circle cx="691" cy="145" r="34" fill="#fff7f2" opacity="0.82" />
      <path d="M735 104l39 10-10 41-39-10Z" fill="url(#orangeGlow)" transform="rotate(12 754 126)" />
      <MainPanel />
      <NetworkDiagram />
      <FloatingCard x={185} y={130} width={126} height={128}>
        <rect x="205" y="151" width="86" height="86" rx="24" fill="#fff4ed" />
        <path d="M226 187c0-16 12-28 28-28s28 12 28 28v12c0 16-12 28-28 28s-28-12-28-28Z" fill="#303642" />
        <circle cx="243" cy="192" r="4" fill="#fff" />
        <circle cx="265" cy="192" r="4" fill="#fff" />
        <path d="M244 207c6 6 14 6 20 0" fill="none" stroke="#fff" strokeWidth="2.2" strokeLinecap="round" />
        <path d="M218 183v18M290 183v18M254 151v-12" stroke="#ef6b2f" strokeWidth="4" strokeLinecap="round" />
        <circle cx="254" cy="135" r="7" fill="#ef6b2f" />
      </FloatingCard>
      <FloatingCard x={470} y={50} width={180} height={118}>
        <text x="492" y="76" fontFamily="Arial, sans-serif" fontSize="11" fontWeight="700" fill="#9b8579" letterSpacing="1">SIGNAL / 01</text>
        {[0, 1, 2, 3, 4].map((bar) => <rect key={`bar-${bar}`} x={494 + bar * 27} y={124 - bar * 11} width="14" height={25 + bar * 11} rx="5" fill={bar === 4 ? '#ef6326' : '#f58b55'} />)}
        <path d="M488 139h140" stroke="#8a5a43" strokeWidth="1.4" />
      </FloatingCard>
      <FloatingCard x={655} y={286} width={120} height={116}>
        <circle cx="715" cy="336" r="28" fill="#fff2e9" />
        <path d="M707 312c8 4 15 9 20 17 5 10 5 22-2 32-4-8-10-13-18-17-7-4-16-6-25-5 4-13 12-22 25-27Z" fill="#ef6326" />
        <circle cx="715" cy="336" r="11" fill="#fff" />
      </FloatingCard>
      <rect x="430" y="494" width="72" height="45" rx="4" fill="#ef6326" />
      <rect x="384" y="536" width="164" height="20" rx="10" fill="#303642" />
    </svg>
  );
}

const deviceTiles = [
  {id: 'calculator', x: 351, y: 211, label: 'КАЛЬКУЛЯТОР', value: '123', accent: '#f7cdb8'},
  {id: 'chess', x: 582, y: 211, label: 'ШАХМАТЫ', value: '8×8', accent: '#ffc09a'},
  {id: 'voice', x: 351, y: 362, label: 'ГОЛОС', value: 'WAVE', accent: '#ffd7c3'},
  {id: 'robot', x: 582, y: 362, label: 'РОБОТ', value: 'R-01', accent: '#ffc8aa'},
];

export function MachinesIllustration({className}: IllustrationProps) {
  return (
    <svg className={className} style={visualStyle} viewBox="0 0 820 610" role="img" aria-label="Система сравнения разных умных машин">
      <SceneDefs />
      <path d="M151 494C87 360 128 200 256 113c126-85 337-80 454 17 110 91 118 239 24 349-102 119-510 126-583 15Z" fill="url(#peachBlob)" />
      <MainPanel title="SYSTEMS / COMPARISON" />
      <circle cx="520" cy="314" r="53" fill="#fff8f3" stroke="#efb18e" strokeWidth="1.8" />
      <text x="520" y="334" textAnchor="middle" fontFamily="Arial, sans-serif" fontSize="54" fontWeight="800" fill="#ef6326">?</text>
      {deviceTiles.map((tile) => (
        <g key={tile.id}>
          <path d={`M520 314L${tile.x} ${tile.y}`} stroke="#efb18e" strokeWidth="1.5" strokeDasharray="6 7" />
          <g filter="url(#smallShadow)">
            <rect x={tile.x - 76} y={tile.y - 55} width="152" height="110" rx="18" fill="#fffdfa" stroke="#efc5af" strokeWidth="1.3" />
            <rect x={tile.x - 52} y={tile.y - 33} width="104" height="55" rx="14" fill={tile.accent} opacity="0.55" />
            <text x={tile.x} y={tile.y + 2} textAnchor="middle" fontFamily="Arial, sans-serif" fontSize="20" fontWeight="800" fill="#6f4431">{tile.value}</text>
            <text x={tile.x} y={tile.y + 43} textAnchor="middle" fontFamily="Arial, sans-serif" fontSize="10" fontWeight="700" fill="#9e8274" letterSpacing="1.1">{tile.label}</text>
          </g>
        </g>
      ))}
      <FloatingCard x={435} y={442} width={170} height={92}>
        <rect x="461" y="465" width="118" height="42" rx="13" fill="#fff2ea" />
        <circle cx="490" cy="486" r="5" fill="#ef6326" />
        <circle cx="520" cy="486" r="5" fill="#f18855" />
        <circle cx="550" cy="486" r="5" fill="#f5b18c" />
        <path d="M484 512l-16 13 4-18" fill="#fffdfa" stroke="#efc5af" strokeWidth="1.3" />
      </FloatingCard>
    </svg>
  );
}

const speedBars = [
  {id: 'human', label: 'ЧЕЛОВЕК', value: '45.210 сек', width: 188, y: 278, fill: '#f6c9b2'},
  {id: 'machine', label: 'МАШИНА', value: '0.001 сек', width: 42, y: 374, fill: '#ef6326'},
];

export function SpeedIllustration({className}: IllustrationProps) {
  return (
    <svg className={className} style={visualStyle} viewBox="0 0 820 610" role="img" aria-label="Визуальное сравнение скорости человека и машины">
      <SceneDefs />
      <path d="M154 490C94 359 125 205 257 114c130-90 348-80 466 23 104 92 111 242 14 348-107 116-510 121-583 5Z" fill="url(#peachBlob)" />
      <MainPanel title="BENCHMARK / SPEED" />
      <text x="349" y="221" fontFamily="Arial, sans-serif" fontSize="13" fontWeight="700" fill="#a0877a" letterSpacing="1.4">987 × 654</text>
      <text x="349" y="257" fontFamily="Arial, sans-serif" fontSize="32" fontWeight="800" fill="#232323">645 498</text>
      {speedBars.map((bar) => (
        <g key={bar.id}>
          <text x="349" y={bar.y - 16} fontFamily="Arial, sans-serif" fontSize="11" fontWeight="700" fill="#8e7b71" letterSpacing="1.1">{bar.label}</text>
          <rect x="349" y={bar.y} width="238" height="18" rx="9" fill="#f5eee9" />
          <rect x="349" y={bar.y} width={bar.width} height="18" rx="9" fill={bar.fill} />
          <text x="608" y={bar.y + 14} fontFamily="Arial, sans-serif" fontSize="13" fontWeight="700" fill="#332d29">{bar.value}</text>
        </g>
      ))}
      <FloatingCard x={602} y={176} width={118} height={116}>
        <circle cx="661" cy="226" r="31" fill="#fff2ea" />
        <path d="M661 204v22l18 10" fill="none" stroke="#ef6326" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round" />
        <circle cx="661" cy="226" r="4" fill="#ef6326" />
        <text x="661" y="274" textAnchor="middle" fontFamily="Arial, sans-serif" fontSize="10" fontWeight="700" fill="#8e7b71" letterSpacing="1">TIME</text>
      </FloatingCard>
      <FloatingCard x={194} y={204} width={120} height={182}>
        <text x="216" y="232" fontFamily="Arial, sans-serif" fontSize="10" fontWeight="700" fill="#9b8579" letterSpacing="1">CALC / 01</text>
        <rect x="214" y="249" width="80" height="48" rx="10" fill="#313745" />
        <text x="284" y="280" textAnchor="end" fontFamily="Arial, sans-serif" fontSize="18" fontWeight="700" fill="#fff">0.001</text>
        {[0, 1, 2].map((row) => [0, 1, 2].map((column) => <rect key={`key-${row}-${column}`} x={218 + column * 26} y={313 + row * 22} width="18" height="14" rx="4" fill={row === 2 && column === 2 ? '#ef6326' : '#f7d7c6'} />))}
      </FloatingCard>
    </svg>
  );
}

const capabilityCards = [
  {id: 'memory', x: 345, y: 220, title: 'ПАМЯТЬ', value: '01'},
  {id: 'communication', x: 621, y: 220, title: 'ОБЩЕНИЕ', value: '02'},
  {id: 'planning', x: 345, y: 392, title: 'ПЛАН', value: '03'},
  {id: 'learning', x: 621, y: 392, title: 'ОБУЧЕНИЕ', value: '04'},
];

export function AbilitiesIllustration({className}: IllustrationProps) {
  return (
    <svg className={className} style={visualStyle} viewBox="0 0 820 610" role="img" aria-label="Карта ключевых интеллектуальных способностей">
      <SceneDefs />
      <path d="M150 492C91 362 122 201 252 113c126-85 340-82 457 17 108 91 118 241 20 349-103 114-506 126-579 13Z" fill="url(#peachBlob)" />
      <MainPanel title="INTELLIGENCE / MAP" />
      <circle cx="483" cy="307" r="64" fill="#fff7f2" stroke="#efb28f" strokeWidth="1.8" />
      <circle cx="483" cy="307" r="37" fill="#ffd7c1" />
      <path d="M466 307c-9-22 18-39 36-24 20-3 30 21 16 34 8 19-17 34-31 20-18 8-35-10-25-25-8-2-7-13 4-5Z" fill="#ef6326" opacity="0.9" />
      {capabilityCards.map((card) => (
        <g key={card.id}>
          <path d={`M483 307L${card.x} ${card.y}`} stroke="#e8a581" strokeWidth="1.5" strokeDasharray="6 7" />
          <g filter="url(#smallShadow)">
            <rect x={card.x - 78} y={card.y - 55} width="156" height="110" rx="18" fill="#fffdfa" stroke="#efc7b2" strokeWidth="1.3" />
            <circle cx={card.x} cy={card.y - 10} r="22" fill="#fff0e7" />
            <text x={card.x} y={card.y - 3} textAnchor="middle" fontFamily="Arial, sans-serif" fontSize="15" fontWeight="800" fill="#ef6326">{card.value}</text>
            <text x={card.x} y={card.y + 36} textAnchor="middle" fontFamily="Arial, sans-serif" fontSize="10" fontWeight="700" fill="#8e786d" letterSpacing="1">{card.title}</text>
          </g>
        </g>
      ))}
      <FloatingCard x={640} y={86} width={120} height={90}>
        <text x="661" y="113" fontFamily="Arial, sans-serif" fontSize="10" fontWeight="700" fill="#9b8579" letterSpacing="1">MODEL</text>
        <rect x="661" y="130" width="72" height="10" rx="5" fill="#f6d6c6" />
        <rect x="661" y="148" width="46" height="10" rx="5" fill="#ef6326" />
      </FloatingCard>
    </svg>
  );
}
