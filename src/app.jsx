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
const SUPABASE_CONFIG_STORAGE_KEY = "guitar-chord-supabase-config-v1";
const PASSWORD_SETUP_PENDING_EMAIL_KEY = "guitar-chord-password-setup-email-v1";
const PASSWORD_SETUP_DONE_KEY_PREFIX = "guitar-chord-password-setup-done-v1:";
const SUPABASE_LIBRARY_TABLE = "guitar_chart_libraries";
const CLOUD_SAVE_DELAY = 900;
const DEFAULT_SECTION_TITLE = "前奏";
const UNKNOWN_CHORD_NAME = "未知和弦";
const CUSTOM_CHORD_NAME = "自定义名称";
const EMPTY_FRET_VALUES = ["x", "x", "x", "x", "x", "x"];

function mod(value, size = 12) {
  return ((value % size) + size) % size;
}

function noteName(pc, preferFlats = false) {
  return (preferFlats ? FLAT_NAMES : SHARP_NAMES)[mod(pc)];
}

function compactShape(frets) {
  return frets.map((fret) => (fret === null ? "x" : String(fret))).join(" ");
}

function compactShapeCode(frets) {
  return frets.map((fret) => (fret === null ? "x" : String(fret))).join("");
}

function fretValuesFromFrets(frets) {
  return normalizeFrets(frets).map((fret) => (fret === null ? "x" : String(fret)));
}

