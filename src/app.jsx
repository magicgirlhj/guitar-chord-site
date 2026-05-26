const { useEffect, useMemo, useRef, useState } = React;

const TUNING = [
  { label: "6弦", note: "E", pc: 4 },
  { label: "5弦", note: "A", pc: 9 },
  { label: "4弦", note: "D", pc: 2 },
  { label: "3弦", note: "G", pc: 7 },
  { label: "2弦", note: "B", pc: 11 },
  { label: "1弦", note: "e", pc: 4 },
];

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
  CB: 11,
};

const QUALITIES = {
  major: {
    label: "大三和弦",
    symbol: "",
    intervals: [0, 4, 7],
  },
  minor: {
    label: "小三和弦",
    symbol: "m",
    intervals: [0, 3, 7],
  },
  dominant7: {
    label: "属七和弦",
    symbol: "7",
    intervals: [0, 4, 7, 10],
  },
  major7: {
    label: "大七和弦",
    symbol: "maj7",
    intervals: [0, 4, 7, 11],
  },
  minor7: {
    label: "小七和弦",
    symbol: "m7",
    intervals: [0, 3, 7, 10],
  },
  dim: {
    label: "减三和弦",
    symbol: "dim",
    intervals: [0, 3, 6],
  },
  dim7: {
    label: "减七和弦",
    symbol: "dim7",
    intervals: [0, 3, 6, 9],
  },
  m7b5: {
    label: "半减七和弦",
    symbol: "m7b5",
    intervals: [0, 3, 6, 10],
  },
  aug: {
    label: "增三和弦",
    symbol: "aug",
    intervals: [0, 4, 8],
  },
  sus2: {
    label: "挂二和弦",
    symbol: "sus2",
    intervals: [0, 2, 7],
  },
  sus4: {
    label: "挂四和弦",
    symbol: "sus4",
    intervals: [0, 5, 7],
  },
  add9: {
    label: "加九和弦",
    symbol: "add9",
    intervals: [0, 2, 4, 7],
  },
  six: {
    label: "六和弦",
    symbol: "6",
    intervals: [0, 4, 7, 9],
  },
  minor6: {
    label: "小六和弦",
    symbol: "m6",
    intervals: [0, 3, 7, 9],
  },
  nine: {
    label: "九和弦",
    symbol: "9",
    intervals: [0, 2, 4, 7, 10],
  },
  minor9: {
    label: "小九和弦",
    symbol: "m9",
    intervals: [0, 2, 3, 7, 10],
  },
  power: {
    label: "五和弦",
    symbol: "5",
    intervals: [0, 7],
  },
};

const QUALITY_ORDER = [
  "major",
  "minor",
  "dominant7",
  "major7",
  "minor7",
  "six",
  "minor6",
  "nine",
  "minor9",
  "add9",
  "sus2",
  "sus4",
  "dim",
  "dim7",
  "m7b5",
  "aug",
  "power",
];

const TEMPLATE_SHAPES = {
  major: [
    { base: 0, form: "C 型", frets: [null, 3, 2, 0, 1, 0] },
    { base: 9, form: "A 型", frets: [null, 0, 2, 2, 2, 0] },
    { base: 7, form: "G 型", frets: [3, 2, 0, 0, 0, 3] },
    { base: 4, form: "E 型", frets: [0, 2, 2, 1, 0, 0] },
    { base: 2, form: "D 型", frets: [null, null, 0, 2, 3, 2] },
  ],
  minor: [
    { base: 9, form: "A 小型", frets: [null, 0, 2, 2, 1, 0] },
    { base: 4, form: "E 小型", frets: [0, 2, 2, 0, 0, 0] },
    { base: 2, form: "D 小型", frets: [null, null, 0, 2, 3, 1] },
    { base: 0, form: "C 小型", frets: [null, 3, 5, 5, 4, 3] },
    { base: 7, form: "G 小型", frets: [3, 5, 5, 3, 3, 3] },
  ],
  dominant7: [
    { base: 0, form: "C7 型", frets: [null, 3, 2, 3, 1, 0] },
    { base: 9, form: "A7 型", frets: [null, 0, 2, 0, 2, 0] },
    { base: 7, form: "G7 型", frets: [3, 2, 0, 0, 0, 1] },
    { base: 4, form: "E7 型", frets: [0, 2, 0, 1, 0, 0] },
    { base: 2, form: "D7 型", frets: [null, null, 0, 2, 1, 2] },
  ],
  major7: [
    { base: 0, form: "Cmaj7 型", frets: [null, 3, 2, 0, 0, 0] },
    { base: 9, form: "Amaj7 型", frets: [null, 0, 2, 1, 2, 0] },
    { base: 7, form: "Gmaj7 型", frets: [3, 2, 0, 0, 0, 2] },
    { base: 4, form: "Emaj7 型", frets: [0, 2, 1, 1, 0, 0] },
    { base: 2, form: "Dmaj7 型", frets: [null, null, 0, 2, 2, 2] },
  ],
  minor7: [
    { base: 9, form: "Am7 型", frets: [null, 0, 2, 0, 1, 0] },
    { base: 4, form: "Em7 型", frets: [0, 2, 0, 0, 0, 0] },
    { base: 2, form: "Dm7 型", frets: [null, null, 0, 2, 1, 1] },
    { base: 0, form: "Cm7 型", frets: [null, 3, 5, 3, 4, 3] },
    { base: 7, form: "Gm7 型", frets: [3, 5, 3, 3, 3, 3] },
  ],
  sus2: [
    { base: 9, form: "Asus2 型", frets: [null, 0, 2, 2, 0, 0] },
    { base: 2, form: "Dsus2 型", frets: [null, null, 0, 2, 3, 0] },
    { base: 4, form: "Esus2 型", frets: [0, 2, 4, 4, 0, 0] },
  ],
  sus4: [
    { base: 9, form: "Asus4 型", frets: [null, 0, 2, 2, 3, 0] },
    { base: 2, form: "Dsus4 型", frets: [null, null, 0, 2, 3, 3] },
    { base: 4, form: "Esus4 型", frets: [0, 2, 2, 2, 0, 0] },
  ],
  add9: [
    { base: 0, form: "Cadd9 型", frets: [null, 3, 2, 0, 3, 0] },
    { base: 9, form: "Aadd9 型", frets: [null, 0, 2, 4, 2, 0] },
    { base: 4, form: "Eadd9 型", frets: [0, 2, 4, 1, 0, 0] },
  ],
  six: [
    { base: 0, form: "C6 型", frets: [null, 3, 2, 2, 1, 0] },
    { base: 9, form: "A6 型", frets: [null, 0, 2, 2, 2, 2] },
    { base: 4, form: "E6 型", frets: [0, 2, 2, 1, 2, 0] },
  ],
  minor6: [
    { base: 9, form: "Am6 型", frets: [null, 0, 2, 2, 1, 2] },
    { base: 4, form: "Em6 型", frets: [0, 2, 2, 0, 2, 0] },
    { base: 2, form: "Dm6 型", frets: [null, null, 0, 2, 0, 1] },
  ],
  dim: [
    { base: 0, form: "Cdim 型", frets: [null, 3, 4, 2, 4, null] },
    { base: 2, form: "Ddim 型", frets: [null, null, 0, 1, 0, 1] },
    { base: 6, form: "F#dim 型", frets: [2, 3, 4, 2, 4, 2] },
  ],
  dim7: [
    { base: 0, form: "Cdim7 型", frets: [null, 3, 4, 2, 4, 2] },
    { base: 2, form: "Ddim7 型", frets: [null, null, 0, 1, 0, 1] },
    { base: 6, form: "F#dim7 型", frets: [2, 3, 4, 2, 4, 2] },
  ],
  m7b5: [
    { base: 1, form: "Bm7b5 型", frets: [null, 2, 3, 2, 3, null] },
    { base: 4, form: "Em7b5 型", frets: [null, null, 2, 3, 3, 3] },
    { base: 9, form: "Am7b5 型", frets: [5, null, 5, 5, 4, null] },
  ],
  aug: [
    { base: 0, form: "Caug 型", frets: [null, 3, 2, 1, 1, 0] },
    { base: 4, form: "Eaug 型", frets: [0, 3, 2, 1, 1, 0] },
    { base: 7, form: "Gaug 型", frets: [3, 2, 1, 0, 0, 3] },
  ],
  nine: [
    { base: 0, form: "C9 型", frets: [null, 3, 2, 3, 3, 3] },
    { base: 4, form: "E9 型", frets: [0, 2, 0, 1, 0, 2] },
    { base: 9, form: "A9 型", frets: [null, 0, 2, 4, 2, 3] },
  ],
  minor9: [
    { base: 9, form: "Am9 型", frets: [null, 0, 5, 5, 5, 7] },
    { base: 4, form: "Em9 型", frets: [0, 2, 0, 0, 0, 2] },
    { base: 2, form: "Dm9 型", frets: [null, null, 0, 2, 1, 0] },
  ],
  power: [
    { base: 4, form: "E5 型", frets: [0, 2, 2, null, null, null] },
    { base: 9, form: "A5 型", frets: [null, 0, 2, 2, null, null] },
    { base: 2, form: "D5 型", frets: [null, null, 0, 2, 3, null] },
  ],
};

