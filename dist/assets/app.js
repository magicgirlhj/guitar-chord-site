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
const SUPABASE_CONFIG_STORAGE_KEY = "guitar-chord-supabase-config-v1";
const SUPABASE_LIBRARY_TABLE = "guitar_chart_libraries";
const CLOUD_SAVE_DELAY = 900;
const DEFAULT_SECTION_TITLE = "前奏";
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
function normalizeChartItem(item = {}) {
  item = item && typeof item === "object" ? item : {};
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
function normalizeChartSection(section = {}, index = 0) {
  section = section && typeof section === "object" ? section : {};
  return {
    id: section.id || createId("section"),
    title: section.title || (index === 0 ? DEFAULT_SECTION_TITLE : `段落 ${index + 1}`),
    items: Array.isArray(section.items) ? section.items.map(normalizeChartItem) : []
  };
}
function createEmptySection(title = DEFAULT_SECTION_TITLE) {
  return normalizeChartSection({
    title,
    items: []
  });
}
function normalizeChart(chart = {}, fallbackTitle = "未命名曲谱") {
  chart = chart && typeof chart === "object" ? chart : {};
  const sections = Array.isArray(chart.sections) ? chart.sections.map(normalizeChartSection) : [normalizeChartSection({
    title: DEFAULT_SECTION_TITLE,
    items: chart.items || []
  })];
  const safeSections = sections.length ? sections : [createEmptySection()];
  const activeSectionId = safeSections.some(section => section.id === chart.activeSectionId) ? chart.activeSectionId : safeSections[0].id;
  return {
    id: chart.id || createId("chart"),
    title: chart.title || fallbackTitle,
    activeSectionId,
    sections: safeSections,
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
function normalizeSupabaseConfig(config = {}) {
  return {
    url: String(config.url || "").trim(),
    anonKey: String(config.anonKey || config.publishableKey || "").trim()
  };
}
function embeddedSupabaseConfig() {
  return normalizeSupabaseConfig(window.GUITAR_CHORD_SUPABASE || {});
}
function loadSupabaseConfig() {
  const embeddedConfig = embeddedSupabaseConfig();
  if (hasSupabaseConfig(embeddedConfig)) return embeddedConfig;
  try {
    const stored = window.localStorage.getItem(SUPABASE_CONFIG_STORAGE_KEY);
    const localConfig = stored ? normalizeSupabaseConfig(JSON.parse(stored)) : null;
    if (localConfig?.url && localConfig?.anonKey) return localConfig;
  } catch {}
  return embeddedConfig;
}
function saveSupabaseConfig(config) {
  const normalized = normalizeSupabaseConfig(config);
  if (normalized.url && normalized.anonKey) {
    window.localStorage.setItem(SUPABASE_CONFIG_STORAGE_KEY, JSON.stringify(normalized));
  } else {
    window.localStorage.removeItem(SUPABASE_CONFIG_STORAGE_KEY);
  }
  return normalized;
}
function hasSupabaseConfig(config) {
  return Boolean(config?.url && config?.anonKey);
}
function createSupabaseClient(config) {
  if (!hasSupabaseConfig(config)) return {
    client: null,
    error: ""
  };
  if (!window.supabase?.createClient) {
    return {
      client: null,
      error: "Supabase 脚本未加载，暂时只能本地保存。"
    };
  }
  try {
    const url = new URL(config.url);
    if (!["http:", "https:"].includes(url.protocol)) {
      return {
        client: null,
        error: "Supabase URL 需要以 https:// 开头。"
      };
    }
    return {
      client: window.supabase.createClient(config.url, config.anonKey, {
        auth: {
          autoRefreshToken: true,
          detectSessionInUrl: true,
          persistSession: true
        }
      }),
      error: ""
    };
  } catch (error) {
    return {
      client: null,
      error: `Supabase 配置无效：${error.message}`
    };
  }
}
function cloudRedirectUrl() {
  return `${window.location.origin}${window.location.pathname}`;
}
function mergeChartLibraries(localLibrary, cloudLibrary) {
  const local = normalizeChartLibrary(localLibrary);
  const cloud = normalizeChartLibrary(cloudLibrary);
  const byId = new Map();
  [...cloud.charts, ...local.charts].forEach(chart => {
    const existing = byId.get(chart.id);
    if (!existing || (chart.updatedAt || 0) >= (existing.updatedAt || 0)) {
      byId.set(chart.id, chart);
    }
  });
  const charts = Array.from(byId.values()).sort((a, b) => (b.updatedAt || 0) - (a.updatedAt || 0));
  const activeChartId = charts.some(chart => chart.id === local.activeChartId) ? local.activeChartId : charts.some(chart => chart.id === cloud.activeChartId) ? cloud.activeChartId : charts[0]?.id;
  return normalizeChartLibrary({
    activeChartId,
    charts
  });
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
function chartSectionsToText(title, sections) {
  const populated = sections.filter(section => section.items.length);
  if (!populated.length) return "";
  return `${title || "未命名曲谱"}\n${populated.map(section => `\n[${section.title}]\n${section.items.map((item, index) => `${index + 1}. ${item.name}  ${item.shape}  ${item.position}`).join("\n")}`).join("\n")}`;
}
function flattenSections(sections = []) {
  return (Array.isArray(sections) ? sections : []).flatMap(section => Array.isArray(section?.items) ? section.items : []);
}
function App() {
  const [chordQuery, setChordQuery] = useState("C");
  const [fretValues, setFretValues] = useState(["x", "3", "2", "0", "1", "0"]);
  const [editorBaseFret, setEditorBaseFret] = useState(1);
  const [draggedChord, setDraggedChord] = useState(null);
  const [dragTarget, setDragTarget] = useState(null);
  const [chartLibrary, setChartLibrary] = useState(loadChartLibrary);
  const [chartMessage, setChartMessage] = useState("");
  const [supabaseConfig, setSupabaseConfig] = useState(loadSupabaseConfig);
  const [syncConfigDraft, setSyncConfigDraft] = useState(loadSupabaseConfig);
  const [syncClient, setSyncClient] = useState(null);
  const [syncUser, setSyncUser] = useState(null);
  const [syncEmail, setSyncEmail] = useState("");
  const [syncPassword, setSyncPassword] = useState("");
  const [syncStatus, setSyncStatus] = useState({
    tone: "local",
    text: "本地保存"
  });
  const [showSyncSettings, setShowSyncSettings] = useState(false);
  const [cloudReady, setCloudReady] = useState(false);
  const importInputRef = useRef(null);
  const cloudSaveTimerRef = useRef(null);
  const activeChart = chartLibrary.charts.find(chart => chart.id === chartLibrary.activeChartId) || chartLibrary.charts[0];
  const chartTitle = activeChart.title;
  const chartSections = activeChart.sections;
  const activeSection = chartSections.find(section => section.id === activeChart.activeSectionId) || chartSections[0];
  const chartItems = flattenSections(chartSections);
  const parsedChord = useMemo(() => parseChordName(chordQuery), [chordQuery]);
  const voicings = useMemo(() => parsedChord.ok ? getVoicings(parsedChord) : [], [parsedChord]);
  const recognition = useMemo(() => identifyChord(fretValues), [fretValues]);
  const syncConfigured = hasSupabaseConfig(supabaseConfig);
  useEffect(() => {
    window.localStorage.setItem(CHART_STORAGE_KEY, JSON.stringify(chartLibrary));
  }, [chartLibrary]);
  useEffect(() => {
    if (!hasSupabaseConfig(supabaseConfig)) {
      setSyncClient(null);
      setSyncUser(null);
      setCloudReady(false);
      setSyncStatus({
        tone: "local",
        text: "未配置云同步，当前仅保存到本机。"
      });
      return undefined;
    }
    const {
      client,
      error: clientError
    } = createSupabaseClient(supabaseConfig);
    if (!client) {
      setSyncClient(null);
      setSyncUser(null);
      setCloudReady(false);
      setShowSyncSettings(Boolean(clientError));
      setSyncStatus({
        tone: clientError ? "error" : "local",
        text: clientError || "未配置云同步，当前仅保存到本机。"
      });
      return undefined;
    }
    let active = true;
    setSyncClient(client);
    setCloudReady(false);
    setSyncStatus({
      tone: "pending",
      text: "正在连接云同步..."
    });
    client.auth.getSession().then(({
      data,
      error
    }) => {
      if (!active) return;
      if (error) {
        setSyncStatus({
          tone: "error",
          text: `登录状态读取失败：${error.message}`
        });
        return;
      }
      const user = data.session?.user || null;
      setSyncUser(user);
      setSyncStatus(user ? {
        tone: "pending",
        text: "正在读取云端曲谱..."
      } : {
        tone: "local",
        text: "云同步已配置，请先登录。"
      });
    });
    const {
      data
    } = client.auth.onAuthStateChange((_event, session) => {
      if (!active) return;
      const user = session?.user || null;
      setSyncUser(user);
      setCloudReady(false);
      setSyncStatus(user ? {
        tone: "pending",
        text: "正在读取云端曲谱..."
      } : {
        tone: "local",
        text: "已退出，当前仅保存到本机。"
      });
    });
    return () => {
      active = false;
      data.subscription?.unsubscribe();
    };
  }, [supabaseConfig.url, supabaseConfig.anonKey]);
  useEffect(() => {
    if (!syncClient || !syncUser) return undefined;
    let active = true;
    async function loadCloudLibrary() {
      setCloudReady(false);
      setSyncStatus({
        tone: "pending",
        text: "正在读取云端曲谱..."
      });
      try {
        const {
          data,
          error
        } = await syncClient.from(SUPABASE_LIBRARY_TABLE).select("library, updated_at").eq("user_id", syncUser.id).maybeSingle();
        if (!active) return;
        if (error) throw error;
        if (data?.library) {
          setChartLibrary(localLibrary => mergeChartLibraries(localLibrary, data.library));
          setSyncStatus({
            tone: "pending",
            text: "已合并云端曲谱，正在保存最新版本..."
          });
        } else {
          setSyncStatus({
            tone: "pending",
            text: "云端还没有曲谱，正在上传本机曲谱..."
          });
        }
        setCloudReady(true);
      } catch (error) {
        if (!active) return;
        setCloudReady(false);
        setSyncStatus({
          tone: "error",
          text: `云端读取失败：${error.message}`
        });
      }
    }
    loadCloudLibrary();
    return () => {
      active = false;
    };
  }, [syncClient, syncUser?.id]);
  useEffect(() => {
    if (!syncClient || !syncUser || !cloudReady) return undefined;
    window.clearTimeout(cloudSaveTimerRef.current);
    setSyncStatus({
      tone: "pending",
      text: "正在同步曲谱..."
    });
    cloudSaveTimerRef.current = window.setTimeout(async () => {
      try {
        const library = normalizeChartLibrary(chartLibrary);
        const {
          error
        } = await syncClient.from(SUPABASE_LIBRARY_TABLE).upsert({
          user_id: syncUser.id,
          library,
          updated_at: new Date().toISOString()
        }, {
          onConflict: "user_id"
        });
        if (error) throw error;
        setSyncStatus({
          tone: "synced",
          text: `已同步到云端：${syncUser.email || "当前账号"}`
        });
      } catch (error) {
        setSyncStatus({
          tone: "error",
          text: `云端保存失败：${error.message}`
        });
      }
    }, CLOUD_SAVE_DELAY);
    return () => {
      window.clearTimeout(cloudSaveTimerRef.current);
    };
  }, [chartLibrary, syncClient, syncUser?.id, cloudReady]);
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
    updateActiveSectionItems(updater);
  }
  function updateChartSections(updater) {
    updateActiveChart(chart => ({
      sections: typeof updater === "function" ? updater(chart.sections) : updater
    }));
  }
  function updateActiveSectionItems(updater) {
    updateActiveChart(chart => ({
      sections: chart.sections.map(section => section.id === chart.activeSectionId ? {
        ...section,
        items: typeof updater === "function" ? updater(section.items) : updater
      } : section)
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
      sections: [createEmptySection()]
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
          sections: [createEmptySection()]
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
    const stats = shapeStats(frets);
    setEditorBaseFret(stats.isOpen || stats.startFret <= 1 ? 1 : stats.startFret);
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
    setChartMessage(`已加入到「${activeSection.title}」：${name}`);
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
  function createSection() {
    const section = createEmptySection(`段落 ${chartSections.length + 1}`);
    updateActiveChart(chart => ({
      activeSectionId: section.id,
      sections: [...chart.sections, section]
    }));
    setChartMessage(`已添加段落：${section.title}`);
  }
  function selectSection(sectionId) {
    updateActiveChart({
      activeSectionId: sectionId
    });
  }
  function renameSection(sectionId, title) {
    updateChartSections(sections => sections.map(section => section.id === sectionId ? {
      ...section,
      title
    } : section));
  }
  function deleteSection(sectionId) {
    updateActiveChart(chart => {
      if (chart.sections.length <= 1) {
        return {
          activeSectionId: chart.sections[0].id,
          sections: [{
            ...chart.sections[0],
            title: DEFAULT_SECTION_TITLE,
            items: []
          }]
        };
      }
      const sectionIndex = chart.sections.findIndex(section => section.id === sectionId);
      const sections = chart.sections.filter(section => section.id !== sectionId);
      const activeSectionId = chart.activeSectionId === sectionId ? (sections[Math.max(0, sectionIndex - 1)] || sections[0]).id : chart.activeSectionId;
      return {
        activeSectionId,
        sections
      };
    });
    setChartMessage("已删除段落。");
  }
  function removeSectionItem(sectionId, itemId) {
    updateChartSections(sections => sections.map(section => section.id === sectionId ? {
      ...section,
      items: section.items.filter(item => item.id !== itemId)
    } : section));
  }
  function duplicateSectionItem(sectionId, itemId) {
    updateChartSections(sections => sections.map(section => {
      if (section.id !== sectionId) return section;
      const index = section.items.findIndex(item => item.id === itemId);
      if (index < 0) return section;
      const copy = {
        ...section.items[index],
        id: createId("chord"),
        source: `${section.items[index].source || "曲谱记录"} · 复制`
      };
      const items = [...section.items];
      items.splice(index + 1, 0, copy);
      return {
        ...section,
        items
      };
    }));
    setChartMessage("已复制和弦卡片。");
  }
  function moveChartItemToSection(itemId, fromSectionId, toSectionId, toIndex) {
    updateChartSections(sections => {
      let movingItem = null;
      let fromIndex = -1;
      const withoutItem = sections.map(section => {
        if (section.id !== fromSectionId) return section;
        fromIndex = section.items.findIndex(item => item.id === itemId);
        if (fromIndex < 0) return section;
        movingItem = section.items[fromIndex];
        return {
          ...section,
          items: section.items.filter(item => item.id !== itemId)
        };
      });
      if (!movingItem) return sections;
      return withoutItem.map(section => {
        if (section.id !== toSectionId) return section;
        const adjustedIndex = fromSectionId === toSectionId && fromIndex >= 0 && fromIndex < toIndex ? toIndex - 1 : toIndex;
        const insertIndex = Math.max(0, Math.min(adjustedIndex, section.items.length));
        const items = [...section.items];
        items.splice(insertIndex, 0, movingItem);
        return {
          ...section,
          items
        };
      });
    });
  }
  function markChartDropTarget(sectionId, index) {
    if (!draggedChord) return;
    setDragTarget(target => target?.sectionId === sectionId && target?.index === index ? target : {
      sectionId,
      index
    });
  }
  function clearChartDrag() {
    setDraggedChord(null);
    setDragTarget(null);
  }
  function handleChartDrop(sectionId, index) {
    if (!draggedChord) {
      setDragTarget(null);
      return;
    }
    moveChartItemToSection(draggedChord.itemId, draggedChord.sectionId, sectionId, index);
    clearChartDrag();
  }
  function setStringValue(index, value) {
    setFretValues(values => {
      const next = [...values];
      next[index] = value === null ? "x" : String(value);
      return next;
    });
  }
  function resetEditor() {
    setFretValues(["x", "x", "x", "x", "x", "x"]);
  }
  function setExampleFrets(frets) {
    setFretValues(frets);
    const parsed = frets.map(parseFret);
    const stats = shapeStats(parsed);
    setEditorBaseFret(stats.isOpen || stats.startFret <= 1 ? 1 : stats.startFret);
  }
  async function copyChart() {
    const text = chartSectionsToText(chartTitle, chartSections);
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
      const validCharts = importedCharts.filter(chart => Array.isArray(chart.sections));
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
  function saveSyncSettings() {
    const normalized = saveSupabaseConfig(syncConfigDraft);
    const {
      error: clientError
    } = createSupabaseClient(normalized);
    if (clientError) {
      setSyncConfigDraft(normalized);
      setSupabaseConfig(normalized);
      setShowSyncSettings(true);
      setCloudReady(false);
      setSyncStatus({
        tone: "error",
        text: clientError
      });
      return;
    }
    setSupabaseConfig(normalized);
    setShowSyncSettings(false);
    setCloudReady(false);
    setSyncStatus(hasSupabaseConfig(normalized) ? {
      tone: "pending",
      text: "正在连接云同步..."
    } : {
      tone: "local",
      text: "未配置云同步，当前仅保存到本机。"
    });
  }
  function clearSyncSettings() {
    const emptyConfig = saveSupabaseConfig({});
    setSupabaseConfig(emptyConfig);
    setSyncConfigDraft(emptyConfig);
    setShowSyncSettings(false);
    setCloudReady(false);
    setSyncStatus({
      tone: "local",
      text: "已清除云同步配置，当前仅保存到本机。"
    });
  }
  function getSyncCredentials(requirePassword = true) {
    const email = syncEmail.trim();
    const password = syncPassword;
    if (!syncClient) {
      setSyncStatus({
        tone: "error",
        text: "请先保存 Supabase 配置。"
      });
      return null;
    }
    if (!email) {
      setSyncStatus({
        tone: "error",
        text: "请输入邮箱。"
      });
      return null;
    }
    if (requirePassword && password.length < 6) {
      setSyncStatus({
        tone: "error",
        text: "密码至少需要 6 位。"
      });
      return null;
    }
    return {
      email,
      password
    };
  }
  async function signInWithPassword() {
    const credentials = getSyncCredentials();
    if (!credentials) return;
    setSyncStatus({
      tone: "pending",
      text: "正在登录..."
    });
    const {
      error
    } = await syncClient.auth.signInWithPassword({
      email: credentials.email,
      password: credentials.password
    });
    if (error) {
      const invalidLogin = error.message.toLowerCase().includes("invalid login credentials");
      setSyncStatus({
        tone: "error",
        text: invalidLogin ? "密码登录失败：邮箱未确认、密码不对，或这个邮箱还没有注册。没收到确认邮件可以点“重发确认”。" : `密码登录失败：${error.message}`
      });
      return;
    }
    setSyncPassword("");
    setSyncStatus({
      tone: "pending",
      text: "登录成功，正在读取云端曲谱..."
    });
  }
  async function signUpWithPassword() {
    const credentials = getSyncCredentials();
    if (!credentials) return;
    setSyncStatus({
      tone: "pending",
      text: "正在注册..."
    });
    const {
      data,
      error
    } = await syncClient.auth.signUp({
      email: credentials.email,
      password: credentials.password,
      options: {
        emailRedirectTo: cloudRedirectUrl()
      }
    });
    if (error) {
      setSyncStatus({
        tone: "error",
        text: `注册失败：${error.message}`
      });
      return;
    }
    setSyncPassword("");
    setSyncStatus(data.session ? {
      tone: "pending",
      text: "注册成功，正在同步曲谱..."
    } : {
      tone: "pending",
      text: "注册成功，请先打开邮箱确认一次，然后回来用密码登录。"
    });
  }
  async function resendSignupConfirmation() {
    const credentials = getSyncCredentials(false);
    if (!credentials) return;
    setSyncStatus({
      tone: "pending",
      text: "正在重发确认邮件..."
    });
    const {
      error
    } = await syncClient.auth.resend({
      type: "signup",
      email: credentials.email,
      options: {
        emailRedirectTo: cloudRedirectUrl()
      }
    });
    setSyncStatus(error ? {
      tone: "error",
      text: `确认邮件重发失败：${error.message}`
    } : {
      tone: "pending",
      text: "确认邮件已重发，请检查收件箱、垃圾邮件和促销邮件。"
    });
  }
  async function sendLoginLink() {
    const credentials = getSyncCredentials(false);
    if (!credentials) return;
    setSyncStatus({
      tone: "pending",
      text: "正在发送登录链接..."
    });
    const {
      error
    } = await syncClient.auth.signInWithOtp({
      email: credentials.email,
      options: {
        emailRedirectTo: cloudRedirectUrl()
      }
    });
    setSyncStatus(error ? {
      tone: "error",
      text: `登录链接发送失败：${error.message}`
    } : {
      tone: "pending",
      text: "登录链接已发送，请打开邮箱完成登录。"
    });
  }
  async function signOutSync() {
    if (!syncClient) return;
    const {
      error
    } = await syncClient.auth.signOut();
    setCloudReady(false);
    setSyncStatus(error ? {
      tone: "error",
      text: `退出失败：${error.message}`
    } : {
      tone: "local",
      text: "已退出，当前仅保存到本机。"
    });
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
  }, "Reverse Finder"), React.createElement("h2", null, "\u70B9\u6309\u548C\u5F26\u56FE\uFF0C\u8BC6\u522B\u53EF\u80FD\u548C\u5F26")), React.createElement("span", {
    className: "hint"
  }, "\u4E0A\u65B9\u9009 x \u6216\u7A7A\u5F26\uFF0C\u56FE\u4E2D\u70B9\u54C1\u4F4D\uFF1B\u53EF\u5207\u6362\u4E0D\u540C\u628A\u4F4D\u3002")), React.createElement("div", {
    className: "reverse-layout"
  }, React.createElement("div", {
    className: "reverse-input"
  }, React.createElement(ChordInputDiagram, {
    baseFret: editorBaseFret,
    values: fretValues,
    onBaseFretChange: setEditorBaseFret,
    onStringValueChange: setStringValue
  }), React.createElement("div", {
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
    onClick: () => setExampleFrets(example.frets)
  }, example.label, ": ", example.frets.join(" "))), React.createElement("button", {
    className: "chip",
    onClick: resetEditor
  }, "\u6E05\u7A7A")), React.createElement("button", {
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
    className: "ghost-button add-button",
    onClick: createSection
  }, "\u6DFB\u52A0\u6BB5\u843D"), React.createElement("button", {
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
  }, "\u6E05\u7A7A\u6BB5\u843D"))), React.createElement("input", {
    ref: importInputRef,
    className: "hidden-file-input",
    type: "file",
    accept: "application/json,.json",
    onChange: importChart,
    "aria-label": "\u5BFC\u5165\u66F2\u8C31 JSON"
  }), React.createElement("div", {
    className: "sync-card"
  }, React.createElement("div", {
    className: "sync-state"
  }, React.createElement("span", {
    className: `sync-dot ${syncStatus.tone}`,
    "aria-hidden": "true"
  }), React.createElement("div", null, React.createElement("strong", null, syncUser ? syncUser.email || "已登录" : "云同步"), React.createElement("p", null, syncStatus.text))), React.createElement("div", {
    className: "sync-controls"
  }, syncConfigured && !syncUser ? React.createElement("div", {
    className: "sync-auth-panel"
  }, React.createElement("div", {
    className: "sync-login-fields"
  }, React.createElement("input", {
    className: "text-field sync-email",
    type: "email",
    value: syncEmail,
    onChange: event => setSyncEmail(event.target.value),
    placeholder: "\u90AE\u7BB1",
    "aria-label": "\u4E91\u540C\u6B65\u767B\u5F55\u90AE\u7BB1"
  }), React.createElement("input", {
    className: "text-field sync-password",
    type: "password",
    value: syncPassword,
    onChange: event => setSyncPassword(event.target.value),
    onKeyDown: event => {
      if (event.key === "Enter") signInWithPassword();
    },
    placeholder: "\u5BC6\u7801",
    "aria-label": "\u4E91\u540C\u6B65\u767B\u5F55\u5BC6\u7801"
  })), React.createElement("div", {
    className: "sync-auth-actions"
  }, React.createElement("button", {
    className: "ghost-button add-button",
    onClick: signInWithPassword
  }, "\u5BC6\u7801\u767B\u5F55"), React.createElement("button", {
    className: "ghost-button",
    onClick: signUpWithPassword
  }, "\u6CE8\u518C"), React.createElement("button", {
    className: "ghost-button",
    onClick: resendSignupConfirmation
  }, "\u91CD\u53D1\u786E\u8BA4"), React.createElement("button", {
    className: "ghost-button",
    onClick: sendLoginLink
  }, "\u90AE\u7BB1\u94FE\u63A5"))) : null, syncUser ? React.createElement("button", {
    className: "ghost-button",
    onClick: signOutSync
  }, "\u9000\u51FA") : null, React.createElement("button", {
    className: "ghost-button",
    onClick: () => {
      setSyncConfigDraft(supabaseConfig);
      setShowSyncSettings(value => !value);
    }
  }, "\u8BBE\u7F6E")), showSyncSettings || !syncConfigured ? React.createElement("div", {
    className: "sync-settings"
  }, React.createElement("input", {
    className: "text-field",
    value: syncConfigDraft.url,
    onChange: event => setSyncConfigDraft(config => ({
      ...config,
      url: event.target.value
    })),
    placeholder: "Supabase Project URL",
    "aria-label": "Supabase Project URL"
  }), React.createElement("input", {
    className: "text-field",
    value: syncConfigDraft.anonKey,
    onChange: event => setSyncConfigDraft(config => ({
      ...config,
      anonKey: event.target.value
    })),
    placeholder: "Supabase anon \u6216 publishable key",
    "aria-label": "Supabase anon \u6216 publishable key"
  }), React.createElement("div", {
    className: "sync-setting-actions"
  }, React.createElement("button", {
    className: "ghost-button add-button",
    onClick: saveSyncSettings
  }, "\u4FDD\u5B58\u8BBE\u7F6E"), React.createElement("button", {
    className: "ghost-button danger-button",
    onClick: clearSyncSettings
  }, "\u6E05\u9664"))) : null), React.createElement("div", {
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
  }, chart.title || "未命名曲谱", " (", flattenSections(chart.sections || []).length, ")")))), React.createElement("span", {
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
  }, "\u66F2\u8C31\u5E93\u4F1A\u81EA\u52A8\u4FDD\u5B58\u5230\u5F53\u524D\u6D4F\u89C8\u5668\uFF1B\u767B\u5F55\u4E91\u540C\u6B65\u540E\uFF0C\u4F1A\u5728\u540C\u4E00\u8D26\u53F7\u7684\u8BBE\u5907\u95F4\u5408\u5E76\u4FDD\u5B58\u3002"), React.createElement("div", {
    className: "chart-sections",
    "aria-label": "\u66F2\u8C31\u6BB5\u843D"
  }, chartSections.map(section => React.createElement(ChartSection, {
    section: section,
    active: section.id === activeChart.activeSectionId,
    key: section.id,
    onSelect: () => selectSection(section.id),
    onRename: title => renameSection(section.id, title),
    onDelete: () => deleteSection(section.id),
    onDropAt: index => handleChartDrop(section.id, index),
    onDragOverAtEnd: () => markChartDropTarget(section.id, section.items.length),
    isDragging: Boolean(draggedChord),
    isDropAtEnd: dragTarget?.sectionId === section.id && dragTarget?.index === section.items.length
  }, section.items.map((item, index) => React.createElement(ChartItem, {
    item: item,
    key: item.id,
    isDragging: draggedChord?.itemId === item.id,
    isDropTarget: draggedChord?.itemId !== item.id && dragTarget?.sectionId === section.id && dragTarget?.index === index,
    onDragStart: () => {
      selectSection(section.id);
      setDraggedChord({
        sectionId: section.id,
        itemId: item.id
      });
      setDragTarget(null);
    },
    onDragOverBefore: () => markChartDropTarget(section.id, index),
    onDragEnd: clearChartDrag,
    onDropBefore: () => handleChartDrop(section.id, index),
    onDuplicate: () => duplicateSectionItem(section.id, item.id),
    onRemove: () => removeSectionItem(section.id, item.id),
    onUse: frets => useShape(frets)
  }))))), chartMessage ? React.createElement("p", {
    className: "chart-message"
  }, chartMessage) : null)), React.createElement("p", {
    className: "footer-note"
  }, "MVP \u91C7\u7528\u6807\u51C6\u8C03\u5F26\u548C\u5341\u4E8C\u5E73\u5747\u5F8B\u505A\u8BC6\u522B\u3002\u5B9E\u9645\u97F3\u4E50\u8BED\u5883\u4F1A\u5F71\u54CD\u547D\u540D\uFF0C\u4F8B\u5982\u540C\u4E00\u7EC4\u97F3\u53EF\u80FD\u540C\u65F6\u5BF9\u5E94 Am7 \u4E0E C6\u3002")));
}
function ChordInputDiagram({
  baseFret,
  values,
  onBaseFretChange,
  onStringValueChange
}) {
  const parsedValues = values.map(parseFret);
  const fretRows = Array.from({
    length: 5
  }, (_, index) => baseFret + index);
  const quickPositions = [1, 3, 5, 7, 9, 12];
  const strings = TUNING.map((string, index) => ({
    ...string,
    index,
    x: 8 + index * 16.8
  }));
  const frets = fretRows.map((fret, index) => ({
    fret,
    y: 16 + index * 17
  }));
  const boardX = percent => `calc(48px + (100% - 66px) * ${percent / 100})`;
  const boardY = percent => `calc(28px + (100% - 82px) * ${percent / 100})`;
  function moveBase(delta) {
    onBaseFretChange(Math.max(1, Math.min(20, baseFret + delta)));
  }
  function toggleMute(index) {
    onStringValueChange(index, parsedValues[index] === null ? 0 : null);
  }
  return React.createElement("div", {
    className: "fretboard-editor"
  }, React.createElement("div", {
    className: "fretboard-toolbar"
  }, React.createElement("div", null, React.createElement("span", {
    className: "eyebrow"
  }, "Chord Input"), React.createElement("h3", null, "\u70B9\u51FB\u548C\u5F26\u56FE\u8F93\u5165\u6309\u6CD5")), React.createElement("div", {
    className: "position-control",
    "aria-label": "\u9009\u62E9\u628A\u4F4D"
  }, React.createElement("button", {
    className: "ghost-button",
    onClick: () => moveBase(-1)
  }, "-"), React.createElement("span", null, baseFret, " \u628A\u4F4D"), React.createElement("button", {
    className: "ghost-button",
    onClick: () => moveBase(1)
  }, "+"))), React.createElement("div", {
    className: "position-chips"
  }, quickPositions.map(position => React.createElement("button", {
    className: position === baseFret ? "chip active-chip" : "chip",
    key: position,
    onClick: () => onBaseFretChange(position)
  }, position))), React.createElement("div", {
    className: "string-status-grid"
  }, TUNING.map((string, index) => React.createElement("div", {
    className: "string-status",
    key: `status-${string.label}`
  }, React.createElement("span", null, string.label, " ", string.note), React.createElement("button", {
    className: parsedValues[index] === null ? "mini-toggle active-mini" : "mini-toggle",
    onClick: () => toggleMute(index),
    title: parsedValues[index] === null ? "取消闷音，设为空弦" : "这根弦不弹"
  }, "x")))), React.createElement("div", {
    className: "click-fretboard",
    style: {
      "--fret-count": fretRows.length
    }
  }, React.createElement("svg", {
    className: "fretboard-lines",
    viewBox: "0 0 100 100",
    "aria-hidden": "true",
    preserveAspectRatio: "none"
  }, strings.map(string => React.createElement("line", {
    className: "input-string-line",
    x1: string.x,
    x2: string.x,
    y1: "7",
    y2: "93",
    key: string.label
  })), Array.from({
    length: fretRows.length + 1
  }).map((_, index) => {
    const y = 7 + index * 17;
    return React.createElement("line", {
      className: "input-fret-line",
      x1: "8",
      x2: "92",
      y1: y,
      y2: y,
      key: `fretline-${index}`
    });
  })), fretRows.map((fret, fretIndex) => React.createElement("span", {
    className: "fret-row-label",
    style: {
      top: boardY(7 + fretIndex * 17 + 8.5)
    },
    key: `label-${fret}`
  }, fret, "fr")), strings.map(string => frets.map(({
    fret,
    y
  }) => {
    const selected = parsedValues[string.index] === fret;
    return React.createElement("button", {
      className: selected ? "string-dot selected-fret" : "string-dot",
      key: `${string.label}-${fret}`,
      style: {
        left: boardX(string.x),
        top: boardY(y)
      },
      onClick: () => onStringValueChange(string.index, fret),
      "aria-label": `${string.label} ${string.note} 第 ${fret} 品`
    }, selected ? fret : "");
  })), React.createElement("div", {
    className: "open-string-row"
  }, strings.map(string => React.createElement("span", {
    className: parsedValues[string.index] === 0 ? "open-string active-open-string" : "open-string",
    key: string.label
  }, parsedValues[string.index] === null ? "x" : parsedValues[string.index] === 0 ? "空" : "")))));
}
function ChartSection({
  section,
  active,
  children,
  onSelect,
  onRename,
  onDelete,
  onDropAt,
  onDragOverAtEnd,
  isDragging,
  isDropAtEnd
}) {
  const sectionClass = ["chart-section", active ? "active-section" : "", isDragging ? "drag-aware-section" : "", isDropAtEnd ? "section-drop-target" : ""].filter(Boolean).join(" ");
  const sequenceClass = ["chart-sequence", isDropAtEnd ? "drop-at-end" : "", section.items.length ? "" : "empty-sequence"].filter(Boolean).join(" ");
  return React.createElement("section", {
    className: sectionClass,
    onClick: onSelect,
    onDragOver: event => {
      event.preventDefault();
      onDragOverAtEnd();
    },
    onDrop: event => {
      event.preventDefault();
      onDropAt(section.items.length);
    }
  }, React.createElement("div", {
    className: "chart-section-header"
  }, React.createElement("label", null, React.createElement("span", null, "\u6BB5\u843D"), React.createElement("input", {
    className: "section-title-input",
    value: section.title,
    onChange: event => onRename(event.target.value),
    onFocus: onSelect,
    "aria-label": `${section.title} 段落名称`
  })), React.createElement("div", {
    className: "section-meta"
  }, active ? React.createElement("span", {
    className: "active-section-pill"
  }, "\u52A0\u5165\u76EE\u6807") : null, React.createElement("span", null, section.items.length, " \u4E2A\u548C\u5F26"), React.createElement("button", {
    className: "icon-button danger-button",
    onClick: event => {
      event.stopPropagation();
      onDelete();
    },
    title: "\u5220\u9664\u6BB5\u843D"
  }, "x"))), React.createElement("div", {
    className: sequenceClass
  }, section.items.length ? children : React.createElement("div", {
    className: "section-empty"
  }, "\u628A\u548C\u5F26\u5361\u7247\u62D6\u5230\u8FD9\u91CC\uFF0C\u6216\u9009\u4E2D\u672C\u6BB5\u540E\u70B9\u201C\u52A0\u5165\u201D\u3002")));
}
function ChartItem({
  item,
  isDragging,
  isDropTarget,
  onDragStart,
  onDragOverBefore,
  onDragEnd,
  onDropBefore,
  onDuplicate,
  onRemove,
  onUse
}) {
  const cardClass = ["chart-card", isDragging ? "dragging-card" : "", isDropTarget ? "drop-before" : ""].filter(Boolean).join(" ");
  return React.createElement("article", {
    className: cardClass,
    draggable: "true",
    onDragStart: event => {
      event.dataTransfer.effectAllowed = "move";
      event.dataTransfer.setData("text/plain", item.id);
      onDragStart();
    },
    onDragEnd: onDragEnd,
    onDragEnter: event => {
      event.preventDefault();
      event.stopPropagation();
      onDragOverBefore();
    },
    onDragOver: event => {
      event.preventDefault();
      event.stopPropagation();
      onDragOverBefore();
    },
    onDrop: event => {
      event.preventDefault();
      event.stopPropagation();
      onDropBefore();
    }
  }, React.createElement("div", {
    className: "chart-card-main"
  }, React.createElement("h3", null, item.name), React.createElement("div", {
    className: "chart-diagram-wrap"
  }, React.createElement(ChordDiagram, {
    shape: item.frets,
    root: item.root,
    startAtLowestFret: true
  }))), React.createElement("div", {
    className: "chart-card-actions"
  }, React.createElement("button", {
    className: "icon-button",
    onClick: () => onUse(item.frets),
    title: "\u5E26\u5165\u8BC6\u522B"
  }, "\u8BC6\u522B"), React.createElement("button", {
    className: "icon-button",
    onClick: onDuplicate,
    title: "\u590D\u5236\u8FD9\u4E2A\u548C\u5F26"
  }, "\u590D\u5236"), React.createElement("button", {
    className: "icon-button danger-button",
    onClick: onRemove,
    title: "\u5220\u9664"
  }, "x")));
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
  root,
  startAtLowestFret = false
}) {
  const played = shape.filter(fret => fret !== null);
  const positive = played.filter(fret => fret > 0);
  const minPositive = positive.length ? Math.min(...positive) : 1;
  const maxFret = played.length ? Math.max(...played) : 4;
  let firstFret = minPositive;
  if (startAtLowestFret && minPositive > 1) {
    firstFret = minPositive;
  } else if (played.some(fret => fret === 0) || minPositive <= 1) {
    firstFret = 1;
  }
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