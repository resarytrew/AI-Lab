type IllustrationProps = {
  className?: string;
};

function Student({x = 74, y = 190, scale = 1}: {x?: number; y?: number; scale?: number}) {
  return (
    <g transform={`translate(${x} ${y}) scale(${scale})`}>
      <ellipse cx="128" cy="315" rx="118" ry="18" fill="rgba(118,66,42,.12)" />
      <path d="M66 148c10-43 41-70 82-67 42 4 69 36 68 79l-8 155H48l18-167Z" fill="#fffdfb" stroke="#714128" strokeWidth="3" />
      <path d="M85 126c17-17 38-26 63-26 27 0 51 12 68 33l-18 21c-13-14-30-22-50-22-19 0-36 7-50 20Z" fill="#313745" />
      <circle cx="149" cy="73" r="56" fill="#ffd9c1" stroke="#714128" strokeWidth="3" />
      <path d="M95 63c7-42 37-66 75-61 30 4 53 24 59 52-35-10-77-6-134 9Z" fill="#5f351f" />
      <path d="M199 125c19 25 25 56 16 89" fill="none" stroke="#714128" strokeWidth="3" strokeLinecap="round" />
      <rect x="169" y="168" width="64" height="95" rx="9" fill="#343842" stroke="#1f2127" strokeWidth="3" transform="rotate(-10 201 215)" />
      <circle cx="137" cy="74" r="4" fill="#5a3424" />
      <circle cx="170" cy="73" r="4" fill="#5a3424" />
      <path d="M143 96c9 8 18 8 27 0" fill="none" stroke="#5a3424" strokeWidth="2.5" strokeLinecap="round" />
    </g>
  );
}

function BrowserFrame({children}: {children: React.ReactNode}) {
  return (
    <g>
      <rect x="321" y="94" width="444" height="357" rx="30" fill="#fffdfb" stroke="#714128" strokeWidth="4" />
      <rect x="339" y="115" width="408" height="315" rx="20" fill="#ffffff" stroke="#efc1a8" strokeWidth="2" />
      <circle cx="363" cy="139" r="7" fill="#ef6f32" />
      <circle cx="385" cy="139" r="7" fill="#f5a47b" />
      <circle cx="407" cy="139" r="7" fill="#e8d5ca" />
      {children}
      <rect x="486" y="452" width="56" height="37" fill="#ee6b2c" />
      <rect x="444" y="487" width="142" height="21" rx="10.5" fill="#313745" />
    </g>
  );
}

export function IntroIllustration({className}: IllustrationProps) {
  return (
    <svg className={className} viewBox="0 0 820 600" role="img" aria-label="Исследователь у интерактивного экрана AI Lab">
      <path d="M123 461C68 346 113 183 246 104c134-79 355-50 452 62 86 100 72 243-31 330-102 87-474 80-544-35Z" fill="#f8d3bd" opacity=".83" />
      <circle cx="690" cy="110" r="32" fill="#fff4ee" />
      <path d="M715 76l33 8-8 35-33-8Z" fill="#f06c2f" stroke="#714128" strokeWidth="2.5" />
      <Student />
      <BrowserFrame>
        <g stroke="#714128" strokeWidth="2.2">
          {[[389,248],[389,310],[389,370]].map(([x,y],i)=><circle key={`a${i}`} cx={x} cy={y} r="13" fill="#ffd4bb" />)}
          {[[485,221],[485,286],[485,352]].map(([x,y],i)=><circle key={`b${i}`} cx={x} cy={y} r="18" fill="#f58246" />)}
          {[[585,262],[585,335]].map(([x,y],i)=><circle key={`c${i}`} cx={x} cy={y} r="16" fill={i ? '#ffb68a' : '#ef641f'} />)}
          {[248,310,370].flatMap((y1)=>[221,286,352].map(y2=><line key={`${y1}-${y2}`} x1="402" y1={y1} x2="467" y2={y2} />))}
          {[221,286,352].flatMap((y1)=>[262,335].map(y2=><line key={`${y1}-${y2}-r`} x1="503" y1={y1} x2="569" y2={y2} />))}
        </g>
        <rect x="626" y="210" width="84" height="82" rx="13" fill="#fff1e8" />
        <rect x="640" y="225" width="53" height="9" rx="4.5" fill="#ee6b2c" />
        <rect x="640" y="246" width="37" height="8" rx="4" fill="#f3a278" />
        <rect x="626" y="309" width="84" height="72" rx="13" fill="#fff1e8" />
        <path d="M641 360c14-32 29-15 42-35 7-11 12-7 18-17" fill="none" stroke="#ee6b2c" strokeWidth="5" strokeLinecap="round" />
      </BrowserFrame>
      <path d="M72 540h690" stroke="#714128" strokeWidth="3" strokeLinecap="round" />
    </svg>
  );
}