const EXAMPLE_CHORDS = ["C", "Am", "G7", "Fmaj7", "Bb", "Dadd9", "Bm7b5", "E9"];
const FRET_EXAMPLES = [
  { label: "C", frets: ["x", "3", "2", "0", "1", "0"] },
  { label: "Em", frets: ["0", "2", "2", "0", "0", "0"] },
  { label: "G", frets: ["3", "2", "0", "0", "0", "3"] },
  { label: "Am7", frets: ["x", "0", "2", "0", "1", "0"] },
  { label: "F", frets: ["1", "3", "3", "2", "1", "1"] },
];
const CHART_STORAGE_KEY = "guitar-chord-chart-sequence-v1";
const DEFAULT_SECTION_TITLE = "前奏";

function mod(value, size = 12) {
  return ((value % size) + size) % size;
}

function noteName(pc, preferFlats = false) {
  return (preferFlats ? FLAT_NAMES : SHARP_NAMES)[mod(pc)];
}

function compactShape(frets) {
  return frets.map((fret) => (fret === null ? "x" : String(fret))).join(" ");
}

function parseChordName(value) {
  const raw = value.trim().replace(/\s+/g, "");

  if (!raw) {
    return { ok: false, message: "请输入一个和弦名，例如 C、Am、F#7 或 Bbmaj7。" };
  }

  const match = raw.match(/^([A-Ga-g])([#b♭]?)(.*)$/);

  if (!match) {
    return { ok: false, message: "和弦名需要以 A-G 开头，可带 # 或 b。" };
  }

  const letter = match[1].toUpperCase();
  const accidental = match[2] === "♭" ? "b" : match[2];
  const rootKey = `${letter}${accidental}`.toUpperCase();
  const root = NOTE_ALIASES[rootKey];

  if (root === undefined) {
    return { ok: false, message: "暂时无法识别这个根音。" };
  }

  const qualityText = match[3].replace("△", "maj").replace("Δ", "maj");
  const lower = qualityText.toLowerCase();
  const key = normalizeQuality(lower, qualityText);

  if (!key) {
    return {
      ok: false,
      message: `暂不支持 “${qualityText || "(空)"}” 这个和弦后缀。可试 C、Cm、C7、Cmaj7、Csus4、Cadd9。`,
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
    displayName: `${noteName(root, preferFlats)}${definition.symbol}`,
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
  return intervals.map((interval) => mod(root + interval));
}

function templateVoicings(parsed) {
  const templates = TEMPLATE_SHAPES[parsed.qualityKey] || [];

  return templates
    .map((template) => {
      const shift = mod(parsed.root - template.base);
      const frets = template.frets.map((fret) => (fret === null ? null : fret + shift));

      return {
        frets,
        form: template.form,
        source: "template",
        name: shapePositionName(frets),
      };
    })
    .filter((shape) => {
      const played = shape.frets.filter((fret) => fret !== null);
      const maxFret = Math.max(...played);
      const minFret = Math.min(...played.filter((fret) => fret > 0));
      return maxFret <= 15 && (Number.isFinite(minFret) ? maxFret - minFret <= 5 : true);
    });
}

function generatedVoicings(parsed) {
  const expected = new Set(pitchClassesForChord(parsed.root, parsed.definition.intervals));
  const windows = [0, 1, 2, 3, 4, 5, 7, 9, 12];
  const results = [];

  windows.forEach((start) => {
    const low = start === 0 ? 0 : start;
    const high = start === 0 ? 4 : start + 4;
    const optionsByString = TUNING.map((string) => {
      const options = [null];

      for (let fret = low; fret <= high; fret += 1) {
        if (expected.has(mod(string.pc + fret))) {
          options.push(fret);
        }
      }

      return options;
    });

    walkOptions(optionsByString, 0, [], (frets) => {
      const played = frets.filter((fret) => fret !== null);

      if (played.length < (parsed.qualityKey === "power" ? 2 : 3)) return;

      const pcs = new Set(
        frets
          .map((fret, index) => (fret === null ? null : mod(TUNING[index].pc + fret)))
          .filter((pc) => pc !== null)
      );
      const covered = [...expected].filter((pc) => pcs.has(pc)).length;

      if (!pcs.has(parsed.root)) return;
      if (covered < Math.min(3, expected.size)) return;

      const positive = played.filter((fret) => fret > 0);
      const maxFret = Math.max(...played);
      const minFret = Math.min(...positive);
      const span = positive.length ? maxFret - minFret : 0;

      if (span > 4 || maxFret > 15) return;

      const bassIndex = frets.findIndex((fret) => fret !== null);
      const bassPc = mod(TUNING[bassIndex].pc + frets[bassIndex]);
      const openCount = played.filter((fret) => fret === 0).length;
      const mutedCount = frets.filter((fret) => fret === null).length;
      const score =
        covered * 16 +
        played.length * 3 +
        (bassPc === parsed.root ? 12 : 0) +
        openCount * 2 -
        mutedCount * 1.2 -
        span * 2 -
        maxFret * 0.45;

      results.push({
        frets,
        form: "生成把位",
        source: "generated",
        name: shapePositionName(frets),
        score,
      });
    });
  });

  return results
    .sort((a, b) => b.score - a.score)
    .slice(0, 60);
}

function walkOptions(optionsByString, index, current, onDone) {
  if (index === optionsByString.length) {
    onDone(current);
    return;
  }

  optionsByString[index].forEach((option) => {
    walkOptions(optionsByString, index + 1, [...current, option], onDone);
  });
}

function getVoicings(parsed) {
  const combined = [...templateVoicings(parsed), ...generatedVoicings(parsed)];
  const seen = new Set();
  const unique = combined
    .filter((shape) => {
      const key = compactShape(shape.frets);

      if (seen.has(key)) return false;
      seen.add(key);
      return true;
    });
  const openShapes = unique
    .filter((shape) => shapeStats(shape.frets).isOpen)
    .sort((a, b) => shapeRank(a) - shapeRank(b))
    .slice(0, 1);
  const movableShapes = unique
    .filter((shape) => !shapeStats(shape.frets).isOpen)
    .sort(compareMovableShapes);
  const spread = [];
  const countByStart = new Map();

  movableShapes.forEach((shape) => {
    if (spread.length >= 15) return;

    const start = shapeStats(shape.frets).startFret;
    const count = countByStart.get(start) || 0;

    if (count >= 2) return;

    spread.push(shape);
    countByStart.set(start, count + 1);
  });

  movableShapes.forEach((shape) => {
    if (spread.length >= 15 || spread.includes(shape)) return;
    spread.push(shape);
  });

  return [...openShapes, ...spread].slice(0, 16);
}

function shapeRank(shape) {
  const { maxFret, openCount, span, mutedCount } = shapeStats(shape.frets);
  const templateBias = shape.source === "template" ? -8 : 0;
  return templateBias + maxFret * 1.1 + span * 2 - openCount * 1.7 + mutedCount;
}

function compareMovableShapes(a, b) {
  const aStats = shapeStats(a.frets);
  const bStats = shapeStats(b.frets);
  const templateBias = (a.source === "template" ? -1 : 0) - (b.source === "template" ? -1 : 0);

  return (
    aStats.startFret - bStats.startFret ||
    templateBias ||
    aStats.span - bStats.span ||
    b.frets.filter((fret) => fret !== null).length - a.frets.filter((fret) => fret !== null).length ||
    (b.score || 0) - (a.score || 0)
  );
}

function shapeStats(frets) {
  const played = frets.filter((fret) => fret !== null);
  const positive = played.filter((fret) => fret > 0);
  const maxFret = played.length ? Math.max(...played) : 0;
  const minPositive = positive.length ? Math.min(...positive) : 0;

  return {
    isOpen: played.some((fret) => fret === 0),
    startFret: minPositive || 0,
    maxFret,
    span: positive.length ? maxFret - minPositive : 0,
    openCount: played.filter((fret) => fret === 0).length,
    mutedCount: frets.filter((fret) => fret === null).length,
  };
}

function shapePositionName(frets) {
  const played = frets.filter((fret) => fret !== null);
  const positive = played.filter((fret) => fret > 0);

  if (played.some((fret) => fret === 0)) {
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

  if (frets.some((fret) => fret === undefined)) {
    return {
      error: "品位请输入 0-24 的数字，或用 x 表示闷音。",
      notes: [],
      results: [],
    };
  }

  const sounding = frets
    .map((fret, index) =>
      fret === null
        ? null
        : {
            string: TUNING[index],
            fret,
            pc: mod(TUNING[index].pc + fret),
          }
    )
    .filter(Boolean);

  if (sounding.length < 2) {
    return {
      error: "至少输入两根有声弦，识别结果会更可靠。",
      notes: sounding,
      results: [],
    };
  }

  const uniquePcs = [...new Set(sounding.map((note) => note.pc))];
  const bassPc = sounding[0].pc;
  const results = [];

  for (let root = 0; root < 12; root += 1) {
    QUALITY_ORDER.forEach((qualityKey) => {
      const definition = QUALITIES[qualityKey];
      const expected = new Set(pitchClassesForChord(root, definition.intervals));
      const matched = uniquePcs.filter((pc) => expected.has(pc));
      const extra = uniquePcs.filter((pc) => !expected.has(pc));
      const missing = [...expected].filter((pc) => !uniquePcs.includes(pc));
      const hasThird =
        expected.has(mod(root + 3)) || expected.has(mod(root + 4)) || ["sus2", "sus4", "power"].includes(qualityKey);

      if (matched.length < Math.min(2, expected.size)) return;
      if (extra.length > 1) return;
      if (missing.length > 2) return;

      let score =
        (matched.length / expected.size) * 54 +
        ((uniquePcs.length - extra.length) / uniquePcs.length) * 30 +
        (uniquePcs.includes(root) ? 8 : -10) +
        (bassPc === root ? 8 : 0) -
        missing.length * 4 -
        extra.length * 8 +
        (hasThird ? 3 : -5);

      if (qualityKey === "power" && uniquePcs.length > 2) score -= 10;
      if (definition.intervals.length > uniquePcs.length + 2) score -= 8;

      if (score < 42) return;

      const preferFlats = [1, 3, 6, 8, 10].includes(root) && uniquePcs.some((pc) => FLAT_NAMES[pc].includes("b"));
      const rootLabel = noteName(root, preferFlats);
      const slash = bassPc !== root ? `/${noteName(bassPc, preferFlats)}` : "";

      results.push({
        key: `${root}-${qualityKey}-${slash}`,
        name: `${rootLabel}${definition.symbol}${slash}`,
        label: definition.label,
        confidence: Math.max(0, Math.min(99, Math.round(score))),
        missing: missing.map((pc) => noteName(pc, preferFlats)),
        extra: extra.map((pc) => noteName(pc, preferFlats)),
        matched: matched.map((pc) => noteName(pc, preferFlats)),
      });
    });
  }

  return {
    error: null,
    notes: sounding,
    results: dedupeResults(results)
      .sort((a, b) => b.confidence - a.confidence)
      .slice(0, 8),
  };
}

function dedupeResults(results) {
  const seen = new Set();

  return results.filter((result) => {
    if (seen.has(result.name)) return false;
    seen.add(result.name);
    return true;
  });
}

function createId(prefix = "id") {
  return `${prefix}-${Date.now()}-${Math.random().toString(16).slice(2)}`;
}

function normalizeChartItem(item = {}) {
  const frets = Array.isArray(item.frets)
    ? item.frets
        .map((fret) => {
          if (fret === null) return null;
          const parsed = Number.parseInt(fret, 10);
          return Number.isFinite(parsed) ? parsed : null;
        })
        .slice(0, 6)
    : ["x", "x", "x", "x", "x", "x"].map(parseFret);

  while (frets.length < 6) frets.push(null);

  const name = item.name || "未知和弦";

  return {
    id: item.id || `${Date.now()}-${Math.random().toString(16).slice(2)}`,
    name,
    frets,
    root: Number.isInteger(item.root) ? item.root : rootFromChordName(name),
    shape: item.shape || compactShape(frets),
    position: item.position || shapePositionName(frets),
    source: item.source || "曲谱记录",
  };
}

function normalizeChartSection(section = {}, index = 0) {
  return {
    id: section.id || createId("section"),
    title: section.title || (index === 0 ? DEFAULT_SECTION_TITLE : `段落 ${index + 1}`),
    items: Array.isArray(section.items) ? section.items.map(normalizeChartItem) : [],
  };
}

function createEmptySection(title = DEFAULT_SECTION_TITLE) {
  return normalizeChartSection({ title, items: [] });
}

function normalizeChart(chart = {}, fallbackTitle = "未命名曲谱") {
  const sections = Array.isArray(chart.sections)
    ? chart.sections.map(normalizeChartSection)
    : [normalizeChartSection({ title: DEFAULT_SECTION_TITLE, items: chart.items || [] })];
  const safeSections = sections.length ? sections : [createEmptySection()];
  const activeSectionId = safeSections.some((section) => section.id === chart.activeSectionId)
    ? chart.activeSectionId
    : safeSections[0].id;

  return {
    id: chart.id || createId("chart"),
    title: chart.title || fallbackTitle,
    activeSectionId,
    sections: safeSections,
    updatedAt: chart.updatedAt || Date.now(),
  };
}

function normalizeChartLibrary(parsed) {
  if (Array.isArray(parsed)) {
    const chart = normalizeChart({ title: "未命名曲谱", items: parsed });
    return { activeChartId: chart.id, charts: [chart] };
  }

  if (parsed && Array.isArray(parsed.charts)) {
    const charts = parsed.charts.map((chart, index) => normalizeChart(chart, `曲谱 ${index + 1}`));
    const activeChartId = charts.some((chart) => chart.id === parsed.activeChartId)
      ? parsed.activeChartId
      : charts[0]?.id;

    return charts.length ? { activeChartId, charts } : createDefaultLibrary();
  }

  if (parsed && Array.isArray(parsed.items)) {
    const chart = normalizeChart(parsed);
    return { activeChartId: chart.id, charts: [chart] };
  }

  return createDefaultLibrary();
}

function createDefaultLibrary() {
  const chart = normalizeChart({ title: "未命名曲谱", items: [] });
  return { activeChartId: chart.id, charts: [chart] };
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

  const rows = items
    .map((item, index) => `${index + 1}. ${item.name}  ${item.shape}  ${item.position}`)
    .join("\n");

  return `${title || "未命名曲谱"}\n${rows}`;
}

function chartSectionsToText(title, sections) {
  const populated = sections.filter((section) => section.items.length);

  if (!populated.length) return "";

  return `${title || "未命名曲谱"}\n${populated
    .map(
      (section) =>
        `\n[${section.title}]\n${section.items
          .map((item, index) => `${index + 1}. ${item.name}  ${item.shape}  ${item.position}`)
          .join("\n")}`
    )
    .join("\n")}`;
}

function flattenSections(sections = []) {
  return (Array.isArray(sections) ? sections : []).flatMap((section) =>
    Array.isArray(section?.items) ? section.items : []
  );
}

function App() {
  const [chordQuery, setChordQuery] = useState("C");
  const [fretValues, setFretValues] = useState(["x", "3", "2", "0", "1", "0"]);
  const [editorBaseFret, setEditorBaseFret] = useState(1);
  const [draggedChord, setDraggedChord] = useState(null);
  const [dragTarget, setDragTarget] = useState(null);
  const [chartLibrary, setChartLibrary] = useState(loadChartLibrary);
  const [chartMessage, setChartMessage] = useState("");
  const importInputRef = useRef(null);
  const activeChart =
    chartLibrary.charts.find((chart) => chart.id === chartLibrary.activeChartId) || chartLibrary.charts[0];
  const chartTitle = activeChart.title;
  const chartSections = activeChart.sections;
  const activeSection =
    chartSections.find((section) => section.id === activeChart.activeSectionId) || chartSections[0];
  const chartItems = flattenSections(chartSections);
  const parsedChord = useMemo(() => parseChordName(chordQuery), [chordQuery]);
  const voicings = useMemo(() => (parsedChord.ok ? getVoicings(parsedChord) : []), [parsedChord]);
  const recognition = useMemo(() => identifyChord(fretValues), [fretValues]);

  useEffect(() => {
    window.localStorage.setItem(CHART_STORAGE_KEY, JSON.stringify(chartLibrary));
  }, [chartLibrary]);

  function updateActiveChart(updater) {
    setChartLibrary((library) => ({
      ...library,
      charts: library.charts.map((chart) =>
        chart.id === library.activeChartId
          ? {
              ...chart,
              ...(typeof updater === "function" ? updater(chart) : updater),
              updatedAt: Date.now(),
            }
          : chart
      ),
    }));
  }

  function setChartTitle(title) {
    updateActiveChart({ title });
  }

  function setChartItems(updater) {
    updateActiveSectionItems(updater);
  }

  function updateChartSections(updater) {
    updateActiveChart((chart) => ({
      sections: typeof updater === "function" ? updater(chart.sections) : updater,
    }));
  }

  function updateActiveSectionItems(updater) {
    updateActiveChart((chart) => ({
      sections: chart.sections.map((section) =>
        section.id === chart.activeSectionId
          ? {
              ...section,
              items: typeof updater === "function" ? updater(section.items) : updater,
            }
          : section
      ),
    }));
  }

  function selectChart(id) {
    setChartLibrary((library) => ({ ...library, activeChartId: id }));
    const chart = chartLibrary.charts.find((item) => item.id === id);
    setChartMessage(chart ? `已切换：${chart.title}` : "");
  }

  function createChart() {
    const chart = normalizeChart({
      title: `新曲谱 ${chartLibrary.charts.length + 1}`,
      sections: [createEmptySection()],
    });

    setChartLibrary((library) => ({
      activeChartId: chart.id,
      charts: [...library.charts, chart],
    }));
    setChartMessage(`已新建：${chart.title}`);
  }

  function deleteActiveChart() {
    setChartLibrary((library) => {
      if (library.charts.length <= 1) {
        const chart = normalizeChart({
          id: library.activeChartId,
          title: "未命名曲谱",
          sections: [createEmptySection()],
        });
        return { activeChartId: chart.id, charts: [chart] };
      }

      const activeIndex = library.charts.findIndex((chart) => chart.id === library.activeChartId);
      const charts = library.charts.filter((chart) => chart.id !== library.activeChartId);
      const nextActive = charts[Math.max(0, activeIndex - 1)] || charts[0];

      return { activeChartId: nextActive.id, charts };
    });
    setChartMessage("已删除当前曲谱。");
  }

  function useShape(frets) {
    setFretValues(frets.map((fret) => (fret === null ? "x" : String(fret))));
    const stats = shapeStats(frets);
    setEditorBaseFret(stats.isOpen || stats.startFret <= 1 ? 1 : stats.startFret);
    requestAnimationFrame(() => {
      document.querySelector(".reverse-panel")?.scrollIntoView({ behavior: "smooth", block: "start" });
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
      source,
    };

    setChartItems((items) => [...items, item]);
    setChartMessage(`已加入到「${activeSection.title}」：${name}`);
  }

  function addCurrentInputToChart() {
    const parsedFrets = fretValues.map(parseFret);

    if (parsedFrets.some((fret) => fret === undefined)) {
      setChartMessage("品位格式有误，暂时不能加入曲谱。");
      return;
    }

    if (parsedFrets.every((fret) => fret === null)) {
      setChartMessage("至少输入一根有声弦。");
      return;
    }

    const bestName = recognition.results[0]?.name || "未知和弦";
    addChartItem(bestName, parsedFrets, "手动输入", rootFromChordName(bestName));
  }

  function moveChartItem(id, direction) {
    setChartItems((items) => {
      const index = items.findIndex((item) => item.id === id);
      const nextIndex = index + direction;

      if (index < 0 || nextIndex < 0 || nextIndex >= items.length) return items;

      const next = [...items];
      const [item] = next.splice(index, 1);
      next.splice(nextIndex, 0, item);
      return next;
    });
  }

  function removeChartItem(id) {
    setChartItems((items) => items.filter((item) => item.id !== id));
  }

  function createSection() {
    const section = createEmptySection(`段落 ${chartSections.length + 1}`);

    updateActiveChart((chart) => ({
      activeSectionId: section.id,
      sections: [...chart.sections, section],
    }));
    setChartMessage(`已添加段落：${section.title}`);
  }

  function selectSection(sectionId) {
    updateActiveChart({ activeSectionId: sectionId });
  }

  function renameSection(sectionId, title) {
    updateChartSections((sections) =>
      sections.map((section) => (section.id === sectionId ? { ...section, title } : section))
    );
  }

  function deleteSection(sectionId) {
    updateActiveChart((chart) => {
      if (chart.sections.length <= 1) {
        return {
          activeSectionId: chart.sections[0].id,
          sections: [{ ...chart.sections[0], title: DEFAULT_SECTION_TITLE, items: [] }],
        };
      }

      const sectionIndex = chart.sections.findIndex((section) => section.id === sectionId);
      const sections = chart.sections.filter((section) => section.id !== sectionId);
      const activeSectionId =
        chart.activeSectionId === sectionId
          ? (sections[Math.max(0, sectionIndex - 1)] || sections[0]).id
          : chart.activeSectionId;

      return { activeSectionId, sections };
    });
    setChartMessage("已删除段落。");
  }

  function removeSectionItem(sectionId, itemId) {
    updateChartSections((sections) =>
      sections.map((section) =>
        section.id === sectionId
          ? { ...section, items: section.items.filter((item) => item.id !== itemId) }
          : section
      )
    );
  }

  function duplicateSectionItem(sectionId, itemId) {
    updateChartSections((sections) =>
      sections.map((section) => {
        if (section.id !== sectionId) return section;

        const index = section.items.findIndex((item) => item.id === itemId);
        if (index < 0) return section;

        const copy = {
          ...section.items[index],
          id: createId("chord"),
          source: `${section.items[index].source || "曲谱记录"} · 复制`,
        };
        const items = [...section.items];
        items.splice(index + 1, 0, copy);
        return { ...section, items };
      })
    );
    setChartMessage("已复制和弦卡片。");
  }

  function moveChartItemToSection(itemId, fromSectionId, toSectionId, toIndex) {
    updateChartSections((sections) => {
      let movingItem = null;
      let fromIndex = -1;
      const withoutItem = sections.map((section) => {
        if (section.id !== fromSectionId) return section;

        fromIndex = section.items.findIndex((item) => item.id === itemId);
        if (fromIndex < 0) return section;

        movingItem = section.items[fromIndex];
        return { ...section, items: section.items.filter((item) => item.id !== itemId) };
      });

      if (!movingItem) return sections;

      return withoutItem.map((section) => {
        if (section.id !== toSectionId) return section;

        const adjustedIndex =
          fromSectionId === toSectionId && fromIndex >= 0 && fromIndex < toIndex ? toIndex - 1 : toIndex;
        const insertIndex = Math.max(0, Math.min(adjustedIndex, section.items.length));
        const items = [...section.items];
        items.splice(insertIndex, 0, movingItem);
        return { ...section, items };
      });
    });
  }

  function markChartDropTarget(sectionId, index) {
    if (!draggedChord) return;

    setDragTarget((target) =>
      target?.sectionId === sectionId && target?.index === index ? target : { sectionId, index }
    );
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
    setFretValues((values) => {
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

    const payload = JSON.stringify(
      {
        version: 2,
        type: "guitar-chart",
        chart: activeChart,
      },
      null,
      2
    );
    const blob = new Blob([payload], { type: "application/json" });
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
      const importedCharts = imported?.chart
        ? [normalizeChart({ ...imported.chart, id: createId("chart") })]
        : imported?.charts
          ? imported.charts.map((chart) => normalizeChart({ ...chart, id: createId("chart") }))
          : [normalizeChart(Array.isArray(imported) ? { title: "导入曲谱", items: imported } : imported)];
      const validCharts = importedCharts.filter((chart) => Array.isArray(chart.sections));

      if (!validCharts.length) {
        setChartMessage("导入失败，文件里没有可用曲谱。");
        return;
      }

      setChartLibrary((library) => ({
        activeChartId: validCharts[0].id,
        charts: [...library.charts, ...validCharts],
      }));
      setChartMessage(`已导入 ${validCharts.length} 份曲谱。`);
    } catch {
      setChartMessage("导入失败，请选择之前导出的 JSON 文件。");
    } finally {
      event.target.value = "";
    }
  }

  return (
    <div className="app-shell">
      <header className="topbar">
        <div className="brand">
          <div className="brand-row">
            <div className="brand-mark">G</div>
            <h1>吉他和弦查询</h1>
          </div>
          <p className="subtitle">输入和弦名查看常用把位，也可以输入六根弦的品位来反向识别可能的和弦。</p>
        </div>
        <div className="tuning-pill">
          标准调弦 <strong>E A D G B e</strong>
        </div>
      </header>

      <main className="page-stack">
        <section className="lookup-row">
          <section className="panel search-panel">
            <div className="panel-inner">
              <div className="panel-header compact-header">
                <div className="panel-title">
                  <span className="eyebrow">Chord Search</span>
                  <h2>输入和弦名称</h2>
                </div>
                <span className="hint">例如 C、Am、F#7、Bbmaj7。</span>
              </div>

              <div className="field-row stacked-field">
                <input
                  className="text-field"
                  value={chordQuery}
                  onChange={(event) => setChordQuery(event.target.value)}
                  placeholder="输入和弦名"
                  aria-label="和弦名"
                />
                <button className="primary-button" onClick={() => setChordQuery(chordQuery.trim() || "C")}>
                  查询
                </button>
              </div>

              <div className="chip-row" aria-label="常用和弦示例">
                {EXAMPLE_CHORDS.map((example) => (
                  <button className="chip" key={example} onClick={() => setChordQuery(example)}>
                    {example}
                  </button>
                ))}
              </div>

              {parsedChord.ok ? (
                <div className="summary-strip search-summary">
                  <span className="metric">
                    和弦 <strong>{parsedChord.displayName}</strong>
                  </span>
                  <span className="metric">{parsedChord.definition.label}</span>
                  <span className="metric">
                    构成音{" "}
                    <strong>
                      {pitchClassesForChord(parsedChord.root, parsedChord.definition.intervals)
                        .map((pc) => noteName(pc, parsedChord.preferFlats))
                        .join(" ")}
                    </strong>
                  </span>
                </div>
              ) : (
                <p className="error-text">{parsedChord.message}</p>
              )}
            </div>
          </section>

          <section className="panel voicing-panel">
            <div className="panel-inner">
              <div className="panel-header compact-header">
                <div className="panel-title">
                  <span className="eyebrow">Voicings</span>
                  <h2>{parsedChord.ok ? `${parsedChord.displayName} 按法` : "按法"}</h2>
                </div>
                <span className="hint">优先展示封闭和高把位；点“识别”可带入下方。</span>
              </div>

              {parsedChord.ok && voicings.length ? (
                <div className="voicing-grid">
                  {voicings.map((shape) => (
                    <VoicingCard
                      key={compactShape(shape.frets)}
                      parsed={parsedChord}
                      shape={shape}
                      onUse={() => useShape(shape.frets)}
                      onAdd={() => addChartItem(parsedChord.displayName, shape.frets, shape.name, parsedChord.root)}
                    />
                  ))}
                </div>
              ) : (
                <div className="empty-state">输入一个可识别的和弦名后，这里会显示多个把位图。</div>
              )}
            </div>
          </section>
        </section>

        <section className="panel reverse-panel">
          <div className="panel-inner">
            <div className="panel-header compact-header">
              <div className="panel-title">
                <span className="eyebrow">Reverse Finder</span>
                <h2>点按和弦图，识别可能和弦</h2>
              </div>
              <span className="hint">上方选 x 或空弦，图中点品位；可切换不同把位。</span>
            </div>

            <div className="reverse-layout">
              <div className="reverse-input">
                <ChordInputDiagram
                  baseFret={editorBaseFret}
                  values={fretValues}
                  onBaseFretChange={setEditorBaseFret}
                  onStringValueChange={setStringValue}
                />

                <div className="summary-strip compact-summary">
                  <span className="metric">
                    输入 <strong>{fretValues.join(" ")}</strong>
                  </span>
                  <span className="metric">
                    音名{" "}
                    <strong>
                      {recognition.notes.length
                        ? recognition.notes.map((note) => noteName(note.pc)).join(" ")
                        : "无"}
                    </strong>
                  </span>
                </div>

                <div className="chip-row compact-examples" aria-label="品位输入示例">
                  {FRET_EXAMPLES.map((example) => (
                    <button className="chip" key={example.label} onClick={() => setExampleFrets(example.frets)}>
                      {example.label}: {example.frets.join(" ")}
                    </button>
                  ))}
                  <button className="chip" onClick={resetEditor}>
                    清空
                  </button>
                </div>

                <button className="primary-button add-current-button" onClick={addCurrentInputToChart}>
                  加入曲谱
                </button>
              </div>

              <div className="recognition">
                {recognition.error ? <p className="error-text">{recognition.error}</p> : null}
                {!recognition.error && recognition.results.length === 0 ? (
                  <div className="empty-state">暂时没有高置信度结果。试着增加根音、三音或七音，识别会更稳定。</div>
                ) : (
                  <div className="result-list">
                    {recognition.results.map((result) => (
                      <div className="result-row" key={result.key}>
                        <div>
                          <div className="result-name">{result.name}</div>
                          <div className="result-meta">{result.label}</div>
                        </div>
                        <div className="result-meta">
                          命中 {result.matched.join(" ")}
                          {result.missing.length ? `，缺少 ${result.missing.join(" ")}` : ""}
                          {result.extra.length ? `，额外 ${result.extra.join(" ")}` : ""}
                        </div>
                        <div className="confidence">
                          {result.confidence}%
                          <div className="confidence-bar" aria-hidden="true">
                            <span style={{ width: `${result.confidence}%` }} />
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>
        </section>

        <section className="panel chart-panel">
          <div className="panel-inner">
            <div className="panel-header compact-header">
              <div className="panel-title">
                <span className="eyebrow">Chart Sequence</span>
                <h2>曲谱记录</h2>
              </div>
              <div className="chart-actions">
                <button className="ghost-button add-button" onClick={createChart}>
                  新建
                </button>
                <button className="ghost-button add-button" onClick={createSection}>
                  添加段落
                </button>
                <button className="ghost-button" onClick={copyChart}>
                  复制
                </button>
                <button className="ghost-button" onClick={exportChart}>
                  导出
                </button>
                <button className="ghost-button" onClick={() => importInputRef.current?.click()}>
                  导入
                </button>
                <button className="ghost-button danger-button" onClick={deleteActiveChart}>
                  删除当前
                </button>
                <button className="ghost-button danger-button" onClick={() => setChartItems([])}>
                  清空段落
                </button>
              </div>
            </div>

            <input
              ref={importInputRef}
              className="hidden-file-input"
              type="file"
              accept="application/json,.json"
              onChange={importChart}
              aria-label="导入曲谱 JSON"
            />

            <div className="chart-library-bar">
              <label className="chart-select-field">
                <span>当前曲谱</span>
                <select
                  className="chart-select"
                  value={activeChart.id}
                  onChange={(event) => selectChart(event.target.value)}
                  aria-label="选择曲谱"
                >
                  {chartLibrary.charts.map((chart) => (
                    <option value={chart.id} key={chart.id}>
                      {chart.title || "未命名曲谱"} ({flattenSections(chart.sections || []).length})
                    </option>
                  ))}
                </select>
              </label>
              <span className="library-count">共 {chartLibrary.charts.length} 份曲谱</span>
            </div>

            <label className="chart-title-field">
              <span>曲谱名称</span>
              <input
                className="text-field"
                value={chartTitle}
                onChange={(event) => setChartTitle(event.target.value)}
                placeholder="例如 City Pop 练习 / 新歌 Verse"
                aria-label="曲谱名称"
              />
            </label>

            <p className="save-note">
              曲谱库会自动保存到当前浏览器；要长期保存或换设备，请定期导出当前曲谱的 JSON 备份。
            </p>

            <div className="chart-sections" aria-label="曲谱段落">
              {chartSections.map((section) => (
                <ChartSection
                  section={section}
                  active={section.id === activeChart.activeSectionId}
                  key={section.id}
                  onSelect={() => selectSection(section.id)}
                  onRename={(title) => renameSection(section.id, title)}
                  onDelete={() => deleteSection(section.id)}
                  onDropAt={(index) => handleChartDrop(section.id, index)}
                  onDragOverAtEnd={() => markChartDropTarget(section.id, section.items.length)}
                  isDragging={Boolean(draggedChord)}
                  isDropAtEnd={dragTarget?.sectionId === section.id && dragTarget?.index === section.items.length}
                >
                  {section.items.map((item, index) => (
                    <ChartItem
                      item={item}
                      key={item.id}
                      isDragging={draggedChord?.itemId === item.id}
                      isDropTarget={
                        draggedChord?.itemId !== item.id &&
                        dragTarget?.sectionId === section.id &&
                        dragTarget?.index === index
                      }
                      onDragStart={() => {
                        selectSection(section.id);
                        setDraggedChord({ sectionId: section.id, itemId: item.id });
                        setDragTarget(null);
                      }}
                      onDragOverBefore={() => markChartDropTarget(section.id, index)}
                      onDragEnd={clearChartDrag}
                      onDropBefore={() => handleChartDrop(section.id, index)}
                      onDuplicate={() => duplicateSectionItem(section.id, item.id)}
                      onRemove={() => removeSectionItem(section.id, item.id)}
                      onUse={(frets) => useShape(frets)}
                    />
                  ))}
                </ChartSection>
              ))}
            </div>

            {chartMessage ? <p className="chart-message">{chartMessage}</p> : null}
          </div>
        </section>

        <p className="footer-note">
          MVP 采用标准调弦和十二平均律做识别。实际音乐语境会影响命名，例如同一组音可能同时对应 Am7 与 C6。
        </p>
      </main>
    </div>
  );
}

function ChordInputDiagram({ baseFret, values, onBaseFretChange, onStringValueChange }) {
  const parsedValues = values.map(parseFret);
  const fretRows = Array.from({ length: 5 }, (_, index) => baseFret + index);
  const quickPositions = [1, 3, 5, 7, 9, 12];
  const strings = TUNING.map((string, index) => ({
    ...string,
    index,
    x: 8 + index * 16.8,
  }));
  const frets = fretRows.map((fret, index) => ({
    fret,
    y: 16 + index * 17,
  }));
  const boardX = (percent) => `calc(48px + (100% - 66px) * ${percent / 100})`;
  const boardY = (percent) => `calc(28px + (100% - 82px) * ${percent / 100})`;

  function moveBase(delta) {
    onBaseFretChange(Math.max(1, Math.min(20, baseFret + delta)));
  }

  function toggleMute(index) {
    onStringValueChange(index, parsedValues[index] === null ? 0 : null);
  }

  return (
    <div className="fretboard-editor">
      <div className="fretboard-toolbar">
        <div>
          <span className="eyebrow">Chord Input</span>
          <h3>点击和弦图输入按法</h3>
        </div>
        <div className="position-control" aria-label="选择把位">
          <button className="ghost-button" onClick={() => moveBase(-1)}>
            -
          </button>
          <span>{baseFret} 把位</span>
          <button className="ghost-button" onClick={() => moveBase(1)}>
            +
          </button>
        </div>
      </div>

      <div className="position-chips">
        {quickPositions.map((position) => (
          <button
            className={position === baseFret ? "chip active-chip" : "chip"}
            key={position}
            onClick={() => onBaseFretChange(position)}
          >
            {position}
          </button>
        ))}
      </div>

      <div className="string-status-grid">
        {TUNING.map((string, index) => (
          <div className="string-status" key={`status-${string.label}`}>
            <span>
              {string.label} {string.note}
            </span>
            <button
              className={parsedValues[index] === null ? "mini-toggle active-mini" : "mini-toggle"}
              onClick={() => toggleMute(index)}
              title={parsedValues[index] === null ? "取消闷音，设为空弦" : "这根弦不弹"}
            >
              x
            </button>
          </div>
        ))}
      </div>

      <div className="click-fretboard" style={{ "--fret-count": fretRows.length }}>
        <svg className="fretboard-lines" viewBox="0 0 100 100" aria-hidden="true" preserveAspectRatio="none">
          {strings.map((string) => (
            <line className="input-string-line" x1={string.x} x2={string.x} y1="7" y2="93" key={string.label} />
          ))}
          {Array.from({ length: fretRows.length + 1 }).map((_, index) => {
            const y = 7 + index * 17;
            return <line className="input-fret-line" x1="8" x2="92" y1={y} y2={y} key={`fretline-${index}`} />;
          })}
        </svg>

        {fretRows.map((fret, fretIndex) => (
          <span
            className="fret-row-label"
            style={{ top: boardY(7 + fretIndex * 17 + 8.5) }}
            key={`label-${fret}`}
          >
            {fret}fr
          </span>
        ))}

        {strings.map((string) =>
          frets.map(({ fret, y }) => {
            const selected = parsedValues[string.index] === fret;
            return (
              <button
                className={selected ? "string-dot selected-fret" : "string-dot"}
                key={`${string.label}-${fret}`}
                style={{ left: boardX(string.x), top: boardY(y) }}
                onClick={() => onStringValueChange(string.index, fret)}
                aria-label={`${string.label} ${string.note} 第 ${fret} 品`}
              >
                {selected ? fret : ""}
              </button>
            );
          })
        )}

        <div className="open-string-row">
          {strings.map((string) => (
            <span className={parsedValues[string.index] === 0 ? "open-string active-open-string" : "open-string"} key={string.label}>
              {parsedValues[string.index] === null ? "x" : parsedValues[string.index] === 0 ? "空" : ""}
            </span>
          ))}
        </div>
      </div>
    </div>
  );
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
  isDropAtEnd,
}) {
  const sectionClass = [
    "chart-section",
    active ? "active-section" : "",
    isDragging ? "drag-aware-section" : "",
    isDropAtEnd ? "section-drop-target" : "",
  ]
    .filter(Boolean)
    .join(" ");
  const sequenceClass = [
    "chart-sequence",
    isDropAtEnd ? "drop-at-end" : "",
    section.items.length ? "" : "empty-sequence",
  ]
    .filter(Boolean)
    .join(" ");

  return (
    <section
      className={sectionClass}
      onClick={onSelect}
      onDragOver={(event) => {
        event.preventDefault();
        onDragOverAtEnd();
      }}
      onDrop={(event) => {
        event.preventDefault();
        onDropAt(section.items.length);
      }}
    >
      <div className="chart-section-header">
        <label>
          <span>段落</span>
          <input
            className="section-title-input"
            value={section.title}
            onChange={(event) => onRename(event.target.value)}
            onFocus={onSelect}
            aria-label={`${section.title} 段落名称`}
          />
        </label>
        <div className="section-meta">
          {active ? <span className="active-section-pill">加入目标</span> : null}
          <span>{section.items.length} 个和弦</span>
          <button
            className="icon-button danger-button"
            onClick={(event) => {
              event.stopPropagation();
              onDelete();
            }}
            title="删除段落"
          >
            x
          </button>
        </div>
      </div>

      <div className={sequenceClass}>
        {section.items.length ? children : <div className="section-empty">把和弦卡片拖到这里，或选中本段后点“加入”。</div>}
      </div>
    </section>
  );
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
  onUse,
}) {
  const cardClass = ["chart-card", isDragging ? "dragging-card" : "", isDropTarget ? "drop-before" : ""]
    .filter(Boolean)
    .join(" ");

  return (
    <article
      className={cardClass}
      draggable="true"
      onDragStart={(event) => {
        event.dataTransfer.effectAllowed = "move";
        event.dataTransfer.setData("text/plain", item.id);
        onDragStart();
      }}
      onDragEnd={onDragEnd}
      onDragEnter={(event) => {
        event.preventDefault();
        event.stopPropagation();
        onDragOverBefore();
      }}
      onDragOver={(event) => {
        event.preventDefault();
        event.stopPropagation();
        onDragOverBefore();
      }}
      onDrop={(event) => {
        event.preventDefault();
        event.stopPropagation();
        onDropBefore();
      }}
    >
      <div className="chart-card-main">
        <h3>{item.name}</h3>
        <div className="chart-diagram-wrap">
          <ChordDiagram shape={item.frets} root={item.root} startAtLowestFret />
        </div>
      </div>
      <div className="chart-card-actions">
        <button className="icon-button" onClick={() => onUse(item.frets)} title="带入识别">
          识别
        </button>
        <button className="icon-button" onClick={onDuplicate} title="复制这个和弦">
          复制
        </button>
        <button className="icon-button danger-button" onClick={onRemove} title="删除">
          x
        </button>
      </div>
    </article>
  );
}

function VoicingCard({ parsed, shape, onUse, onAdd }) {
  return (
    <article className="voicing-card">
      <div className="voicing-card-header">
        <div className="voicing-name">
          <h3>{shape.name}</h3>
          <div className="voicing-meta">
            <span>{shape.form}</span>
            <span className="shape-code">{compactShape(shape.frets)}</span>
          </div>
        </div>
        <div className="voicing-actions">
          <button className="ghost-button" onClick={onUse}>
            识别
          </button>
          <button className="ghost-button add-button" onClick={onAdd}>
            加入
          </button>
        </div>
      </div>
      <div className="diagram-wrap">
        <ChordDiagram shape={shape.frets} root={parsed.root} />
      </div>
    </article>
  );
}

function ChordDiagram({ shape, root, startAtLowestFret = false }) {
  const played = shape.filter((fret) => fret !== null);
  const positive = played.filter((fret) => fret > 0);
  const minPositive = positive.length ? Math.min(...positive) : 1;
  const maxFret = played.length ? Math.max(...played) : 4;
  let firstFret = minPositive;

  if (startAtLowestFret && minPositive > 1) {
    firstFret = minPositive;
  } else if (played.some((fret) => fret === 0) || minPositive <= 1) {
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

  return (
    <svg className="chord-diagram" viewBox={`0 0 ${width} ${height}`} role="img" aria-label={compactShape(shape)}>
      {shape.map((fret, index) => {
        const x = left + stringGap * index;
        const label = fret === null ? "x" : fret === 0 ? "o" : "";

        return label ? (
          <text className="diagram-label" x={x} y={18} key={`top-${index}`}>
            {label}
          </text>
        ) : null;
      })}

      {Array.from({ length: 6 }).map((_, index) => {
        const x = left + stringGap * index;
        return (
          <line
            className="diagram-line"
            x1={x}
            x2={x}
            y1={top}
            y2={top + boardHeight}
            key={`string-${index}`}
          />
        );
      })}

      {Array.from({ length: fretCount + 1 }).map((_, index) => {
        const y = top + fretGap * index;
        const isNut = index === 0 && firstFret === 1;

        return (
          <line
            className={isNut ? "diagram-nut" : "diagram-line"}
            x1={left}
            x2={left + boardWidth}
            y1={y}
            y2={y}
            key={`fret-${index}`}
          />
        );
      })}

      {firstFret > 1 ? (
        <text className="diagram-fret-label" x={4} y={top + fretGap * 0.65}>
          {firstFret}fr
        </text>
      ) : null}

      {shape.map((fret, index) => {
        if (fret === null || fret === 0) return null;

        const x = left + stringGap * index;
        const y = top + (fret - firstFret + 0.5) * fretGap;
        const pc = mod(TUNING[index].pc + fret);
        const isRoot = pc === root;

        return (
          <g key={`dot-${index}-${fret}`}>
            <circle className={isRoot ? "diagram-root" : "diagram-dot"} cx={x} cy={y} r="11.5" />
            <text className="diagram-text" x={x} y={y + 0.5}>
              {fret}
            </text>
          </g>
        );
      })}

      {TUNING.map((string, index) => {
        const x = left + stringGap * index;
        return (
          <text className="diagram-label" x={x} y={height - 9} key={`label-${string.label}`}>
            {string.note}
          </text>
        );
      })}
    </svg>
  );
}

ReactDOM.createRoot(document.getElementById("root")).render(<App />);
