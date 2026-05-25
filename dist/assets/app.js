const {
  useEffect,
  useMemo,
  useRef,
  useState
} = React;
const TUNING = [{
  label: "6弦",
  note: "E",
  pc: 4
}, {
  label: "5弦",
  note: "A",
  pc: 9
}, {
  label: "4弦",
  note: "D",
  pc: 2
}, {
  label: "3弦",
  note: "G",
  pc: 7
}, {
  label: "2弦",
  note: "B",
  pc: 11
}, {
  label: "1弦",
  note: "e",
  pc: 4
}];
const SHARP_NAMES = ["C", "C#", "D", "D#", "E", "F", "F#", "G", "G#", "A", "A#", "B"];
const FLAT_NAMES = ["C", "Db", "D", "Eb", "E", "F", "Gb", "G", "Ab", "A", "Bb", "B"];
const NOTE_ALIASES = {
  C: 0,
  "B#": 0,
  "C#": 1,
  DB: 1,
  D: 2,
  "D#": 3,
  EB: 3,
  E: 4,
  FB: 4,
  "E#": 5,
  F: 5,
  "F#": 6,
  GB: 6,
  G: 7,
  "G#": 8,
  AB: 8,
  A: 9,
  "A#": 10,
  BB: 10,
  B: 11,
  CB: 11
};
const QUALITIES = {
  major: {
    label: "大三和弦",
    symbol: "",
    intervals: [0, 4, 7]
  },
  minor: {
    label: "小三和弦",
    symbol: "m",
    intervals: [0, 3, 7]
  },
  dominant7: {
    label: "属七和弦",
    symbol: "7",
    intervals: [0, 4, 7, 10]
  },
  major7: {
    label: "大七和弦",
    symbol: "maj7",
    intervals: [0, 4, 7, 11]
  },
  minor7: {
    label: "小七和弦",
    symbol: "m7",
    intervals: [0, 3, 7, 10]
  },
  dim: {
    label: "减三和弦",
    symbol: "dim",
    intervals: [0, 3, 6]
  },
  dim7: {
    label: "减七和弦",
    symbol: "dim7",
    intervals: [0, 3, 6, 9]
  },
  m7b5: {
    label: "半减七和弦",
    symbol: "m7b5",
    intervals: [0, 3, 6, 10]
  },
  aug: {
    label: "增三和弦",
    symbol: "aug",
    intervals: [0, 4, 8]
  },
  sus2: {
    label: "挂二和弦",
    symbol: "sus2",
    intervals: [0, 2, 7]
  },
  sus4: {
    label: "挂四和弦",
    symbol: "sus4",
    intervals: [0, 5, 7]
  },
  add9: {
    label: "加九和弦",
    symbol: "add9",
    intervals: [0, 2, 4, 7]
  },
  six: {
    label: "六和弦",
    symbol: "6",
    intervals: [0, 4, 7, 9]
  },
  minor6: {
    label: "小六和弦",
    symbol: "m6",
    intervals: [0, 3, 7, 9]
  },
  nine: {
    label: "九和弦",
    symbol: "9",
    intervals: [0, 2, 4, 7, 10]
  },
  minor9: {
    label: "小九和弦",
    symbol: "m9",
    intervals: [0, 2, 3, 7, 10]
  },
  power: {
    label: "五和弦",
    symbol: "5",
    intervals: [0, 7]
  }
};
const QUALITY_ORDER = ["major", "minor", "dominant7", "major7", "minor7", "six", "minor6", "nine", "minor9", "add9", "sus2", "sus4", "dim", "dim7", "m7b5", "aug", "power"];
const TEMPLATE_SHAPES = {
  major: [{
    base: 0,
    form: "C 型",
    frets: [null, 3, 2, 0, 1, 0]
  }, {
    base: 9,
    form: "A 型",
    frets: [null, 0, 2, 2, 2, 0]
  }, {
    base: 7,
    form: "G 型",
    frets: [3, 2, 0, 0, 0, 3]
  }, {
    base: 4,
    form: "E 型",
    frets: [0, 2, 2, 1, 0, 0]
  }, {
    base: 2,
    form: "D 型",
    frets: [null, null, 0, 2, 3, 2]
  }],
  minor: [{
    base: 9,
    form: "A 小型",
    frets: [null, 0, 2, 2, 1, 0]
  }, {
    base: 4,
    form: "E 小型",
    frets: [0, 2, 2, 0, 0, 0]
  }, {
    base: 2,
    form: "D 小型",
    frets: [null, null, 0, 2, 3, 1]
  }, {
    base: 0,
    form: "C 小型",
    frets: [null, 3, 5, 5, 4, 3]
  }, {
    base: 7,
    form: "G 小型",
    frets: [3, 5, 5, 3, 3, 3]
  }],
  dominant7: [{
    base: 0,
    form: "C7 型",
    frets: [null, 3, 2, 3, 1, 0]
  }, {
    base: 9,
    form: "A7 型",
    frets: [null, 0, 2, 0, 2, 0]
  }, {
    base: 7,
    form: "G7 型",
    frets: [3, 2, 0, 0, 0, 1]
  }, {
    base: 4,
    form: "E7 型",
    frets: [0, 2, 0, 1, 0, 0]
  }, {
    base: 2,
    form: "D7 型",
    frets: [null, null, 0, 2, 1, 2]
  }],
  major7: [{
    base: 0,
    form: "Cmaj7 型",
    frets: [null, 3, 2, 0, 0, 0]
  }, {
    base: 9,
    form: "Amaj7 型",
    frets: [null, 0, 2, 1, 2, 0]
  }, {
    base: 7,
    form: "Gmaj7 型",
    frets: [3, 2, 0, 0, 0, 2]
  }, {
    base: 4,
    form: "Emaj7 型",
    frets: [0, 2, 1, 1, 0, 0]
  }, {
    base: 2,
    form: "Dmaj7 型",
    frets: [null, null, 0, 2, 2, 2]
  }],
  minor7: [{
    base: 9,
    form: "Am7 型",
    frets: [null, 0, 2, 0, 1, 0]
  }, {
    base: 4,
    form: "Em7 型",
    frets: [0, 2, 0, 0, 0, 0]
  }, {
    base: 2,
    form: "Dm7 型",
    frets: [null, null, 0, 2, 1, 1]
  }, {
    base: 0,
    form: "Cm7 型",
    frets: [null, 3, 5, 3, 4, 3]
  }, {
    base: 7,
    form: "Gm7 型",
    frets: [3, 5, 3, 3, 3, 3]
  }],
  sus2: [{
    base: 9,
    form: "Asus2 型",
    frets: [null, 0, 2, 2, 0, 0]
  }, {
    base: 2,
    form: "Dsus2 型",
    frets: [null, null, 0, 2, 3, 0]
  }, {
    base: 4,
    form: "Esus2 型",
    frets: [0, 2, 4, 4, 0, 0]
  }],
  sus4: [{
    base: 9,
    form: "Asus4 型",
    frets: [null, 0, 2, 2, 3, 0]
  }, {
    base: 2,
    form: "Dsus4 型",
    frets: [null, null, 0, 2, 3, 3]
  }, {
    base: 4,
    form: "Esus4 型",
    frets: [0, 2, 2, 2, 0, 0]
  }],
  add9: [{
    base: 0,
    form: "Cadd9 型",
    frets: [null, 3, 2, 0, 3, 0]
  }, {
    base: 9,
    form: "Aadd9 型",
    frets: [null, 0, 2, 4, 2, 0]
  }, {
    base: 4,
    form: "Eadd9 型",
    frets: [0, 2, 4, 1, 0, 0]
  }],
  six: [{
    base: 0,
    form: "C6 型",
    frets: [null, 3, 2, 2, 1, 0]
  }, {
    base: 9,
    form: "A6 型",
    frets: [null, 0, 2, 2, 2, 2]
  }, {
    base: 4,
    form: "E6 型",
    frets: [0, 2, 2, 1, 2, 0]
  }],
  minor6: [{
    base: 9,
    form: "Am6 型",
    frets: [null, 0, 2, 2, 1, 2]
  }, {
    base: 4,
    form: "Em6 型",
    frets: [0, 2, 2, 0, 2, 0]
  }, {
    base: 2,
    form: "Dm6 型",
    frets: [null, null, 0, 2, 0, 1]
  }],
  dim: [{
    base: 0,
    form: "Cdim 型",
    frets: [null, 3, 4, 2, 4, null]
  }, {
    base: 2,
    form: "Ddim 型",
    frets: [null, null, 0, 1, 0, 1]
  }, {
    base: 6,
    form: "F#dim 型",
    frets: [2, 3, 4, 2, 4, 2]
  }],
  dim7: [{
    base: 0,
    form: "Cdim7 型",
    frets: [null, 3, 4, 2, 4, 2]
  }, {
    base: 2,
    form: "Ddim7 型",
    frets: [null, null, 0, 1, 0, 1]
  }, {
    base: 6,
    form: "F#dim7 型",
    frets: [2, 3, 4, 2, 4, 2]
  }],
  m7b5: [{
    base: 1,
    form: "Bm7b5 型",
    frets: [null, 2, 3, 2, 3, null]
  }, {
    base: 4,
    form: "Em7b5 型",
    frets: [null, null, 2, 3, 3, 3]
  }, {
    base: 9,
    form: "Am7b5 型",
    frets: [5, null, 5, 5, 4, null]
  }],
  aug: [{
    base: 0,
    form: "Caug 型",
    frets: [null, 3, 2, 1, 1, 0]
  }, {
    base: 4,
    form: "Eaug 型",
    frets: [0, 3, 2, 1, 1, 0]
  }, {
    base: 7,
    form: "Gaug 型",
    frets: [3, 2, 1, 0, 0, 3]
  }],
  nine: [{
    base: 0,
    form: "C9 型",
    frets: [null, 3, 2, 3, 3, 3]
  }, {
    base: 4,
    form: "E9 型",
    frets: [0, 2, 0, 1, 0, 2]
  }, {
    base: 9,
    form: "A9 型",
    frets: [null, 0, 2, 4, 2, 3]
  }],
  minor9: [{
    base: 9,
    form: "Am9 型",
    frets: [null, 0, 5, 5, 5, 7]
  }, {
    base: 4,
    form: "Em9 型",
    frets: [0, 2, 0, 0, 0, 2]
  }, {
    base: 2,
    form: "Dm9 型",
    frets: [null, null, 0, 2, 1, 0]
  }],
  power: [{
    base: 4,
    form: "E5 型",
    frets: [0, 2, 2, null, null, null]
  }, {
    base: 9,
    form: "A5 型",
    frets: [null, 0, 2, 2, null, null]
  }, {
    base: 2,
    form: "D5 型",
    frets: [null, null, 0, 2, 3, null]
  }]
};
const EXAMPLE_CHORDS = ["C", "Am", "G7", "Fmaj7", "Bb", "Dadd9", "Bm7b5", "E9"];
const FRET_EXAMPLES = [{
  label: "C",
  frets: ["x", "3", "2", "0", "1", "0"]
}, {
  label: "Em",
  frets: ["0", "2", "2", "0", "0", "0"]
}, {
  label: "G",
  frets: ["3", "2", "0", "0", "0", "3"]
}, {
  label: "Am7",
  frets: ["x", "0", "2", "0", "1", "0"]
}, {
  label: "F",
  frets: ["1", "3", "3", "2", "1", "1"]
}];
const CHART_STORAGE_KEY = "guitar-chord-chart-sequence-v1";
function mod(value, size = 12) {
  return (value % size + size) % size;
}
function noteName(pc, preferFlats = false) {
  return (preferFlats ? FLAT_NAMES : SHARP_NAMES)[mod(pc)];
}
function compactShape(frets) {
  return frets.map(fret => fret === null ? "x" : String(fret)).join(" ");
}
function parseChordName(value) {
  const raw = value.trim().replace(/\s+/g, "");
  if (!raw) {
    return {
      ok: false,
      message: "请输入一个和弦名，例如 C、Am、F#7 或 Bbmaj7。"
    };
  }
  const match = raw.match(/^([A-Ga-g])([#b♭]?)(.*)$/);
  if (!match) {
    return {
      ok: false,
      message: "和弦名需要以 A-G 开头，可带 # 或 b。"
    };
  }
  const letter = match[1].toUpperCase();
  const accidental = match[2] === "♭" ? "b" : match[2];
  const rootKey = `${letter}${accidental}`.toUpperCase();
  const root = NOTE_ALIASES[rootKey];
  if (root === undefined) {
    return {
      ok: false,
      message: "暂时无法识别这个根音。"
    };
  }
  const qualityText = match[3].replace("△", "maj").replace("Δ", "maj");
  const lower = qualityText.toLowerCase();
  const key = normalizeQuality(lower, qualityText);
  if (!key) {
    return {
      ok: false,
      message: `暂不支持 “${qualityText || "(空)"}” 这个和弦后缀。可试 C、Cm、C7、Cmaj7、Csus4、Cadd9。`
    };
  }
  const preferFlats = accidental.toLowerCase() === "b";
  const definition = QUALITIES[key];
  return {
    ok: true,
    root,
    rootLabel: noteName(root, preferFlats),
    preferFlats,
    qualityKey: key,
    definition,
    displayName: `${noteName(root, preferFlats)}${definition.symbol}`
  };
}
function normalizeQuality(lower, original) {
  if (lower === "" || lower === "maj" || original === "M") return "major";
  if (["m", "min", "minor", "-"].includes(lower)) return "minor";
  if (["7", "dom7"].includes(lower)) return "dominant7";
  if (["maj7", "ma7", "major7"].includes(lower) || original === "M7") return "major7";
  if (["m7", "min7", "minor7", "-7"].includes(lower)) return "minor7";
  if (["dim", "o"].includes(lower)) return "dim";
  if (["dim7", "o7"].includes(lower)) return "dim7";
  if (["m7b5", "ø", "ø7", "half-dim", "halfdim"].includes(lower)) return "m7b5";
  if (["aug", "+", "+5"].includes(lower)) return "aug";
  if (lower === "sus2") return "sus2";
  if (["sus", "sus4"].includes(lower)) return "sus4";
  if (["add9", "add2"].includes(lower)) return "add9";
  if (lower === "6") return "six";
  if (["m6", "min6", "minor6"].includes(lower)) return "minor6";
  if (lower === "9") return "nine";
  if (["m9", "min9", "minor9"].includes(lower)) return "minor9";
  if (lower === "5") return "power";
  return null;
}
function pitchClassesForChord(root, intervals) {
  return intervals.map(interval => mod(root + interval));
}
function templateVoicings(parsed) {
  const templates = TEMPLATE_SHAPES[parsed.qualityKey] || [];
  return templates.map(template => {
    const shift = mod(parsed.root - template.base);
    const frets = template.frets.map(fret => fret === null ? null : fret + shift);
    return {
      frets,
      form: template.form,
      source: "template",
      name: shapePositionName(frets)
    };
  }).filter(shape => {
    const played = shape.frets.filter(fret => fret !== null);
    const maxFret = Math.max(...played);
    const minFret = Math.min(...played.filter(fret => fret > 0));
    return maxFret <= 15 && (Number.isFinite(minFret) ? maxFret - minFret <= 5 : true);
  });
}
function generatedVoicings(parsed) {
  const expected = new Set(pitchClassesForChord(parsed.root, parsed.definition.intervals));
  const windows = [0, 1, 2, 3, 4, 5, 7, 9, 12];
  const results = [];
  windows.forEach(start => {
    const low = start === 0 ? 0 : start;
    const high = start === 0 ? 4 : start + 4;
    const optionsByString = TUNING.map(string => {
      const options = [null];
      for (let fret = low; fret <= high; fret += 1) {
        if (expected.has(mod(string.pc + fret))) {
          options.push(fret);
        }
      }
      return options;
    });
    walkOptions(optionsByString, 0, [], frets => {
      const played = frets.filter(fret => fret !== null);
      if (played.length < (parsed.qualityKey === "power" ? 2 : 3)) return;
      const pcs = new Set(frets.map((fret, index) => fret === null ? null : mod(TUNING[index].pc + fret)).filter(pc => pc !== null));
      const covered = [...expected].filter(pc => pcs.has(pc)).length;
      if (!pcs.has(parsed.root)) return;
      if (covered < Math.min(3, expected.size)) return;
      const positive = played.filter(fret => fret > 0);
      const maxFret = Math.max(...played);
      const minFret = Math.min(...positive);
      const span = positive.length ? maxFret - minFret : 0;
      if (span > 4 || maxFret > 15) return;
      const bassIndex = frets.findIndex(fret => fret !== null);
      const bassPc = mod(TUNING[bassIndex].pc + frets[bassIndex]);
      const openCount = played.filter(fret => fret === 0).length;
      const mutedCount = frets.filter(fret => fret === null).length;
      const score = covered * 16 + played.length * 3 + (bassPc === parsed.root ? 12 : 0) + openCount * 2 - mutedCount * 1.2 - span * 2 - maxFret * 0.45;
      results.push({
        frets,
        form: "生成把位",
        source: "generated",
        name: shapePositionName(frets),
        score
      });
    });
  });
  return results.sort((a, b) => b.score - a.score).slice(0, 60);
}
function walkOptions(optionsByString, index, current, onDone) {
  if (index === optionsByString.length) {
    onDone(current);
    return;
  }
  optionsByString[index].forEach(option => {
    walkOptions(optionsByString, index + 1, [...current, option], onDone);
  });
}
function getVoicings(parsed) {
  const combined = [...templateVoicings(parsed), ...generatedVoicings(parsed)];
  const seen = new Set();
  const unique = combined.filter(shape => {
    const key = compactShape(shape.frets);
    if (seen.has(key)) return false;
    seen.add(key);
    return true;
  });
  const openShapes = unique.filter(shape => shapeStats(shape.frets).isOpen).sort((a, b) => shapeRank(a) - shapeRank(b)).slice(0, 1);
  const movableShapes = unique.filter(shape => !shapeStats(shape.frets).isOpen).sort(compareMovableShapes);
  const spread = [];
  const countByStart = new Map();
  movableShapes.forEach(shape => {
    if (spread.length >= 15) return;
    const start = shapeStats(shape.frets).startFret;
    const count = countByStart.get(start) || 0;
    if (count >= 2) return;
    spread.push(shape);
    countByStart.set(start, count + 1);
  });
  movableShapes.forEach(shape => {
    if (spread.length >= 15 || spread.includes(shape)) return;
    spread.push(shape);
  });
  return [...openShapes, ...spread].slice(0, 16);
}
function shapeRank(shape) {
  const {
    maxFret,
    openCount,
    span,
    mutedCount
  } = shapeStats(shape.frets);
  const templateBias = shape.source === "template" ? -8 : 0;
  return templateBias + maxFret * 1.1 + span * 2 - openCount * 1.7 + mutedCount;
}
function compareMovableShapes(a, b) {
  const aStats = shapeStats(a.frets);
  const bStats = shapeStats(b.frets);
  const templateBias = (a.source === "template" ? -1 : 0) - (b.source === "template" ? -1 : 0);
  return aStats.startFret - bStats.startFret || templateBias || aStats.span - bStats.span || b.frets.filter(fret => fret !== null).length - a.frets.filter(fret => fret !== null).length || (b.score || 0) - (a.score || 0);
}
function shapeStats(frets) {
  const played = frets.filter(fret => fret !== null);
  const positive = played.filter(fret => fret > 0);
  const maxFret = played.length ? Math.max(...played) : 0;
  const minPositive = positive.length ? Math.min(...positive) : 0;
  return {
    isOpen: played.some(fret => fret === 0),
    startFret: minPositive || 0,
    maxFret,
    span: positive.length ? maxFret - minPositive : 0,
    openCount: played.filter(fret => fret === 0).length,
    mutedCount: frets.filter(fret => fret === null).length
  };
}
function shapePositionName(frets) {
  const played = frets.filter(fret => fret !== null);
  const positive = played.filter(fret => fret > 0);
  if (played.some(fret => fret === 0)) {
    return "开放把位";
  }
  const start = Math.min(...positive);
  return `第 ${start} 把位`;
}
function parseFret(value) {
  const normalized = value.trim().toLowerCase();
  if (!normalized || ["x", "m", "-"].includes(normalized)) return null;
  const parsed = Number.parseInt(normalized, 10);
  if (!Number.isFinite(parsed) || parsed < 0 || parsed > 24) return undefined;
  return parsed;
}
function identifyChord(fretValues) {
  const frets = fretValues.map(parseFret);
  if (frets.some(fret => fret === undefined)) {
    return {
      error: "品位请输入 0-24 的数字，或用 x 表示闷音。",
      notes: [],
      results: []
    };
  }
  const sounding = frets.map((fret, index) => fret === null ? null : {
    string: TUNING[index],
    fret,
    pc: mod(TUNING[index].pc + fret)
  }).filter(Boolean);
  if (sounding.length < 2) {
    return {
      error: "至少输入两根有声弦，识别结果会更可靠。",
      notes: sounding,
      results: []
    };
  }
  const uniquePcs = [...new Set(sounding.map(note => note.pc))];
  const bassPc = sounding[0].pc;
  const results = [];
  for (let root = 0; root < 12; root += 1) {
    QUALITY_ORDER.forEach(qualityKey => {
      const definition = QUALITIES[qualityKey];
      const expected = new Set(pitchClassesForChord(root, definition.intervals));
      const matched = uniquePcs.filter(pc => expected.has(pc));
      const extra = uniquePcs.filter(pc => !expected.has(pc));
      const missing = [...expected].filter(pc => !uniquePcs.includes(pc));
      const hasThird = expected.has(mod(root + 3)) || expected.has(mod(root + 4)) || ["sus2", "sus4", "power"].includes(qualityKey);
      if (matched.length < Math.min(2, expected.size)) return;
      if (extra.length > 1) return;
      if (missing.length > 2) return;
      let score = matched.length / expected.size * 54 + (uniquePcs.length - extra.length) / uniquePcs.length * 30 + (uniquePcs.includes(root) ? 8 : -10) + (bassPc === root ? 8 : 0) - missing.length * 4 - extra.length * 8 + (hasThird ? 3 : -5);
      if (qualityKey === "power" && uniquePcs.length > 2) score -= 10;
      if (definition.intervals.length > uniquePcs.length + 2) score -= 8;
      if (score < 42) return;
      const preferFlats = [1, 3, 6, 8, 10].includes(root) && uniquePcs.some(pc => FLAT_NAMES[pc].includes("b"));
      const rootLabel = noteName(root, preferFlats);
      const slash = bassPc !== root ? `/${noteName(bassPc, preferFlats)}` : "";
      results.push({
        key: `${root}-${qualityKey}-${slash}`,
        name: `${rootLabel}${definition.symbol}${slash}`,
        label: definition.label,
        confidence: Math.max(0, Math.min(99, Math.round(score))),
        missing: missing.map(pc => noteName(pc, preferFlats)),
        extra: extra.map(pc => noteName(pc, preferFlats)),
        matched: matched.map(pc => noteName(pc, preferFlats))
      });
    });
  }
  return {
    error: null,
    notes: sounding,
    results: dedupeResults(results).sort((a, b) => b.confidence - a.confidence).slice(0, 8)
  };
}
function dedupeResults(results) {
  const seen = new Set();
  return results.filter(result => {
    if (seen.has(result.name)) return false;
    seen.add(result.name);
    return true;
  });
}
function createId(prefix = "id") {
  return `${prefix}-${Date.now()}-${Math.random().toString(16).slice(2)}`;
}
function normalizeChartItem(item) {
  const frets = Array.isArray(item.frets) ? item.frets.map(fret => {
    if (fret === null) return null;
    const parsed = Number.parseInt(fret, 10);
    return Number.isFinite(parsed) ? parsed : null;
  }).slice(0, 6) : ["x", "x", "x", "x", "x", "x"].map(parseFret);
  while (frets.length < 6) frets.push(null);
  const name = item.name || "未知和弦";
  return {
    id: item.id || `${Date.now()}-${Math.random().toString(16).slice(2)}`,
    name,
    frets,
    root: Number.isInteger(item.root) ? item.root : rootFromChordName(name),
    shape: item.shape || compactShape(frets),
    position: item.position || shapePositionName(frets),
    source: item.source || "曲谱记录"
  };
}
function normalizeChart(chart, fallbackTitle = "未命名曲谱") {
  return {
    id: chart.id || createId("chart"),
    title: chart.title || fallbackTitle,
    items: Array.isArray(chart.items) ? chart.items.map(normalizeChartItem) : [],
    updatedAt: chart.updatedAt || Date.now()
  };
}
function normalizeChartLibrary(parsed) {
  if (Array.isArray(parsed)) {
    const chart = normalizeChart({
      title: "未命名曲谱",
      items: parsed
    });
    return {
      activeChartId: chart.id,
      charts: [chart]
    };
  }
  if (parsed && Array.isArray(parsed.charts)) {
    const charts = parsed.charts.map((chart, index) => normalizeChart(chart, `曲谱 ${index + 1}`));
    const activeChartId = charts.some(chart => chart.id === parsed.activeChartId) ? parsed.activeChartId : charts[0]?.id;
    return charts.length ? {
      activeChartId,
      charts
    } : createDefaultLibrary();
  }
  if (parsed && Array.isArray(parsed.items)) {
    const chart = normalizeChart(parsed);
    return {
      activeChartId: chart.id,
      charts: [chart]
    };
  }
  return createDefaultLibrary();
}
function createDefaultLibrary() {
  const chart = normalizeChart({
    title: "未命名曲谱",
    items: []
  });
  return {
    activeChartId: chart.id,
    charts: [chart]
  };
}
function loadChartLibrary() {
  try {
    const stored = window.localStorage.getItem(CHART_STORAGE_KEY);
    const parsed = stored ? JSON.parse(stored) : null;
    return normalizeChartLibrary(parsed);
  } catch {
    return createDefaultLibrary();
  }
}
function rootFromChordName(name) {
  const parsed = parseChordName(String(name).split("/")[0]);
  return parsed.ok ? parsed.root : null;
}
function chartItemsToText(title, items) {
  if (!items.length) return "";
  const rows = items.map((item, index) => `${index + 1}. ${item.name}  ${item.shape}  ${item.position}`).join("\n");
  return `${title || "未命名曲谱"}\n${rows}`;
}
function App() {
  const [chordQuery, setChordQuery] = useState("C");
  const [fretValues, setFretValues] = useState(["x", "3", "2", "0", "1", "0"]);
  const [chartLibrary, setChartLibrary] = useState(loadChartLibrary);
  const [chartMessage, setChartMessage] = useState("");
  const importInputRef = useRef(null);
  const activeChart = chartLibrary.charts.find(chart => chart.id === chartLibrary.activeChartId) || chartLibrary.charts[0];
  const chartTitle = activeChart.title;
  const chartItems = activeChart.items;
  const parsedChord = useMemo(() => parseChordName(chordQuery), [chordQuery]);
  const voicings = useMemo(() => parsedChord.ok ? getVoicings(parsedChord) : [], [parsedChord]);
  const recognition = useMemo(() => identifyChord(fretValues), [fretValues]);
  useEffect(() => {
    window.localStorage.setItem(CHART_STORAGE_KEY, JSON.stringify(chartLibrary));
  }, [chartLibrary]);
  function updateActiveChart(updater) {
    setChartLibrary(library => ({
      ...library,
      charts: library.charts.map(chart => chart.id === library.activeChartId ? {
        ...chart,
        ...(typeof updater === "function" ? updater(chart) : updater),
        updatedAt: Date.now()
      } : chart)
    }));
  }
  function setChartTitle(title) {
    updateActiveChart({
      title
    });
  }
  function setChartItems(updater) {
    updateActiveChart(chart => ({
      items: typeof updater === "function" ? updater(chart.items) : updater
    }));
  }
  function selectChart(id) {
    setChartLibrary(library => ({
      ...library,
      activeChartId: id
    }));
    const chart = chartLibrary.charts.find(item => item.id === id);
    setChartMessage(chart ? `已切换：${chart.title}` : "");
  }
  function createChart() {
    const chart = normalizeChart({
      title: `新曲谱 ${chartLibrary.charts.length + 1}`,
      items: []
    });
    setChartLibrary(library => ({
      activeChartId: chart.id,
      charts: [...library.charts, chart]
    }));
    setChartMessage(`已新建：${chart.title}`);
  }
  function deleteActiveChart() {
    setChartLibrary(library => {
      if (library.charts.length <= 1) {
        const chart = normalizeChart({
          id: library.activeChartId,
          title: "未命名曲谱",
          items: []
        });
        return {
          activeChartId: chart.id,
          charts: [chart]
        };
      }
      const activeIndex = library.charts.findIndex(chart => chart.id === library.activeChartId);
      const charts = library.charts.filter(chart => chart.id !== library.activeChartId);
      const nextActive = charts[Math.max(0, activeIndex - 1)] || charts[0];
      return {
        activeChartId: nextActive.id,
        charts
      };
    });
    setChartMessage("已删除当前曲谱。");
  }
  function useShape(frets) {
    setFretValues(frets.map(fret => fret === null ? "x" : String(fret)));
    requestAnimationFrame(() => {
      document.querySelector(".reverse-panel")?.scrollIntoView({
        behavior: "smooth",
        block: "start"
      });
    });
  }
  function addChartItem(name, frets, source, root = rootFromChordName(name)) {
    const item = {
      id: `${Date.now()}-${Math.random().toString(16).slice(2)}`,
      name,
      frets,
      root,
      shape: compactShape(frets),
      position: shapePositionName(frets),
      source
    };
    setChartItems(items => [...items, item]);
    setChartMessage(`已加入：${name}`);
  }
  function addCurrentInputToChart() {
    const parsedFrets = fretValues.map(parseFret);
    if (parsedFrets.some(fret => fret === undefined)) {
      setChartMessage("品位格式有误，暂时不能加入曲谱。");
      return;
    }
    if (parsedFrets.every(fret => fret === null)) {
      setChartMessage("至少输入一根有声弦。");
      return;
    }
    const bestName = recognition.results[0]?.name || "未知和弦";
    addChartItem(bestName, parsedFrets, "手动输入", rootFromChordName(bestName));
  }
  function moveChartItem(id, direction) {
    setChartItems(items => {
      const index = items.findIndex(item => item.id === id);
      const nextIndex = index + direction;
      if (index < 0 || nextIndex < 0 || nextIndex >= items.length) return items;
      const next = [...items];
      const [item] = next.splice(index, 1);
      next.splice(nextIndex, 0, item);
      return next;
    });
  }
  function removeChartItem(id) {
    setChartItems(items => items.filter(item => item.id !== id));
  }
  async function copyChart() {
    const text = chartItemsToText(chartTitle, chartItems);
    if (!text) {
      setChartMessage("曲谱还是空的。");
      return;
    }
    try {
      await navigator.clipboard.writeText(text);
      setChartMessage("已复制曲谱文本。");
    } catch {
      setChartMessage(text);
    }
  }
  function exportChart() {
    if (!chartItems.length) {
      setChartMessage("曲谱还是空的，先加入几个和弦。");
      return;
    }
    const payload = JSON.stringify({
      version: 2,
      type: "guitar-chart",
      chart: activeChart
    }, null, 2);
    const blob = new Blob([payload], {
      type: "application/json"
    });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    const safeTitle = (chartTitle || "guitar-chart").replace(/[^\w\u4e00-\u9fa5-]+/g, "-");
    link.href = url;
    link.download = `${safeTitle || "guitar-chart"}.json`;
    link.click();
    URL.revokeObjectURL(url);
    setChartMessage("已导出 JSON 备份。长期保存请保留这个文件。");
  }
  async function importChart(event) {
    const file = event.target.files?.[0];
    if (!file) return;
    try {
      const imported = JSON.parse(await file.text());
      const importedCharts = imported?.chart ? [normalizeChart({
        ...imported.chart,
        id: createId("chart")
      })] : imported?.charts ? imported.charts.map(chart => normalizeChart({
        ...chart,
        id: createId("chart")
      })) : [normalizeChart(Array.isArray(imported) ? {
        title: "导入曲谱",
        items: imported
      } : imported)];
      const validCharts = importedCharts.filter(chart => Array.isArray(chart.items));
      if (!validCharts.length) {
        setChartMessage("导入失败，文件里没有可用曲谱。");
        return;
      }
      setChartLibrary(library => ({
        activeChartId: validCharts[0].id,
        charts: [...library.charts, ...validCharts]
      }));
      setChartMessage(`已导入 ${validCharts.length} 份曲谱。`);
    } catch {
      setChartMessage("导入失败，请选择之前导出的 JSON 文件。");
    } finally {
      event.target.value = "";
    }
  }
  return React.createElement("div", {
    className: "app-shell"
  }, React.createElement("header", {
    className: "topbar"
  }, React.createElement("div", {
    className: "brand"
  }, React.createElement("div", {
    className: "brand-row"
  }, React.createElement("div", {
    className: "brand-mark"
  }, "G"), React.createElement("h1", null, "\u5409\u4ED6\u548C\u5F26\u67E5\u8BE2")), React.createElement("p", {
    className: "subtitle"
  }, "\u8F93\u5165\u548C\u5F26\u540D\u67E5\u770B\u5E38\u7528\u628A\u4F4D\uFF0C\u4E5F\u53EF\u4EE5\u8F93\u5165\u516D\u6839\u5F26\u7684\u54C1\u4F4D\u6765\u53CD\u5411\u8BC6\u522B\u53EF\u80FD\u7684\u548C\u5F26\u3002")), React.createElement("div", {
    className: "tuning-pill"
  }, "\u6807\u51C6\u8C03\u5F26 ", React.createElement("strong", null, "E A D G B e"))), React.createElement("main", {
    className: "page-stack"
  }, React.createElement("section", {
    className: "lookup-row"
  }, React.createElement("section", {
    className: "panel search-panel"
  }, React.createElement("div", {
    className: "panel-inner"
  }, React.createElement("div", {
    className: "panel-header compact-header"
  }, React.createElement("div", {
    className: "panel-title"
  }, React.createElement("span", {
    className: "eyebrow"
  }, "Chord Search"), React.createElement("h2", null, "\u8F93\u5165\u548C\u5F26\u540D\u79F0")), React.createElement("span", {
    className: "hint"
  }, "\u4F8B\u5982 C\u3001Am\u3001F#7\u3001Bbmaj7\u3002")), React.createElement("div", {
    className: "field-row stacked-field"
  }, React.createElement("input", {
    className: "text-field",
    value: chordQuery,
    onChange: event => setChordQuery(event.target.value),
    placeholder: "\u8F93\u5165\u548C\u5F26\u540D",
    "aria-label": "\u548C\u5F26\u540D"
  }), React.createElement("button", {
    className: "primary-button",
    onClick: () => setChordQuery(chordQuery.trim() || "C")
  }, "\u67E5\u8BE2")), React.createElement("div", {
    className: "chip-row",
    "aria-label": "\u5E38\u7528\u548C\u5F26\u793A\u4F8B"
  }, EXAMPLE_CHORDS.map(example => React.createElement("button", {
    className: "chip",
    key: example,
    onClick: () => setChordQuery(example)
  }, example))), parsedChord.ok ? React.createElement("div", {
    className: "summary-strip search-summary"
  }, React.createElement("span", {
    className: "metric"
  }, "\u548C\u5F26 ", React.createElement("strong", null, parsedChord.displayName)), React.createElement("span", {
    className: "metric"
  }, parsedChord.definition.label), React.createElement("span", {
    className: "metric"
  }, "\u6784\u6210\u97F3", " ", React.createElement("strong", null, pitchClassesForChord(parsedChord.root, parsedChord.definition.intervals).map(pc => noteName(pc, parsedChord.preferFlats)).join(" ")))) : React.createElement("p", {
    className: "error-text"
  }, parsedChord.message))), React.createElement("section", {
    className: "panel voicing-panel"
  }, React.createElement("div", {
    className: "panel-inner"
  }, React.createElement("div", {
    className: "panel-header compact-header"
  }, React.createElement("div", {
    className: "panel-title"
  }, React.createElement("span", {
    className: "eyebrow"
  }, "Voicings"), React.createElement("h2", null, parsedChord.ok ? `${parsedChord.displayName} 按法` : "按法")), React.createElement("span", {
    className: "hint"
  }, "\u4F18\u5148\u5C55\u793A\u5C01\u95ED\u548C\u9AD8\u628A\u4F4D\uFF1B\u70B9\u201C\u8BC6\u522B\u201D\u53EF\u5E26\u5165\u4E0B\u65B9\u3002")), parsedChord.ok && voicings.length ? React.createElement("div", {
    className: "voicing-grid"
  }, voicings.map(shape => React.createElement(VoicingCard, {
    key: compactShape(shape.frets),
    parsed: parsedChord,
    shape: shape,
    onUse: () => useShape(shape.frets),
    onAdd: () => addChartItem(parsedChord.displayName, shape.frets, shape.name, parsedChord.root)
  }))) : React.createElement("div", {
    className: "empty-state"
  }, "\u8F93\u5165\u4E00\u4E2A\u53EF\u8BC6\u522B\u7684\u548C\u5F26\u540D\u540E\uFF0C\u8FD9\u91CC\u4F1A\u663E\u793A\u591A\u4E2A\u628A\u4F4D\u56FE\u3002")))), React.createElement("section", {
    className: "panel reverse-panel"
  }, React.createElement("div", {
    className: "panel-inner"
  }, React.createElement("div", {
    className: "panel-header compact-header"
  }, React.createElement("div", {
    className: "panel-title"
  }, React.createElement("span", {
    className: "eyebrow"
  }, "Reverse Finder"), React.createElement("h2", null, "\u8F93\u5165\u6309\u6CD5\uFF0C\u8BC6\u522B\u53EF\u80FD\u548C\u5F26")), React.createElement("span", {
    className: "hint"
  }, "\u4ECE 6 \u5F26\u5230 1 \u5F26\u8F93\u5165\u54C1\u4F4D\uFF1Bx \u8868\u793A\u4E0D\u5F39\u3002")), React.createElement("div", {
    className: "reverse-layout"
  }, React.createElement("div", {
    className: "reverse-input"
  }, React.createElement("div", {
    className: "identifier-grid"
  }, TUNING.map((string, index) => React.createElement("div", {
    className: "string-field",
    key: `${string.label}-${string.note}`
  }, React.createElement("label", {
    htmlFor: `string-${index}`
  }, string.label, " ", string.note), React.createElement("input", {
    id: `string-${index}`,
    className: "fret-field",
    value: fretValues[index],
    inputMode: "numeric",
    onChange: event => {
      const next = [...fretValues];
      next[index] = event.target.value;
      setFretValues(next);
    },
    "aria-label": `${string.label} ${string.note} 品位`
  })))), React.createElement("div", {
    className: "summary-strip compact-summary"
  }, React.createElement("span", {
    className: "metric"
  }, "\u8F93\u5165 ", React.createElement("strong", null, fretValues.join(" "))), React.createElement("span", {
    className: "metric"
  }, "\u97F3\u540D", " ", React.createElement("strong", null, recognition.notes.length ? recognition.notes.map(note => noteName(note.pc)).join(" ") : "无"))), React.createElement("div", {
    className: "chip-row compact-examples",
    "aria-label": "\u54C1\u4F4D\u8F93\u5165\u793A\u4F8B"
  }, FRET_EXAMPLES.map(example => React.createElement("button", {
    className: "chip",
    key: example.label,
    onClick: () => setFretValues(example.frets)
  }, example.label, ": ", example.frets.join(" ")))), React.createElement("button", {
    className: "primary-button add-current-button",
    onClick: addCurrentInputToChart
  }, "\u52A0\u5165\u66F2\u8C31")), React.createElement("div", {
    className: "recognition"
  }, recognition.error ? React.createElement("p", {
    className: "error-text"
  }, recognition.error) : null, !recognition.error && recognition.results.length === 0 ? React.createElement("div", {
    className: "empty-state"
  }, "\u6682\u65F6\u6CA1\u6709\u9AD8\u7F6E\u4FE1\u5EA6\u7ED3\u679C\u3002\u8BD5\u7740\u589E\u52A0\u6839\u97F3\u3001\u4E09\u97F3\u6216\u4E03\u97F3\uFF0C\u8BC6\u522B\u4F1A\u66F4\u7A33\u5B9A\u3002") : React.createElement("div", {
    className: "result-list"
  }, recognition.results.map(result => React.createElement("div", {
    className: "result-row",
    key: result.key
  }, React.createElement("div", null, React.createElement("div", {
    className: "result-name"
  }, result.name), React.createElement("div", {
    className: "result-meta"
  }, result.label)), React.createElement("div", {
    className: "result-meta"
  }, "\u547D\u4E2D ", result.matched.join(" "), result.missing.length ? `，缺少 ${result.missing.join(" ")}` : "", result.extra.length ? `，额外 ${result.extra.join(" ")}` : ""), React.createElement("div", {
    className: "confidence"
  }, result.confidence, "%", React.createElement("div", {
    className: "confidence-bar",
    "aria-hidden": "true"
  }, React.createElement("span", {
    style: {
      width: `${result.confidence}%`
    }
  })))))))))), React.createElement("section", {
    className: "panel chart-panel"
  }, React.createElement("div", {
    className: "panel-inner"
  }, React.createElement("div", {
    className: "panel-header compact-header"
  }, React.createElement("div", {
    className: "panel-title"
  }, React.createElement("span", {
    className: "eyebrow"
  }, "Chart Sequence"), React.createElement("h2", null, "\u66F2\u8C31\u8BB0\u5F55")), React.createElement("div", {
    className: "chart-actions"
  }, React.createElement("button", {
    className: "ghost-button add-button",
    onClick: createChart
  }, "\u65B0\u5EFA"), React.createElement("button", {
    className: "ghost-button",
    onClick: copyChart
  }, "\u590D\u5236"), React.createElement("button", {
    className: "ghost-button",
    onClick: exportChart
  }, "\u5BFC\u51FA"), React.createElement("button", {
    className: "ghost-button",
    onClick: () => importInputRef.current?.click()
  }, "\u5BFC\u5165"), React.createElement("button", {
    className: "ghost-button danger-button",
    onClick: deleteActiveChart
  }, "\u5220\u9664\u5F53\u524D"), React.createElement("button", {
    className: "ghost-button danger-button",
    onClick: () => setChartItems([])
  }, "\u6E05\u7A7A"))), React.createElement("input", {
    ref: importInputRef,
    className: "hidden-file-input",
    type: "file",
    accept: "application/json,.json",
    onChange: importChart,
    "aria-label": "\u5BFC\u5165\u66F2\u8C31 JSON"
  }), React.createElement("div", {
    className: "chart-library-bar"
  }, React.createElement("label", {
    className: "chart-select-field"
  }, React.createElement("span", null, "\u5F53\u524D\u66F2\u8C31"), React.createElement("select", {
    className: "chart-select",
    value: activeChart.id,
    onChange: event => selectChart(event.target.value),
    "aria-label": "\u9009\u62E9\u66F2\u8C31"
  }, chartLibrary.charts.map(chart => React.createElement("option", {
    value: chart.id,
    key: chart.id
  }, chart.title || "未命名曲谱", " (", chart.items.length, ")")))), React.createElement("span", {
    className: "library-count"
  }, "\u5171 ", chartLibrary.charts.length, " \u4EFD\u66F2\u8C31")), React.createElement("label", {
    className: "chart-title-field"
  }, React.createElement("span", null, "\u66F2\u8C31\u540D\u79F0"), React.createElement("input", {
    className: "text-field",
    value: chartTitle,
    onChange: event => setChartTitle(event.target.value),
    placeholder: "\u4F8B\u5982 City Pop \u7EC3\u4E60 / \u65B0\u6B4C Verse",
    "aria-label": "\u66F2\u8C31\u540D\u79F0"
  })), React.createElement("p", {
    className: "save-note"
  }, "\u66F2\u8C31\u5E93\u4F1A\u81EA\u52A8\u4FDD\u5B58\u5230\u5F53\u524D\u6D4F\u89C8\u5668\uFF1B\u8981\u957F\u671F\u4FDD\u5B58\u6216\u6362\u8BBE\u5907\uFF0C\u8BF7\u5B9A\u671F\u5BFC\u51FA\u5F53\u524D\u66F2\u8C31\u7684 JSON \u5907\u4EFD\u3002"), chartItems.length ? React.createElement("div", {
    className: "chart-sequence",
    "aria-label": "\u66F2\u8C31\u548C\u5F26\u5E8F\u5217"
  }, chartItems.map((item, index) => React.createElement(ChartItem, {
    item: item,
    index: index,
    total: chartItems.length,
    key: item.id,
    onMove: moveChartItem,
    onRemove: removeChartItem,
    onUse: frets => useShape(frets)
  }))) : React.createElement("div", {
    className: "empty-state"
  }, "\u4ECE\u4E0A\u65B9\u6309\u6CD5\u5361\u7247\u70B9\u201C\u52A0\u5165\u201D\uFF0C\u6216\u5728\u8BC6\u522B\u533A\u8F93\u5165\u6309\u6CD5\u540E\u70B9\u201C\u52A0\u5165\u66F2\u8C31\u201D\u3002"), chartMessage ? React.createElement("p", {
    className: "chart-message"
  }, chartMessage) : null)), React.createElement("p", {
    className: "footer-note"
  }, "MVP \u91C7\u7528\u6807\u51C6\u8C03\u5F26\u548C\u5341\u4E8C\u5E73\u5747\u5F8B\u505A\u8BC6\u522B\u3002\u5B9E\u9645\u97F3\u4E50\u8BED\u5883\u4F1A\u5F71\u54CD\u547D\u540D\uFF0C\u4F8B\u5982\u540C\u4E00\u7EC4\u97F3\u53EF\u80FD\u540C\u65F6\u5BF9\u5E94 Am7 \u4E0E C6\u3002")));
}
function ChartItem({
  item,
  index,
  total,
  onMove,
  onRemove,
  onUse
}) {
  return React.createElement("article", {
    className: "chart-card"
  }, React.createElement("div", {
    className: "chart-card-main"
  }, React.createElement("span", {
    className: "chart-index"
  }, index + 1), React.createElement("div", {
    className: "chart-item-body"
  }, React.createElement("div", {
    className: "chart-diagram-wrap"
  }, React.createElement(ChordDiagram, {
    shape: item.frets,
    root: item.root
  })), React.createElement("div", null, React.createElement("h3", null, item.name), React.createElement("p", null, React.createElement("span", {
    className: "shape-code"
  }, item.shape), " \xB7 ", item.position), React.createElement("p", null, item.source)))), React.createElement("div", {
    className: "chart-card-actions"
  }, React.createElement("button", {
    className: "ghost-button",
    disabled: index === 0,
    onClick: () => onMove(item.id, -1)
  }, "\u4E0A\u79FB"), React.createElement("button", {
    className: "ghost-button",
    disabled: index === total - 1,
    onClick: () => onMove(item.id, 1)
  }, "\u4E0B\u79FB"), React.createElement("button", {
    className: "ghost-button",
    onClick: () => onUse(item.frets)
  }, "\u8BC6\u522B"), React.createElement("button", {
    className: "ghost-button danger-button",
    onClick: () => onRemove(item.id)
  }, "\u5220\u9664")));
}
function VoicingCard({
  parsed,
  shape,
  onUse,
  onAdd
}) {
  return React.createElement("article", {
    className: "voicing-card"
  }, React.createElement("div", {
    className: "voicing-card-header"
  }, React.createElement("div", {
    className: "voicing-name"
  }, React.createElement("h3", null, shape.name), React.createElement("div", {
    className: "voicing-meta"
  }, React.createElement("span", null, shape.form), React.createElement("span", {
    className: "shape-code"
  }, compactShape(shape.frets)))), React.createElement("div", {
    className: "voicing-actions"
  }, React.createElement("button", {
    className: "ghost-button",
    onClick: onUse
  }, "\u8BC6\u522B"), React.createElement("button", {
    className: "ghost-button add-button",
    onClick: onAdd
  }, "\u52A0\u5165"))), React.createElement("div", {
    className: "diagram-wrap"
  }, React.createElement(ChordDiagram, {
    shape: shape.frets,
    root: parsed.root
  })));
}
function ChordDiagram({
  shape,
  root
}) {
  const played = shape.filter(fret => fret !== null);
  const positive = played.filter(fret => fret > 0);
  const minPositive = positive.length ? Math.min(...positive) : 1;
  const maxFret = played.length ? Math.max(...played) : 4;
  const firstFret = played.some(fret => fret === 0) || minPositive <= 1 ? 1 : minPositive;
  const fretCount = Math.max(4, Math.min(6, maxFret - firstFret + 1));
  const width = 260;
  const height = 238;
  const left = 28;
  const right = 18;
  const top = 36;
  const bottom = 32;
  const boardWidth = width - left - right;
  const boardHeight = height - top - bottom;
  const stringGap = boardWidth / 5;
  const fretGap = boardHeight / fretCount;
  return React.createElement("svg", {
    className: "chord-diagram",
    viewBox: `0 0 ${width} ${height}`,
    role: "img",
    "aria-label": compactShape(shape)
  }, shape.map((fret, index) => {
    const x = left + stringGap * index;
    const label = fret === null ? "x" : fret === 0 ? "o" : "";
    return label ? React.createElement("text", {
      className: "diagram-label",
      x: x,
      y: 18,
      key: `top-${index}`
    }, label) : null;
  }), Array.from({
    length: 6
  }).map((_, index) => {
    const x = left + stringGap * index;
    return React.createElement("line", {
      className: "diagram-line",
      x1: x,
      x2: x,
      y1: top,
      y2: top + boardHeight,
      key: `string-${index}`
    });
  }), Array.from({
    length: fretCount + 1
  }).map((_, index) => {
    const y = top + fretGap * index;
    const isNut = index === 0 && firstFret === 1;
    return React.createElement("line", {
      className: isNut ? "diagram-nut" : "diagram-line",
      x1: left,
      x2: left + boardWidth,
      y1: y,
      y2: y,
      key: `fret-${index}`
    });
  }), firstFret > 1 ? React.createElement("text", {
    className: "diagram-fret-label",
    x: 4,
    y: top + fretGap * 0.65
  }, firstFret, "fr") : null, shape.map((fret, index) => {
    if (fret === null || fret === 0) return null;
    const x = left + stringGap * index;
    const y = top + (fret - firstFret + 0.5) * fretGap;
    const pc = mod(TUNING[index].pc + fret);
    const isRoot = pc === root;
    return React.createElement("g", {
      key: `dot-${index}-${fret}`
    }, React.createElement("circle", {
      className: isRoot ? "diagram-root" : "diagram-dot",
      cx: x,
      cy: y,
      r: "11.5"
    }), React.createElement("text", {
      className: "diagram-text",
      x: x,
      y: y + 0.5
    }, fret));
  }), TUNING.map((string, index) => {
    const x = left + stringGap * index;
    return React.createElement("text", {
      className: "diagram-label",
      x: x,
      y: height - 9,
      key: `label-${string.label}`
    }, string.note);
  }));
}
ReactDOM.createRoot(document.getElementById("root")).render(React.createElement(App, null));