function MiniDevice({kind, x, y, label}: {kind: 'calc'|'chess'|'vacuum'|'voice'|'chat'; x: number; y: number; label: string}) {
  return (
    <g transform={`translate(${x} ${y})`}>
      <rect x="-64" y="-54" width="128" height="108" rx="18" fill="#fff" stroke="#efb08c" strokeWidth="2" strokeDasharray="7 6" />
      {kind === 'calc' && <><rect x="-22" y="-37" width="44" height="68" rx="6" fill="#fff" stroke="#714128" strokeWidth="3" /><rect x="-15" y="-27" width="30" height="12" rx="2" fill="#313745" />{[-10,0,10].flatMap(dx=>[2,12,22].map(dy=><rect key={`${dx}-${dy}`} x={dx-3} y={dy-3} width="6" height="6" rx="1" fill="#e4b499" />))}</>}
      {kind === 'chess' && <><path d="M-20 26h43l-6-10-5-27-17-19-14 9 8 10-14 19Z" fill="#ef6f32" stroke="#714128" strokeWidth="3" /><rect x="-25" y="26" width="50" height="8" rx="3" fill="#ffd0b4" stroke="#714128" strokeWidth="2" /></>}
      {kind === 'vacuum' && <><ellipse cx="0" cy="5" rx="37" ry="26" fill="#fff" stroke="#714128" strokeWidth="3" /><ellipse cx="0" cy="-3" rx="22" ry="8" fill="#ffe0cd" stroke="#714128" strokeWidth="2" /><circle cx="0" cy="-5" r="4" fill="#ee6b2c" /></>}
      {kind === 'voice' && <><rect x="-27" y="-35" width="54" height="67" rx="20" fill="#fff" stroke="#714128" strokeWidth="3" /><ellipse cx="0" cy="-28" rx="22" ry="7" fill="#ffd0b4" stroke="#714128" strokeWidth="2" /><path d="M-13 0v13M-5-7v28M4-2v19M12-11v32" stroke="#ee6b2c" strokeWidth="3" strokeLinecap="round" /></>}
      {kind === 'chat' && <><path d="M-39-25h78a12 12 0 0 1 12 12v31a12 12 0 0 1-12 12H-4l-15 13 3-13h-23a12 12 0 0 1-12-12v-31a12 12 0 0 1 12-12Z" fill="#fff" stroke="#714128" strokeWidth="3" />{[-14,0,14].map(dx=><circle key={dx} cx={dx} cy="2" r="5" fill="#ee6b2c" />)}</>}
      <text x="0" y="72" textAnchor="middle" fontFamily="Arial, sans-serif" fontSize="14" fontWeight="700" fill="#302722">{label}</text>
    </g>
  );
}

export function MachinesIllustration({className}: IllustrationProps) {
  return (
    <svg className={className} viewBox="0 0 820 600" role="img" aria-label="Карта умных устройств">
      <path d="M132 466C70 339 124 176 258 99c130-75 337-45 430 63 84 97 69 237-30 323-98 84-456 83-526-19Z" fill="#f8d3bd" opacity=".82" />
      <Student x={52} y={228} scale={.88} />
      <BrowserFrame>
        <circle cx="545" cy="278" r="49" fill="#fff7f2" stroke="#efb08c" strokeWidth="2" />
        <text x="545" y="298" textAnchor="middle" fontFamily="Arial, sans-serif" fontSize="56" fontWeight="800" fill="#ee6b2c">?</text>
        <MiniDevice kind="calc" x={414} y={213} label="123" />
        <MiniDevice kind="chess" x={665} y={210} label="8×8" />
        <MiniDevice kind="voice" x={414} y={366} label="WAVE" />
        <MiniDevice kind="vacuum" x={665} y={363} label="R-01" />
        <MiniDevice kind="chat" x={545} y={406} label="TEXT" />
        {[[414,213],[665,210],[414,366],[665,363],[545,406]].map(([x,y],i)=><path key={i} d={`M545 278L${x} ${y}`} stroke="#efad88" strokeWidth="2" strokeDasharray="6 7" />)}
      </BrowserFrame>
      <path d="M72 540h690" stroke="#714128" strokeWidth="3" strokeLinecap="round" />
    </svg>
  );
}

