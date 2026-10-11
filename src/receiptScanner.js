const STORE_PATTERNS = [
  { name: 'Lidl', patterns: [/\blidl\b/i] },
  { name: 'Aldi', patterns: [/\baldi\b/i] },
  { name: 'Tesco', patterns: [/\btesco\b/i] },
  { name: 'Dunnes Stores', patterns: [/\bdunnes\b/i] },
  { name: 'SuperValu', patterns: [/\bsupervalu\b/i] },
  { name: 'Marks & Spencer', patterns: [/\bmarks?\s*&?\s*spencer\b/i, /\bm&s\b/i] },
  { name: 'SPAR', patterns: [/\bspar\b/i] },
  { name: 'Centra', patterns: [/\bcentra\b/i] },
  { name: 'Gala', patterns: [/\bgala\b/i] },
  { name: 'Londis', patterns: [/\blondis\b/i] },
  { name: 'Costco', patterns: [/\bcostco\b/i] },
  { name: 'Carrefour', patterns: [/\bcarrefour\b/i] },
  { name: 'Albert Heijn', patterns: [/\balbert heijn\b/i] },
  { name: 'Jumbo', patterns: [/\bjumbo\b/i] },
  { name: 'Rewe', patterns: [/\brewe\b/i] },
  { name: 'Edeka', patterns: [/\bedeka\b/i] },
  { name: 'Netto', patterns: [/\bnetto\b/i] },
  { name: 'Penny', patterns: [/\bpenny\b/i] },
  { name: 'Kaufland', patterns: [/\bkaufland\b/i] },
  { name: 'Sainsbury\'s', patterns: [/\bsainsbur(y|y\'?s)\b/i] },
  { name: 'Asda', patterns: [/\basda\b/i] },
  { name: 'Morrisons', patterns: [/\bmorrison?s\b/i] },
  { name: 'Waitrose', patterns: [/\bwaitrose\b/i] },
  { name: 'Ahold', patterns: [/\bahold\b/i] },
  { name: 'Delhaize', patterns: [/\bdelhaize\b/i] },
  { name: 'Albertsons', patterns: [/\balbertsons\b/i] },
  { name: 'Kroger', patterns: [/\bkroger\b/i] },
  { name: 'Safeway', patterns: [/\bsafeway\b/i] },
  { name: 'Walmart', patterns: [/\bwalmart\b/i] },
  { name: 'Whole Foods', patterns: [/\bwhole\s*foods\b/i] },
  { name: 'Trader Joe\'s', patterns: [/\btrader joe'?s\b/i] }
];

const NOISE_PATTERNS = [
  /total/i, /sub-?total/i, /amount\s*due/i, /balance/i, /change/i, /cash/i, /card/i, /visa/i,
  /master\s*card/i, /maestro/i, /contactless/i, /approved/i, /transaction/i, /vat/i, /tax/i,
  /thank/i, /welcome/i, /loyal/i, /points/i, /coupon/i, /voucher/i, /discount/i, /savings/i,
  /cashier/i, /till/i, /terminal/i, /chip/i, /pin/i, /receipt/i, /www\./i, /http/i, /\btel\b/i,
  /phone/i, /fax/i, /customer/i, /parking/i, /bag\s*(fee|charge)?/i, /gst/i, /tax\s*id/i,
  /vat\s*(no|no\.|number|id)/i, /store\s*(no|number)/i, /invoice/i, /payment/i, /€\s*\d+\.\d{2}\s*$/i,
  /\bchange\b/i, /rounding/i, /rounded/i, /airtime/i, /top\s*up/i, /gift\s*card/i, /euro\s*pump/i
];

const DATE_PATTERN = /\b(\d{1,2}[./-]\d{1,2}[./-]\d{2,4}|\d{4}-\d{2}-\d{2})\b/;
const TIME_PATTERN = /\b\d{1,2}:\d{2}(:\d{2})?\b/;

const TITLE_CASE = (s) =>
  s.toLowerCase().replace(/(^|[\s./&(-])([a-z\u00C0-\u00FF])/g, (m, p, c) => p + c.toUpperCase());

const isNoise = (line) =>
  NOISE_PATTERNS.some(p => p.test(line)) ||
  DATE_PATTERN.test(line) ||
  TIME_PATTERN.test(line) ||
  STORE_PATTERNS.some(s => s.patterns.some(p => p.test(line)));

const detectStore = (text) => {
  for (const store of STORE_PATTERNS) {
    if (store.patterns.some(p => p.test(text))) return store.name;
  }
  return '';
};

const parsePrice = (rawLine) => {
  const line = rawLine.replace(/[€£$]/g, '').trim();
  const m = line.match(/(-?\d+(?:[.,]\d{1,2})?)\s*[A-DX*@]?\s*$/);
  if (!m) return null;
  const price = parseFloat(m[1].replace(',', '.'));
  if (isNaN(price)) return null;
  const name = line.substring(0, line.length - m[0].length).trim();
  return { price, name };
};

const parseQuantity = (name) => {
  let cleaned = name;
  let quantity = 1;

  const mult = cleaned.match(/^(\d+)\s*[xX*]\s*(.+)$/);
  if (mult) {
    quantity = parseFloat(mult[1]) || 1;
    cleaned = mult[2].trim();
    const weight = cleaned.match(/(\d+(?:\.\d+)?)\s?(kg|g|ml|l|lt)\b/i);
    return { name: cleaned, quantity, unit: weight ? weight[2].toLowerCase() : '' };
  }

  const trailing = cleaned.match(/(.+?)\s+(\d+)\s*[xX*]$/);
  if (trailing) {
    quantity = parseFloat(trailing[2]) || 1;
    cleaned = trailing[1].trim();
  }

  const weight = cleaned.match(/(\d+(?:\.\d+)?)\s?(kg|g|ml|l|lt)\b/i);
  let unit = '';
  if (weight) {
    unit = weight[2].toLowerCase();
  } else {
    const countUnit = cleaned.match(/(\d+)\s?(pcs?|pieces?|cans?|bottles?|packs?|bags?|boxes|loaf|rolls?|heads?|cloves?|bunches?)\b/i);
    if (countUnit) unit = countUnit[2].toLowerCase();
  }

  return { name: cleaned, quantity, unit };
};

const parseReceiptLines = (text) => {
  const items = [];
  const seen = new Set();
  text.split(/\r?\n/).forEach(rawLine => {
    const line = rawLine.replace(/\s+/g, ' ').trim();
    if (line.length < 3) return;
    if (isNoise(line)) return;

    const parsed = parsePrice(line);
    if (!parsed) return;
    const nameRaw = parsed.name;
    if (nameRaw.length < 2) return;
    if (/^\d+(\.\d+)?$/.test(nameRaw)) return;

    const { name, quantity, unit } = parseQuantity(TITLE_CASE(nameRaw));
    const key = name.toLowerCase().trim();
    if (seen.has(key)) {
      const existing = items.find(i => i.name.toLowerCase().trim() === key);
      if (existing) {
        existing.quantity += quantity;
        existing.price += parsed.price;
      }
      return;
    }
    seen.add(key);
    items.push({ name, quantity, unit, price: Math.round(parsed.price * 100) / 100, include: true, frequencyChoice: null });
  });
  return items.slice(0, 60);
};

export { detectStore, parseReceiptLines, STORE_PATTERNS };