function normalizeFrets(frets) {
  const values = Array.isArray(frets) ? frets : EMPTY_FRET_VALUES;
  const normalized = values.slice(0, 6).map(parseFret);

  while (normalized.length < 6) normalized.push(null);
  return normalized.map((fret) => (fret === undefined ? null : fret));
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
  if (value === null) return null;

  const normalized = String(value ?? "").trim().toLowerCase();

  if (!normalized || ["x", "m", "-"].includes(normalized)) return null;
  if (["o", "open"].includes(normalized)) return 0;

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

function detectedNamesForFrets(frets) {
  return identifyChord(fretValuesFromFrets(frets)).results.map((result) => result.name);
}

function displayChartItemName(item) {
  return item.customName || item.selectedName || item.name || item.detectedNames?.[0] || UNKNOWN_CHORD_NAME;
}

function createChartItem({ frets, selectedName = "", customName = "", detectedNames, note = "", source = "曲谱记录" }) {
  const normalizedFrets = normalizeFrets(frets);
  const names = Array.isArray(detectedNames) ? detectedNames.filter(Boolean) : detectedNamesForFrets(normalizedFrets);
  const cleanCustomName = customName.trim();
  const cleanSelectedName = selectedName.trim();
  const name = cleanCustomName || cleanSelectedName || names[0] || UNKNOWN_CHORD_NAME;

  return normalizeChartItem({
    id: createId("chord"),
    name,
    frets: normalizedFrets,
    detectedNames: names,
    selectedName: cleanSelectedName || (cleanCustomName ? "" : names[0] || UNKNOWN_CHORD_NAME),
    customName: cleanCustomName,
    note,
    source,
  });
}

function normalizeChartItem(item = {}) {
  item = item && typeof item === "object" ? item : {};
  const frets = normalizeFrets(item.frets);
  const detectedNames = Array.isArray(item.detectedNames)
    ? item.detectedNames.filter(Boolean)
    : detectedNamesForFrets(frets);
  const legacyName = item.name && item.name !== UNKNOWN_CHORD_NAME ? item.name : "";
  const selectedName = item.selectedName || legacyName || detectedNames[0] || UNKNOWN_CHORD_NAME;
  const customName = String(item.customName || "").trim();
  const name = customName || selectedName || UNKNOWN_CHORD_NAME;

  return {
    id: item.id || `${Date.now()}-${Math.random().toString(16).slice(2)}`,
    name,
    frets,
    detectedNames,
    selectedName,
    customName,
    note: item.note || "",
    root: Number.isInteger(item.root) ? item.root : rootFromChordName(name),
    shape: item.shape || compactShape(frets),
    position: item.position || shapePositionName(frets),
    source: item.source || "曲谱记录",
  };
}

function normalizeChartSection(section = {}, index = 0) {
  section = section && typeof section === "object" ? section : {};

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
  chart = chart && typeof chart === "object" ? chart : {};
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

function normalizeSupabaseConfig(config = {}) {
  return {
    url: String(config.url || "").trim(),
    anonKey: String(config.anonKey || config.publishableKey || "").trim(),
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
  } catch {
    // Fall back to the build-time config below.
  }

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
  if (!hasSupabaseConfig(config)) return { client: null, error: "" };
  if (!window.supabase?.createClient) {
    return { client: null, error: "Supabase 脚本未加载，暂时只能本地保存。" };
  }

  try {
    const url = new URL(config.url);

    if (!["http:", "https:"].includes(url.protocol)) {
      return { client: null, error: "Supabase URL 需要以 https:// 开头。" };
    }

    return {
      client: window.supabase.createClient(config.url, config.anonKey, {
        auth: {
          autoRefreshToken: true,
          detectSessionInUrl: true,
          persistSession: true,
        },
      }),
      error: "",
    };
  } catch (error) {
    return { client: null, error: `Supabase 配置无效：${error.message}` };
  }
}

function cloudRedirectUrl() {
  return `${window.location.origin}${window.location.pathname}`;
}

function normalizedEmail(value) {
  return String(value || "").trim().toLowerCase();
}

function passwordSetupDoneKey(user) {
  const accountId = user?.id || normalizedEmail(user?.email);
  return accountId ? `${PASSWORD_SETUP_DONE_KEY_PREFIX}${accountId}` : "";
}

function markPendingPasswordSetup(email) {
  window.localStorage.setItem(PASSWORD_SETUP_PENDING_EMAIL_KEY, normalizedEmail(email));
}

function clearPendingPasswordSetup() {
  window.localStorage.removeItem(PASSWORD_SETUP_PENDING_EMAIL_KEY);
}

function markPasswordSetupDone(user) {
  const key = passwordSetupDoneKey(user);

  if (key) window.localStorage.setItem(key, "1");
  clearPendingPasswordSetup();
}

function shouldPromptPasswordSetup(user) {
  const pendingEmail = normalizedEmail(window.localStorage.getItem(PASSWORD_SETUP_PENDING_EMAIL_KEY));
  const userEmail = normalizedEmail(user?.email);
  const doneKey = passwordSetupDoneKey(user);

  return Boolean(pendingEmail && userEmail && pendingEmail === userEmail && doneKey && !window.localStorage.getItem(doneKey));
}

function mergeChartLibraries(localLibrary, cloudLibrary) {
  const local = normalizeChartLibrary(localLibrary);
  const cloud = normalizeChartLibrary(cloudLibrary);
  const byId = new Map();

  [...cloud.charts, ...local.charts].forEach((chart) => {
    const existing = byId.get(chart.id);

    if (!existing || (chart.updatedAt || 0) >= (existing.updatedAt || 0)) {
      byId.set(chart.id, chart);
    }
  });

  const charts = Array.from(byId.values()).sort((a, b) => (b.updatedAt || 0) - (a.updatedAt || 0));
  const activeChartId = charts.some((chart) => chart.id === local.activeChartId)
    ? local.activeChartId
    : charts.some((chart) => chart.id === cloud.activeChartId)
      ? cloud.activeChartId
      : charts[0]?.id;

  return normalizeChartLibrary({ activeChartId, charts });
}

function rootFromChordName(name) {
  const parsed = parseChordName(String(name).split("/")[0]);
  return parsed.ok ? parsed.root : null;
}

function flattenSections(sections = []) {
  return (Array.isArray(sections) ? sections : []).flatMap((section) =>
    Array.isArray(section?.items) ? section.items : []
  );
}

function createChordEditorState(sectionId = "", item = null) {
  return {
    open: false,
    mode: "add",
    sectionId,
    itemId: null,
    frets: [...EMPTY_FRET_VALUES],
    baseFret: 1,
    selectedName: "",
    customName: "",
    note: "",
    ...item,
  };
}

function parseShapeLine(line) {
  const raw = String(line || "").trim();
  if (!raw) return null;

  let label = "";
  let shapeText = raw;
  const colonIndex = raw.indexOf(":");

  if (colonIndex > -1) {
    label = raw.slice(0, colonIndex).trim();
    shapeText = raw.slice(colonIndex + 1).trim();
  }

  const tokens = /\s|,|，/.test(shapeText)
    ? shapeText.split(/[\s,，]+/).filter(Boolean)
    : shapeText.split("");

  if (tokens.length !== 6) return { error: `无法解析：${raw}` };

  const frets = tokens.map(parseFret);
  if (frets.some((fret) => fret === undefined)) return { error: `品位需为 0-24 或 x：${raw}` };
  if (frets.every((fret) => fret === null)) return { error: `至少需要一根有声弦：${raw}` };

  return { label, frets };
}

function sectionClipboardText(items = []) {
  return items.map((item) => `${displayChartItemName(item)}: ${compactShapeCode(item.frets)}`).join("\n");
}

function isEditableTarget(target) {
  return Boolean(target?.closest?.("input, textarea, select, [contenteditable='true']"));
}

function App() {
  const [activeTab, setActiveTab] = useState("songbook");
  const [chordQuery, setChordQuery] = useState("C");
  const [fretValues, setFretValues] = useState(["x", "3", "2", "0", "1", "0"]);
  const [editorBaseFret, setEditorBaseFret] = useState(1);
  const [chordEditor, setChordEditor] = useState(createChordEditorState);
  const [openBatchSectionId, setOpenBatchSectionId] = useState("");
  const [batchInput, setBatchInput] = useState("");
  const [selectedItemIds, setSelectedItemIds] = useState([]);
  const [copiedChordItems, setCopiedChordItems] = useState([]);
  const [copiedChordText, setCopiedChordText] = useState("");
  const [pasteTarget, setPasteTarget] = useState(null);
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
  const [syncNewPassword, setSyncNewPassword] = useState("");
  const [showSyncPasswordEditor, setShowSyncPasswordEditor] = useState(false);
  const [syncStatus, setSyncStatus] = useState({
    tone: "local",
    text: "本地保存",
  });
  const [showSyncSettings, setShowSyncSettings] = useState(false);
  const [cloudReady, setCloudReady] = useState(false);
  const importInputRef = useRef(null);
  const cloudSaveTimerRef = useRef(null);
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
  const chordEditorRecognition = useMemo(() => identifyChord(chordEditor.frets), [chordEditor.frets]);
  const chordEditorNames = chordEditorRecognition.results.map((result) => result.name);
  const chordEditorSelectedName = chordEditor.customName
    ? CUSTOM_CHORD_NAME
    : chordEditor.selectedName || chordEditorNames[0] || UNKNOWN_CHORD_NAME;
  const syncConfigured = hasSupabaseConfig(supabaseConfig);

  useEffect(() => {
    window.localStorage.setItem(CHART_STORAGE_KEY, JSON.stringify(chartLibrary));
  }, [chartLibrary]);

  useEffect(() => {
    const validIds = new Set(chartSections.flatMap((section) => section.items.map((item) => item.id)));
    setSelectedItemIds((ids) => ids.filter((id) => validIds.has(id)));
  }, [chartSections]);

  useEffect(() => {
    setPasteTarget((target) => {
      if (!chartSections.length) return null;

      const fallback = {
        sectionId: activeSection.id,
        index: activeSection.items.length,
      };

      if (!target) return fallback;

      const section = chartSections.find((item) => item.id === target.sectionId);
      if (!section) return fallback;

      const index = Math.max(0, Math.min(target.index, section.items.length));
      return target.index === index ? target : { ...target, index };
    });
  }, [activeSection.id, activeSection.items.length, chartSections]);

  useEffect(() => {
    function handleKeyDown(event) {
      const key = event.key.toLowerCase();
      const isShortcut = event.metaKey || event.ctrlKey;

      if (activeTab !== "songbook" || !isShortcut || key !== "c" || isEditableTarget(event.target)) return;
      if (!selectedItemIds.length) return;

      event.preventDefault();
      copySelectedItems();
    }

    function handlePaste(event) {
      if (activeTab !== "songbook" || isEditableTarget(event.target)) return;

      const text = event.clipboardData?.getData("text/plain") || "";
      if (!copiedChordItems.length && !text.trim()) return;

      event.preventDefault();
      pasteFromClipboardText(text);
    }

    window.addEventListener("keydown", handleKeyDown);
    window.addEventListener("paste", handlePaste);

    return () => {
      window.removeEventListener("keydown", handleKeyDown);
      window.removeEventListener("paste", handlePaste);
    };
  }, [activeTab, chartSections, copiedChordItems, copiedChordText, pasteTarget, selectedItemIds]);

  useEffect(() => {
    if (!hasSupabaseConfig(supabaseConfig)) {
      setSyncClient(null);
      setSyncUser(null);
      setCloudReady(false);
      setSyncStatus({ tone: "local", text: "未配置云同步，当前仅保存到本机。" });
      return undefined;
    }

    const { client, error: clientError } = createSupabaseClient(supabaseConfig);

    if (!client) {
      setSyncClient(null);
      setSyncUser(null);
      setCloudReady(false);
      setShowSyncSettings(Boolean(clientError));
      setSyncStatus({ tone: clientError ? "error" : "local", text: clientError || "未配置云同步，当前仅保存到本机。" });
      return undefined;
    }

    let active = true;
    setSyncClient(client);
    setCloudReady(false);
    setSyncStatus({ tone: "pending", text: "正在连接云同步..." });

    client.auth.getSession().then(({ data, error }) => {
      if (!active) return;

      if (error) {
        setSyncStatus({ tone: "error", text: `登录状态读取失败：${error.message}` });
        return;
      }

      const user = data.session?.user || null;
      setSyncUser(user);
      setShowSyncPasswordEditor(user ? shouldPromptPasswordSetup(user) : false);
      if (!user) setSyncNewPassword("");
      setSyncStatus(
        user
          ? { tone: "pending", text: "正在读取云端曲谱..." }
          : { tone: "local", text: "云同步已配置，请先登录。" }
      );
    });

    const { data } = client.auth.onAuthStateChange((_event, session) => {
      if (!active) return;

      const user = session?.user || null;
      setSyncUser(user);
      setShowSyncPasswordEditor(user ? shouldPromptPasswordSetup(user) : false);
      if (!user) setSyncNewPassword("");
      setCloudReady(false);
      setSyncStatus(
        user
          ? { tone: "pending", text: "正在读取云端曲谱..." }
          : { tone: "local", text: "已退出，当前仅保存到本机。" }
      );
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
      setSyncStatus({ tone: "pending", text: "正在读取云端曲谱..." });

      try {
        const { data, error } = await syncClient
          .from(SUPABASE_LIBRARY_TABLE)
          .select("library, updated_at")
          .eq("user_id", syncUser.id)
          .maybeSingle();

        if (!active) return;
        if (error) throw error;

        if (data?.library) {
          setChartLibrary((localLibrary) => mergeChartLibraries(localLibrary, data.library));
          setSyncStatus({ tone: "pending", text: "已合并云端曲谱，正在保存最新版本..." });
        } else {
          setSyncStatus({ tone: "pending", text: "云端还没有曲谱，正在上传本机曲谱..." });
        }

        setCloudReady(true);
      } catch (error) {
        if (!active) return;
        setCloudReady(false);
        setSyncStatus({ tone: "error", text: `云端读取失败：${error.message}` });
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
    setSyncStatus({ tone: "pending", text: "正在同步曲谱..." });

    cloudSaveTimerRef.current = window.setTimeout(async () => {
      try {
        const library = normalizeChartLibrary(chartLibrary);
        const { error } = await syncClient.from(SUPABASE_LIBRARY_TABLE).upsert(
          {
            user_id: syncUser.id,
            library,
            updated_at: new Date().toISOString(),
          },
          { onConflict: "user_id" }
        );

        if (error) throw error;
        setSyncStatus({ tone: "synced", text: `已同步到云端：${syncUser.email || "当前账号"}` });
      } catch (error) {
        setSyncStatus({ tone: "error", text: `云端保存失败：${error.message}` });
      }
    }, CLOUD_SAVE_DELAY);

    return () => {
      window.clearTimeout(cloudSaveTimerRef.current);
    };
  }, [chartLibrary, syncClient, syncUser?.id, cloudReady]);

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
    setChordEditor(createChordEditorState());
    setSelectedItemIds([]);
    setPasteTarget(null);
    setOpenBatchSectionId("");
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
    setPasteTarget({ sectionId: chart.activeSectionId, index: 0 });
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
    setActiveTab("tools");
    setFretValues(frets.map((fret) => (fret === null ? "x" : String(fret))));
    const stats = shapeStats(frets);
    setEditorBaseFret(stats.isOpen || stats.startFret <= 1 ? 1 : stats.startFret);
    requestAnimationFrame(() => {
      document.querySelector(".reverse-panel")?.scrollIntoView({ behavior: "smooth", block: "start" });
    });
  }

  function addChartItem(name, frets, source) {
    const item = createChartItem({
      frets,
      selectedName: name || "",
      source,
    });

    setChartItems((items) => [...items, item]);
    setChartMessage(`已加入到「${activeSection.title}」：${displayChartItemName(item)}`);
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

    const bestName = recognition.results[0]?.name || UNKNOWN_CHORD_NAME;
    addChartItem(bestName, parsedFrets, "Reverse Finder");
  }

  function openNewChordEditor(sectionId = activeSection.id) {
    setActiveTab("songbook");
    selectSection(sectionId);
    setChordEditor({
      ...createChordEditorState(sectionId),
      open: true,
      mode: "add",
      sectionId,
    });
  }

  function openEditChordEditor(sectionId, item) {
    setActiveTab("songbook");
    selectSection(sectionId);
    setChordEditor({
      ...createChordEditorState(sectionId),
      open: true,
      mode: "edit",
      sectionId,
      itemId: item.id,
      frets: fretValuesFromFrets(item.frets),
      baseFret: shapeStats(item.frets).isOpen || shapeStats(item.frets).startFret <= 1 ? 1 : shapeStats(item.frets).startFret,
      selectedName: item.customName ? CUSTOM_CHORD_NAME : item.selectedName || item.name || "",
      customName: item.customName || "",
      note: item.note || "",
    });
  }

  function closeChordEditor() {
    setChordEditor(createChordEditorState(activeSection.id));
  }

  function setChordEditorStringValue(index, value) {
    setChordEditor((editor) => {
      const frets = [...editor.frets];
      frets[index] = value === null ? "x" : String(value);
      return { ...editor, frets };
    });
  }

  function saveChordEditorItem() {
    const parsedFrets = chordEditor.frets.map(parseFret);

    if (parsedFrets.some((fret) => fret === undefined)) {
      setChartMessage("品位格式有误，暂时不能加入曲谱。");
      return;
    }

    if (parsedFrets.every((fret) => fret === null)) {
      setChartMessage("至少输入一根有声弦。");
      return;
    }

    const customName = chordEditor.customName.trim();
    const selectedName = customName
      ? ""
      : chordEditor.selectedName || chordEditorNames[0] || UNKNOWN_CHORD_NAME;
    const item = createChartItem({
      frets: parsedFrets,
      detectedNames: chordEditorNames,
      selectedName,
      customName,
      note: chordEditor.note,
      source: chordEditor.mode === "edit" ? "编辑" : "曲谱记录",
    });

    if (chordEditor.mode === "edit" && chordEditor.itemId) {
      updateChartSections((sections) =>
        sections.map((section) =>
          section.id === chordEditor.sectionId
            ? {
                ...section,
                items: section.items.map((existing) =>
                  existing.id === chordEditor.itemId ? { ...item, id: existing.id } : existing
                ),
              }
            : section
        )
      );
      setChartMessage(`已更新：${displayChartItemName(item)}`);
    } else {
      updateChartSections((sections) =>
        sections.map((section) =>
          section.id === chordEditor.sectionId ? { ...section, items: [...section.items, item] } : section
        )
      );
      setChartMessage(`已加入到「${activeSection.title}」：${displayChartItemName(item)}`);
    }

    closeChordEditor();
  }

  function parseBatchIntoSection(sectionId) {
    const lines = batchInput.split(/\r?\n/);
    const parsed = [];
    const errors = [];

    lines.forEach((line, index) => {
      if (!line.trim()) return;

      const result = parseShapeLine(line);
      if (!result || result.error) {
        errors.push(result?.error || `第 ${index + 1} 行为空`);
        return;
      }

      const detectedNames = detectedNamesForFrets(result.frets);
      parsed.push(
        createChartItem({
          frets: result.frets,
          detectedNames,
          selectedName: result.label || detectedNames[0] || UNKNOWN_CHORD_NAME,
          source: "批量输入",
        })
      );
    });

    if (!parsed.length) {
      setChartMessage(errors[0] || "没有解析到可用按法。");
      return;
    }

    updateChartSections((sections) =>
      sections.map((section) => (section.id === sectionId ? { ...section, items: [...section.items, ...parsed] } : section))
    );
    setBatchInput("");
    setOpenBatchSectionId("");
    setChartMessage(
      errors.length ? `已加入 ${parsed.length} 个和弦；有 ${errors.length} 行未解析。` : `已批量加入 ${parsed.length} 个和弦。`
    );
  }

  function clearSection(sectionId) {
    updateChartSections((sections) =>
      sections.map((section) => (section.id === sectionId ? { ...section, items: [] } : section))
    );
    setSelectedItemIds([]);
    setChartMessage("已清空段落。");
  }

  function toggleSelectedItem(itemId) {
    setSelectedItemIds((ids) => (ids.includes(itemId) ? ids.filter((id) => id !== itemId) : [...ids, itemId]));
  }

  function chartItemEntriesByIds(itemIds) {
    const selected = new Set(itemIds);
    return chartSections.flatMap((section) =>
      section.items
        .filter((item) => selected.has(item.id))
        .map((item) => ({ sectionId: section.id, item }))
    );
  }

  function selectedItemsInChart() {
    return chartItemEntriesByIds(selectedItemIds).map((entry) => entry.item);
  }

  function chartItemEntryById(itemId) {
    if (!itemId) return null;

    for (const section of chartSections) {
      const itemIndex = section.items.findIndex((item) => item.id === itemId);
      if (itemIndex >= 0) {
        return { sectionId: section.id, itemIndex, item: section.items[itemIndex] };
      }
    }

    return null;
  }

  function setPasteTargetToSectionEnd(sectionId) {
    const section = chartSections.find((item) => item.id === sectionId);
    setPasteTarget({ sectionId, index: section?.items.length || 0 });
  }

  function setPasteTargetAfterItem(sectionId, index) {
    setPasteTarget({ sectionId, index: index + 1 });
  }

  function resolvePasteTarget() {
    if (pasteTarget) {
      const section = chartSections.find((item) => item.id === pasteTarget.sectionId);
      if (section) {
        return {
          sectionId: section.id,
          index: Math.max(0, Math.min(pasteTarget.index, section.items.length)),
        };
      }
    }

    return {
      sectionId: activeSection.id,
      index: activeSection.items.length,
    };
  }

  function parseClipboardItems(text) {
    const lines = String(text || "").split(/\r?\n/);
    const items = [];
    const errors = [];

    lines.forEach((line, index) => {
      if (!line.trim()) return;

      const result = parseShapeLine(line);
      if (!result || result.error) {
        errors.push(result?.error || `第 ${index + 1} 行为空`);
        return;
      }

      const detectedNames = detectedNamesForFrets(result.frets);
      items.push(
        createChartItem({
          frets: result.frets,
          detectedNames,
          selectedName: result.label || detectedNames[0] || UNKNOWN_CHORD_NAME,
          source: "粘贴文本",
        })
      );
    });

    return { items, errors };
  }

  function insertChordItems(sectionId, index, sourceItems, verb = "粘贴") {
    if (!sourceItems.length) return [];

    const insertedItems = sourceItems.map((item) => ({
      ...item,
      id: createId("chord"),
      source: `${item.source || "曲谱记录"} · ${verb}`,
    }));

    updateChartSections((sections) =>
      sections.map((section) => {
        if (section.id !== sectionId) return section;

        const insertIndex = Math.max(0, Math.min(index, section.items.length));
        const items = [...section.items];
        items.splice(insertIndex, 0, ...insertedItems);
        return { ...section, items };
      })
    );

    selectSection(sectionId, { updatePasteTarget: false });
    setPasteTarget({ sectionId, index: index + insertedItems.length });
    setSelectedItemIds(insertedItems.map((item) => item.id));
    return insertedItems;
  }

  async function copySelectedItems() {
    const items = selectedItemsInChart();

    if (!items.length) {
      setChartMessage("请先选择和弦。");
      return;
    }

    const text = sectionClipboardText(items);
    setCopiedChordItems(items.map((item) => ({ ...item })));
    setCopiedChordText(text);
    try {
      await navigator.clipboard.writeText(text);
      setChartMessage(`已复制 ${items.length} 个和弦，可以粘贴到任意段落。`);
    } catch {
      setChartMessage(text);
    }
  }

  function pasteCopiedItems(sectionId, index) {
    if (!copiedChordItems.length) {
      setChartMessage("请先选择和弦并点击复制。");
      return;
    }

    const pastedItems = insertChordItems(sectionId, index, copiedChordItems);
    setChartMessage(`已粘贴 ${pastedItems.length} 个和弦。`);
  }

  function pasteFromClipboardText(text) {
    const target = resolvePasteTarget();
    const clipboardText = String(text || "").trim();
    const savedText = copiedChordText.trim();
    const shouldUseInternalCopy = copiedChordItems.length && (!clipboardText || clipboardText === savedText);
    let sourceItems = shouldUseInternalCopy ? copiedChordItems : [];
    let errors = [];

    if (!sourceItems.length && clipboardText) {
      const parsed = parseClipboardItems(clipboardText);
      sourceItems = parsed.items;
      errors = parsed.errors;
    }

    if (!sourceItems.length && copiedChordItems.length && !clipboardText) {
      sourceItems = copiedChordItems;
    }

    if (!sourceItems.length) {
      setChartMessage(errors[0] || "剪贴板里没有识别到可粘贴的和弦按法。");
      return;
    }

    const insertedItems = insertChordItems(target.sectionId, target.index, sourceItems);
    setChartMessage(
      errors.length
        ? `已粘贴 ${insertedItems.length} 个和弦；有 ${errors.length} 行未解析。`
        : `已粘贴 ${insertedItems.length} 个和弦。`
    );
  }

  function clearSelectedItems() {
    setSelectedItemIds([]);
    setChartMessage("已取消选择。");
  }

  function deleteSelectedItems() {
    if (!selectedItemIds.length) {
      setChartMessage("请先选择和弦。");
      return;
    }

    const selected = new Set(selectedItemIds);
    updateChartSections((sections) =>
      sections.map((section) => ({ ...section, items: section.items.filter((item) => !selected.has(item.id)) }))
    );
    setSelectedItemIds([]);
    setChartMessage("已删除选中的和弦。");
  }

  const firstSelectedEntry = chartItemEntryById(selectedItemIds[0]);

  function createSection() {
    const section = createEmptySection(`段落 ${chartSections.length + 1}`);

    updateActiveChart((chart) => ({
      activeSectionId: section.id,
      sections: [...chart.sections, section],
    }));
    setPasteTarget({ sectionId: section.id, index: 0 });
    setChartMessage(`已添加段落：${section.title}`);
  }

  function selectSection(sectionId, options = {}) {
    updateActiveChart({ activeSectionId: sectionId });
    if (options.updatePasteTarget !== false) {
      setPasteTargetToSectionEnd(sectionId);
    }
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

  function moveChartItemsToSection(itemIds, toSectionId, toIndex) {
    const movingIds = [...new Set(itemIds)];

    if (!movingIds.length) return;

    updateChartSections((sections) => {
      const movingIdSet = new Set(movingIds);
      const targetSection = sections.find((section) => section.id === toSectionId);
      const removedBeforeTarget = targetSection
        ? targetSection.items.slice(0, toIndex).filter((item) => movingIdSet.has(item.id)).length
        : 0;
      const movingItems = [];
      const sectionsWithoutMovingItems = sections.map((section) => {
        const items = [];

        section.items.forEach((item) => {
          if (movingIdSet.has(item.id)) {
            movingItems.push(item);
          } else {
            items.push(item);
          }
        });

        return { ...section, items };
      });

      if (!movingItems.length) return sections;

      return sectionsWithoutMovingItems.map((section) => {
        if (section.id !== toSectionId) return section;

        const adjustedIndex = toIndex - removedBeforeTarget;
        const insertIndex = Math.max(0, Math.min(adjustedIndex, section.items.length));
        const items = [...section.items];
        items.splice(insertIndex, 0, ...movingItems);
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

    moveChartItemsToSection(draggedChord.itemIds, sectionId, index);
    setSelectedItemIds(draggedChord.itemIds);
    selectSection(sectionId);
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

  function saveSyncSettings() {
    const normalized = saveSupabaseConfig(syncConfigDraft);
    const { error: clientError } = createSupabaseClient(normalized);

    if (clientError) {
      setSyncConfigDraft(normalized);
      setSupabaseConfig(normalized);
      setShowSyncSettings(true);
      setCloudReady(false);
      setSyncStatus({ tone: "error", text: clientError });
      return;
    }

    setSupabaseConfig(normalized);
    setShowSyncSettings(false);
    setCloudReady(false);
    setSyncStatus(
      hasSupabaseConfig(normalized)
        ? { tone: "pending", text: "正在连接云同步..." }
        : { tone: "local", text: "未配置云同步，当前仅保存到本机。" }
    );
  }

  function clearSyncSettings() {
    const emptyConfig = saveSupabaseConfig({});
    setSupabaseConfig(emptyConfig);
    setSyncConfigDraft(emptyConfig);
    setShowSyncSettings(false);
    setCloudReady(false);
    setSyncStatus({ tone: "local", text: "已清除云同步配置，当前仅保存到本机。" });
  }

  function getSyncCredentials(requirePassword = true) {
    const email = syncEmail.trim();
    const password = syncPassword;

    if (!syncClient) {
      setSyncStatus({ tone: "error", text: "请先保存 Supabase 配置。" });
      return null;
    }

    if (!email) {
      setSyncStatus({ tone: "error", text: "请输入邮箱。" });
      return null;
    }

    if (requirePassword && password.length < 6) {
      setSyncStatus({ tone: "error", text: "密码至少需要 6 位。" });
      return null;
    }

    return { email, password };
  }

  async function signInWithPassword() {
    const credentials = getSyncCredentials();

    if (!credentials) return;

    setSyncStatus({ tone: "pending", text: "正在登录..." });

    const { data, error } = await syncClient.auth.signInWithPassword({
      email: credentials.email,
      password: credentials.password,
    });

    if (error) {
      const invalidLogin = error.message.toLowerCase().includes("invalid login credentials");

      setSyncStatus({
        tone: "error",
        text: invalidLogin
          ? "密码登录失败：如果还没设置过密码，请先点“注册”收邮箱链接登录一次，然后设置密码。"
          : `密码登录失败：${error.message}`,
      });
      return;
    }

    if (data.user) markPasswordSetupDone(data.user);
    setSyncPassword("");
    setSyncNewPassword("");
    setShowSyncPasswordEditor(false);
    setSyncStatus({ tone: "pending", text: "登录成功，正在读取云端曲谱..." });
  }

  async function sendRegistrationLink() {
    const credentials = getSyncCredentials(false);

    if (!credentials) return;

    setSyncStatus({ tone: "pending", text: "正在发送注册链接..." });

    const { error } = await syncClient.auth.signInWithOtp({
      email: credentials.email,
      options: {
        emailRedirectTo: cloudRedirectUrl(),
      },
    });

    if (error) {
      setSyncStatus({ tone: "error", text: `注册链接发送失败：${error.message}` });
      return;
    }

    markPendingPasswordSetup(credentials.email);
    setSyncStatus({ tone: "pending", text: "注册链接已发送，请打开邮箱完成登录；第一次登录后可以设置密码。" });
  }

  async function updateSyncPassword() {
    if (!syncClient || !syncUser) {
      setSyncStatus({ tone: "error", text: "请先登录后再设置密码。" });
      return;
    }

    if (syncNewPassword.length < 6) {
      setSyncStatus({ tone: "error", text: "新密码至少需要 6 位。" });
      return;
    }

    setSyncStatus({ tone: "pending", text: "正在设置密码..." });

    const { error } = await syncClient.auth.updateUser({
      password: syncNewPassword,
    });

    if (error) {
      setSyncStatus({ tone: "error", text: `密码设置失败：${error.message}` });
      return;
    }

    setSyncNewPassword("");
    markPasswordSetupDone(syncUser);
    setShowSyncPasswordEditor(false);
    setSyncStatus({ tone: "synced", text: "密码已设置，以后可以直接用邮箱和密码登录。" });
  }

  function cancelSyncPasswordEdit() {
    setSyncNewPassword("");
    setShowSyncPasswordEditor(false);
  }

  async function signOutSync() {
    if (!syncClient) return;

    const { error } = await syncClient.auth.signOut();
    setCloudReady(false);
    setSyncNewPassword("");
    setShowSyncPasswordEditor(false);
    setSyncStatus(
      error
        ? { tone: "error", text: `退出失败：${error.message}` }
        : { tone: "local", text: "已退出，当前仅保存到本机。" }
    );
  }

  return (
    <div className="app-shell">
      <header className="topbar">
        <div className="brand">
          <div className="brand-row">
            <div className="brand-mark">G</div>
            <h1>Guitar Songbook</h1>
          </div>
          <p className="subtitle">以按法为中心记录个人曲谱；需要时再用和弦工具查名字、找把位。</p>
        </div>
        <div className="tuning-pill">
          标准调弦 <strong>E A D G B e</strong>
        </div>
      </header>

      <nav className="app-tabs" aria-label="主功能">
        <button className={activeTab === "songbook" ? "tab-button active-tab" : "tab-button"} onClick={() => setActiveTab("songbook")}>
          曲谱记录 / Songbook
        </button>
        <button className={activeTab === "tools" ? "tab-button active-tab" : "tab-button"} onClick={() => setActiveTab("tools")}>
          和弦工具 / Chord Tools
        </button>
      </nav>

      <main className="page-stack">
        <section className={activeTab === "tools" ? "lookup-row" : "lookup-row hidden-tab-panel"}>
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
                <span className="hint">优先展示封闭和高把位；可加入当前曲谱。</span>
              </div>

              {parsedChord.ok && voicings.length ? (
                <div className="voicing-grid">
                  {voicings.map((shape) => (
                    <VoicingCard
                      key={compactShape(shape.frets)}
                      parsed={parsedChord}
                      shape={shape}
                      onUse={() => useShape(shape.frets)}
                      onAdd={() => addChartItem(parsedChord.displayName, shape.frets, shape.name)}
                    />
                  ))}
                </div>
              ) : (
                <div className="empty-state">输入一个可识别的和弦名后，这里会显示多个把位图。</div>
              )}
            </div>
          </section>
        </section>

        <section className={activeTab === "tools" ? "panel reverse-panel" : "panel reverse-panel hidden-tab-panel"}>
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
                  加入当前曲谱
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

        <section className={activeTab === "songbook" ? "panel chart-panel" : "panel chart-panel hidden-tab-panel"}>
          <div className="panel-inner">
            <div className="panel-header compact-header">
              <div className="panel-title">
                <span className="eyebrow">Songbook</span>
                <h2>曲谱记录</h2>
              </div>
              <div className="chart-actions">
                <button className="ghost-button add-button" onClick={createChart}>
                  新建曲谱
                </button>
                <button className="ghost-button add-button" onClick={createSection}>
                  添加段落
                </button>
                <details className="more-actions-menu">
                  <summary className="ghost-button more-actions-trigger">更多</summary>
                  <div className="more-actions-list">
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
                </details>
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

            <div className="sync-card">
              <div className="sync-state">
                <span className={`sync-dot ${syncStatus.tone}`} aria-hidden="true" />
                <div>
                  <strong>{syncUser ? syncUser.email || "已登录" : "云同步"}</strong>
                  <p>{syncStatus.text}</p>
                </div>
              </div>

              <div className="sync-controls">
                {syncConfigured && !syncUser ? (
                  <div className="sync-auth-panel">
                    <div className="sync-login-fields">
                      <input
                        className="text-field sync-email"
                        type="email"
                        value={syncEmail}
                        onChange={(event) => setSyncEmail(event.target.value)}
                        placeholder="邮箱"
                        aria-label="云同步登录邮箱"
                      />
                      <input
                        className="text-field sync-password"
                        type="password"
                        value={syncPassword}
                        onChange={(event) => setSyncPassword(event.target.value)}
                        onKeyDown={(event) => {
                          if (event.key === "Enter") signInWithPassword();
                        }}
                        placeholder="密码"
                        aria-label="云同步登录密码"
                      />
                    </div>
                    <div className="sync-auth-actions">
                      <button className="ghost-button add-button" onClick={signInWithPassword}>
                        密码登录
                      </button>
                      <button className="ghost-button" onClick={sendRegistrationLink}>
                        注册
                      </button>
                    </div>
                  </div>
                ) : null}

                {syncUser ? (
                  <div className="sync-auth-panel sync-account-panel">
                    <div className="sync-account-row">
                      <span className="sync-account-email">登录邮箱：{syncUser.email || "当前账号"}</span>
                      <button
                        className="ghost-button"
                        onClick={() => setShowSyncPasswordEditor((visible) => !visible)}
                      >
                        {showSyncPasswordEditor ? "收起" : "修改密码"}
                      </button>
                      <button className="ghost-button" onClick={signOutSync}>
                        退出
                      </button>
                    </div>

                    {showSyncPasswordEditor ? (
                      <>
                        <div className="sync-login-fields">
                          <input
                            className="text-field sync-password"
                            type="password"
                            value={syncNewPassword}
                            onChange={(event) => setSyncNewPassword(event.target.value)}
                            onKeyDown={(event) => {
                              if (event.key === "Enter") updateSyncPassword();
                            }}
                            placeholder="新密码（至少 6 位）"
                            aria-label="设置云同步密码"
                          />
                        </div>
                        <div className="sync-auth-actions">
                          <button className="ghost-button add-button" onClick={updateSyncPassword}>
                            保存密码
                          </button>
                          <button className="ghost-button" onClick={cancelSyncPasswordEdit}>
                            取消
                          </button>
                        </div>
                      </>
                    ) : null}
                  </div>
                ) : null}

                <button
                  className="ghost-button"
                  onClick={() => {
                    setSyncConfigDraft(supabaseConfig);
                    setShowSyncSettings((value) => !value);
                  }}
                >
                  设置
                </button>
              </div>

              {showSyncSettings || !syncConfigured ? (
                <div className="sync-settings">
                  <input
                    className="text-field"
                    value={syncConfigDraft.url}
                    onChange={(event) =>
                      setSyncConfigDraft((config) => ({ ...config, url: event.target.value }))
                    }
                    placeholder="Supabase Project URL"
                    aria-label="Supabase Project URL"
                  />
                  <input
                    className="text-field"
                    value={syncConfigDraft.anonKey}
                    onChange={(event) =>
                      setSyncConfigDraft((config) => ({ ...config, anonKey: event.target.value }))
                    }
                    placeholder="Supabase anon 或 publishable key"
                    aria-label="Supabase anon 或 publishable key"
                  />
                  <div className="sync-setting-actions">
                    <button className="ghost-button add-button" onClick={saveSyncSettings}>
                      保存设置
                    </button>
                    <button className="ghost-button danger-button" onClick={clearSyncSettings}>
                      清除
                    </button>
                  </div>
                </div>
              ) : null}
            </div>

            <div className="songbook-meta-grid">
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
            </div>

            <p className="save-note">
              曲谱库会自动保存到当前浏览器；登录云同步后，会在同一账号的设备间合并保存。
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
                  onClear={() => clearSection(section.id)}
                  onAddChord={() => openNewChordEditor(section.id)}
                  canPaste={Boolean(copiedChordItems.length)}
                  pasteTargetIndex={pasteTarget?.sectionId === section.id ? pasteTarget.index : null}
                  onPasteAt={(index) => pasteCopiedItems(section.id, index)}
                  batchOpen={openBatchSectionId === section.id}
                  batchInput={batchInput}
                  onToggleBatch={() => {
                    selectSection(section.id);
                    setOpenBatchSectionId((id) => (id === section.id ? "" : section.id));
                    setBatchInput("");
                  }}
                  onBatchInputChange={setBatchInput}
                  onBatchSubmit={() => parseBatchIntoSection(section.id)}
                  selectionToolbar={
                    firstSelectedEntry?.sectionId === section.id ? (
                      <div className="bulk-toolbar section-bulk-toolbar" onClick={(event) => event.stopPropagation()}>
                        <strong>已选 {selectedItemIds.length} 个</strong>
                        <button className="ghost-button" onClick={copySelectedItems}>
                          复制
                        </button>
                        <button
                          className="ghost-button"
                          onClick={() => pasteCopiedItems(section.id, firstSelectedEntry.itemIndex + 1)}
                          disabled={!copiedChordItems.length}
                        >
                          粘贴
                        </button>
                        <button className="ghost-button" onClick={clearSelectedItems}>
                          取消选择
                        </button>
                        {copiedChordItems.length ? (
                          <span className="clipboard-status">已复制 {copiedChordItems.length} 个</span>
                        ) : null}
                        <button className="ghost-button danger-button delete-selected-button" onClick={deleteSelectedItems}>
                          删除和弦
                        </button>
                      </div>
                    ) : null
                  }
                  editorSlot={
                    chordEditor.open && chordEditor.sectionId === section.id ? (
                      <ChordEditorPanel
                        compact
                        editor={chordEditor}
                        recognition={chordEditorRecognition}
                        candidateNames={chordEditorNames}
                        selectedName={chordEditorSelectedName}
                        onBaseFretChange={(baseFret) => setChordEditor((editor) => ({ ...editor, baseFret }))}
                        onStringValueChange={setChordEditorStringValue}
                        onSelectName={(name) =>
                          setChordEditor((editor) => ({
                            ...editor,
                            selectedName: name,
                            customName: name === CUSTOM_CHORD_NAME ? editor.customName : "",
                          }))
                        }
                        onCustomNameChange={(customName) =>
                          setChordEditor((editor) => ({ ...editor, customName, selectedName: CUSTOM_CHORD_NAME }))
                        }
                        onNoteChange={(note) => setChordEditor((editor) => ({ ...editor, note }))}
                        onSave={saveChordEditorItem}
                        onCancel={closeChordEditor}
                      />
                    ) : null
                  }
                  onDropAt={(index) => handleChartDrop(section.id, index)}
                  onDragOverAtEnd={() => markChartDropTarget(section.id, section.items.length)}
                  isDragging={Boolean(draggedChord)}
                  isDropAtEnd={dragTarget?.sectionId === section.id && dragTarget?.index === section.items.length}
                >
                  {section.items.map((item, index) => (
                    <ChartItem
                      item={item}
                      key={item.id}
                      selected={selectedItemIds.includes(item.id)}
                      onSelect={() => toggleSelectedItem(item.id)}
                      canPaste={Boolean(copiedChordItems.length)}
                      isPasteTargetAfter={pasteTarget?.sectionId === section.id && pasteTarget.index === index + 1}
                      isDragging={draggedChord?.itemIds?.includes(item.id)}
                      isDropTarget={
                        !draggedChord?.itemIds?.includes(item.id) &&
                        dragTarget?.sectionId === section.id &&
                        dragTarget?.index === index
                      }
                      onPasteHere={() => pasteCopiedItems(section.id, index + 1)}
                      onSetPasteTarget={() => setPasteTargetAfterItem(section.id, index)}
                      onDragStart={() => {
                        const itemIsSelected = selectedItemIds.includes(item.id);
                        const itemIds = itemIsSelected ? selectedItemIds : [item.id];
                        selectSection(section.id);
                        if (!itemIsSelected) {
                          setSelectedItemIds([item.id]);
                        }
                        setDraggedChord({ itemIds, primaryItemId: item.id });
                        setDragTarget(null);
                      }}
                      onDragOverBefore={() => markChartDropTarget(section.id, index)}
                      onDragEnd={clearChartDrag}
                      onDropBefore={() => handleChartDrop(section.id, index)}
                      onEdit={() => openEditChordEditor(section.id, item)}
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

function ChordEditorPanel({
  compact = false,
  editor,
  recognition,
  candidateNames,
  selectedName,
  onBaseFretChange,
  onStringValueChange,
  onSelectName,
  onCustomNameChange,
  onNoteChange,
  onSave,
  onCancel,
}) {
  return (
    <section className={compact ? "chord-editor-panel section-chord-editor-panel" : "chord-editor-panel"}>
      <div className="panel-header compact-header">
        <div className="panel-title">
          <span className="eyebrow">{editor.mode === "edit" ? "Edit Chord" : "Add Chord"}</span>
          <h2>{editor.mode === "edit" ? "编辑和弦按法" : "+ 添加和弦按法"}</h2>
        </div>
        <span className="hint">可以保存无法识别的按法，也可以使用自定义名称。</span>
      </div>

      <div className="chord-editor-layout">
        <ChordInputDiagram
          compact={compact}
          baseFret={editor.baseFret}
          values={editor.frets}
          onBaseFretChange={onBaseFretChange}
          onStringValueChange={onStringValueChange}
        />

        <div className="chord-editor-side">
          <div className="summary-strip compact-summary">
            <span className="metric">
              输入 <strong>{editor.frets.join(" ")}</strong>
            </span>
            <span className="metric">
              音名 <strong>{recognition.notes.length ? recognition.notes.map((note) => noteName(note.pc)).join(" ") : "无"}</strong>
            </span>
          </div>

          {recognition.error ? <p className="error-text">{recognition.error}</p> : null}

          <div className="candidate-group" aria-label="候选和弦名称">
            {candidateNames.length ? (
              candidateNames.map((name) => (
                <button
                  className={selectedName === name ? "candidate-chip selected-candidate" : "candidate-chip"}
                  key={name}
                  onClick={() => onSelectName(name)}
                >
                  {name}
                </button>
              ))
            ) : (
              <span className="hint">暂时没有识别结果。</span>
            )}
            <button
              className={selectedName === UNKNOWN_CHORD_NAME ? "candidate-chip selected-candidate" : "candidate-chip"}
              onClick={() => onSelectName(UNKNOWN_CHORD_NAME)}
            >
              未知和弦
            </button>
            <button
              className={selectedName === CUSTOM_CHORD_NAME ? "candidate-chip selected-candidate" : "candidate-chip"}
              onClick={() => onSelectName(CUSTOM_CHORD_NAME)}
            >
              自定义名称
            </button>
          </div>

          {selectedName === CUSTOM_CHORD_NAME ? (
            <input
              className="text-field compact-text-field"
              value={editor.customName}
              onChange={(event) => onCustomNameChange(event.target.value)}
              placeholder="输入自定义名称"
              aria-label="自定义和弦名称"
            />
          ) : null}

          <input
            className="text-field compact-text-field"
            value={editor.note}
            onChange={(event) => onNoteChange(event.target.value)}
            placeholder="备注（可选）"
            aria-label="和弦备注"
          />

          <div className="editor-actions">
            <button className="primary-button" onClick={onSave}>
              {editor.mode === "edit" ? "保存修改" : "加入曲谱"}
            </button>
            <button className="ghost-button" onClick={onCancel}>
              取消
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}

function ChordInputDiagram({ baseFret, values, onBaseFretChange, onStringValueChange, compact = false }) {
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
    <div className={compact ? "fretboard-editor compact-fretboard-editor" : "fretboard-editor"}>
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
  onClear,
  onAddChord,
  canPaste,
  pasteTargetIndex,
  onPasteAt,
  batchOpen,
  batchInput,
  onToggleBatch,
  onBatchInputChange,
  onBatchSubmit,
  selectionToolbar,
  editorSlot,
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
    !section.items.length && pasteTargetIndex === 0 ? "paste-at-end" : "",
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
            className="ghost-button add-button"
            onClick={(event) => {
              event.stopPropagation();
              onAddChord();
            }}
          >
            + 按法
          </button>
          <button
            className="ghost-button"
            onClick={(event) => {
              event.stopPropagation();
              onToggleBatch();
            }}
          >
            批量输入
          </button>
          {canPaste ? (
            <button
              className="ghost-button paste-button"
              onClick={(event) => {
                event.stopPropagation();
                onPasteAt(section.items.length);
              }}
            >
              粘贴到末尾
            </button>
          ) : null}
          <button
            className="ghost-button danger-button"
            onClick={(event) => {
              event.stopPropagation();
              onClear();
            }}
          >
            清空
          </button>
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

      {selectionToolbar}

      {editorSlot}

      {batchOpen ? (
        <div className="batch-input-panel" onClick={(event) => event.stopPropagation()}>
          <textarea
            className="batch-textarea"
            value={batchInput}
            onChange={(event) => onBatchInputChange(event.target.value)}
            placeholder={"x32010\n320003\n022000\n\n或：\nx 3 2 0 1 0"}
            aria-label={`${section.title} 批量输入按法`}
          />
          <div className="batch-actions">
            <button className="ghost-button add-button" onClick={onBatchSubmit}>
              生成和弦块
            </button>
            <button className="ghost-button" onClick={onToggleBatch}>
              取消
            </button>
          </div>
        </div>
      ) : null}

      <div className={sequenceClass}>
        {section.items.length ? (
          children
        ) : (
          <div className="section-empty">
            <span>点“+ 按法”或“批量输入”开始记录这个段落。</span>
            {canPaste ? (
              <button
                className="ghost-button paste-button"
                onClick={(event) => {
                  event.stopPropagation();
                  onPasteAt(0);
                }}
              >
                粘贴到这里
              </button>
            ) : null}
          </div>
        )}
      </div>
    </section>
  );
}

function ChartItem({
  item,
  selected,
  onSelect,
  canPaste,
  isPasteTargetAfter,
  isDragging,
  isDropTarget,
  onPasteHere,
  onSetPasteTarget,
  onDragStart,
  onDragOverBefore,
  onDragEnd,
  onDropBefore,
  onEdit,
}) {
  const cardClass = [
    "chart-card",
    selected ? "selected-chart-card" : "",
    isPasteTargetAfter ? "paste-target-after" : "",
    isDragging ? "dragging-card" : "",
    isDropTarget ? "drop-before" : "",
  ]
    .filter(Boolean)
    .join(" ");
  const itemName = displayChartItemName(item);
  const clickTimerRef = useRef(null);

  useEffect(() => {
    return () => {
      if (clickTimerRef.current) {
        window.clearTimeout(clickTimerRef.current);
      }
    };
  }, []);

  function scheduleSelect() {
    if (clickTimerRef.current) {
      window.clearTimeout(clickTimerRef.current);
    }

    clickTimerRef.current = window.setTimeout(() => {
      onSetPasteTarget();
      onSelect();
      clickTimerRef.current = null;
    }, 180);
  }

  function editImmediately() {
    if (clickTimerRef.current) {
      window.clearTimeout(clickTimerRef.current);
      clickTimerRef.current = null;
    }

    onEdit();
  }

  return (
    <article
      className={cardClass}
      draggable="true"
      title="单击选择和弦，双击编辑"
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
      onClick={(event) => {
        event.stopPropagation();
        scheduleSelect();
      }}
      onDoubleClick={(event) => {
        event.stopPropagation();
        editImmediately();
      }}
    >
      {canPaste ? (
        <button
          className="paste-before-button"
          onClick={(event) => {
            event.stopPropagation();
            onPasteHere();
          }}
        >
          粘贴到这里
        </button>
      ) : null}
      <button
        className={selected ? "card-select-circle selected-select-circle" : "card-select-circle"}
        onClick={(event) => {
          event.stopPropagation();
          onSelect();
        }}
        title={selected ? "取消选择" : "选择和弦"}
        aria-pressed={selected}
        aria-label={`${selected ? "取消选择" : "选择"} ${itemName}`}
      />
      <div className="chart-card-main">
        <h3>[{itemName}]</h3>
        <div className="chart-diagram-wrap">
          <ChordDiagram shape={item.frets} root={item.root} startAtLowestFret showFretNumbers={false} />
        </div>
        {item.note ? <p className="card-note">{item.note}</p> : null}
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

function ChordDiagram({ shape, root, startAtLowestFret = false, showFretNumbers = true }) {
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
            {showFretNumbers ? (
              <text className="diagram-text" x={x} y={y + 0.5}>
                {fret}
              </text>
            ) : null}
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