export function SpeedIllustration({className}: IllustrationProps) {
  const keys = ['7','8','9','÷','4','5','6','×','1','2','3','−','0',',','','='];
  return (
    <svg className={className} viewBox="0 0 820 600" role="img" aria-label="Сравнение скорости человека и калькулятора">
      <path d="M136 466C81 350 122 186 252 106c130-80 344-51 440 59 86 98 73 239-29 329-100 87-458 79-527-28Z" fill="#f8d3bd" opacity=".82" />
      <Student x={50} y={222} scale={.88} />
      <rect x="330" y="91" width="318" height="420" rx="29" fill="#fffdfb" stroke="#714128" strokeWidth="4" />
      <rect x="352" y="118" width="274" height="104" rx="15" fill="#fff1e8" stroke="#efb08c" strokeWidth="2" />
      <text x="489" y="168" textAnchor="middle" fontFamily="Arial, sans-serif" fontSize="42" fontWeight="700" fill="#202020">0.001 сек</text>
      <text x="489" y="198" textAnchor="middle" fontFamily="Arial, sans-serif" fontSize="16" fill="#5e554f">калькулятор</text>
      {keys.map((t,i)=>{const r=Math.floor(i/4),c=i%4;return <g key={`${t}-${i}`}><rect x={366+c*63} y={246+r*62} width="49" height="48" rx="10" fill={c===3?'#ee6b2c':'#fff6f1'} stroke="#efc0a7" /><text x={390.5+c*63} y={277+r*62} textAnchor="middle" fontFamily="Arial, sans-serif" fontSize="22" fill={c===3?'#fff':'#202020'}>{t}</text></g>})}
      <rect x="663" y="205" width="130" height="222" rx="20" fill="#fff" stroke="#714128" strokeWidth="3" />
      <text x="681" y="246" fontFamily="Arial, sans-serif" fontSize="14" fontWeight="700">Человек</text>
      <text x="681" y="272" fontFamily="Arial, sans-serif" fontSize="18">45.210 сек</text>
      <rect x="681" y="286" width="80" height="8" rx="4" fill="#f5b896" />
      <path d="M680 315h95" stroke="#e6c4b2" strokeDasharray="5 5" />
      <text x="681" y="350" fontFamily="Arial, sans-serif" fontSize="14" fontWeight="700">Машина</text>
      <text x="681" y="376" fontFamily="Arial, sans-serif" fontSize="18">0.001 сек</text>
      <rect x="681" y="390" width="32" height="8" rx="4" fill="#ee6b2c" />
      <path d="M72 540h690" stroke="#714128" strokeWidth="3" strokeLinecap="round" />
    </svg>
  );
}

export function AbilitiesIllustration({className}: IllustrationProps) {
  const nodes = [
    ['память', 375, 195],
    ['общение', 627, 195],
    ['планирование', 375, 405],
    ['обучение', 627, 405],
  ] as const;
  return (
    <svg className={className} viewBox="0 0 820 600" role="img" aria-label="Карта способностей интеллекта">
      <path d="M126 467C68 347 117 181 249 103c133-78 349-48 445 65 85 101 68 242-32 329-99 86-467 79-536-30Z" fill="#f8d3bd" opacity=".82" />
      <Student x={562} y={247} scale={.7} />
      <rect x="252" y="84" width="430" height="410" rx="27" fill="#fffdfb" stroke="#714128" strokeWidth="4" />
      <rect x="439" y="67" width="72" height="29" rx="8" fill="#ee6b2c" stroke="#714128" strokeWidth="2" />
      <circle cx="503" cy="302" r="58" fill="#ffe1cf" stroke="#efaa82" strokeWidth="2" />
      <path d="M478 298c-9-30 31-45 44-18 18-1 28 20 16 33 5 18-19 33-34 20-16 11-37-5-31-22-12-7-5-21 5-13Z" fill="#ffba92" stroke="#b9683c" strokeWidth="2" />
      {nodes.map(([label,x,y])=><g key={label}><path d={`M503 302L${x} ${y}`} stroke="#efaa82" strokeWidth="2" strokeDasharray="6 7" /><rect x={x-67} y={y-53} width="134" height="106" rx="17" fill="#fff" stroke="#efaa82" strokeWidth="2" /><circle cx={x} cy={y-10} r="21" fill="#fff1e9" stroke="#ee6b2c" strokeWidth="2" /><text x={x} y={y+34} textAnchor="middle" fontFamily="Arial, sans-serif" fontSize="14" fontWeight="700" fill="#302722">{label}</text></g>)}
      <path d="M72 540h690" stroke="#714128" strokeWidth="3" strokeLinecap="round" />
    </svg>
  );
}
