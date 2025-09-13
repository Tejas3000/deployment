// Lightweight wrapper around Gradio Client for the Indic-Classify space
import { Client } from "@gradio/client";

const SPACE_ID = "Santhosh737/Indic-Classify";

let _clientPromise;

async function getClient() {
  if (!_clientPromise) {
    _clientPromise = Client.connect(SPACE_ID);
  }
  return _clientPromise;
}

export const MODELS = [
  { label: "DistilBERT", value: "DistilBERT" },
  { label: "mBERT", value: "mBERT" },
  { label: "XLM-R", value: "XLM-R" },
];

// Predict top categories for a given text and model.
// Returns an array of { label, score } sorted by score desc.
export async function predictHeadline(text, model_choice = MODELS[0].value) {
  if (!text || !text.trim()) throw new Error("Please enter a headline.");
  const client = await getClient();

  // The Space exposes /predict expecting { text, model_choice }
  const result = await client.predict("/predict", {
    text,
    model_choice,
  });

  // Try common gradio output shapes: result.data could be
  // - array of objects { label, score }
  // - object with { label, confidences: [{label, confidence}] }
  // - map-like object { label: score }
  // - nested arrays. We'll normalize to array of {label, score}
  const data = result?.data ?? result;

  // 1) Object with confidences array
  if (data && typeof data === "object" && !Array.isArray(data)) {
    if (Array.isArray(data.confidences)) {
      const items = data.confidences
        .map((c) => ({
          label: c?.label ?? String(c?.[0] ?? ""),
          score: Number(c?.confidence ?? c?.score ?? c?.[1] ?? 0),
        }))
        .filter((x) => x.label)
        .sort((a, b) => b.score - a.score);
      if (items.length) return items;
    }

    // 2) Single { label, confidence }
    if ("label" in data && ("confidence" in data || "score" in data)) {
      return [
        { label: data.label, score: Number(data.confidence ?? data.score ?? 0) },
      ];
    }

    // 3) Map of label -> score
    const entries = Object.entries(data).filter(([k, v]) => typeof v === "number");
    if (entries.length >= 2) {
      return entries
        .map(([label, score]) => ({ label, score: Number(score) }))
        .sort((a, b) => b.score - a.score);
    }
  }

  // 4) Array cases
  if (Array.isArray(data)) {
    // Array with object that contains confidences array
    if (
      data.length === 1 &&
      typeof data[0] === "object" &&
      Array.isArray(data[0]?.confidences)
    ) {
      const confs = data[0].confidences;
      return confs
        .map((c) => ({
          label: c?.label ?? String(c?.[0] ?? ""),
          score: Number(c?.confidence ?? c?.score ?? c?.[1] ?? 0),
        }))
        .filter((r) => r.label)
        .sort((a, b) => b.score - a.score);
    }

    // Array of rows
    if (Array.isArray(data[0])) {
      return data
        .map((row) => ({ label: String(row[0]), score: Number(row[1]) }))
        .filter((r) => r.label && Number.isFinite(r.score))
        .sort((a, b) => b.score - a.score);
    }

    // Array of objects
    if (typeof data[0] === "object") {
      return data
        .map((x) => ({
          label: x?.label ?? String(x?.[0] ?? ""),
          score: Number(x?.score ?? x?.confidence ?? x?.[1] ?? 0),
        }))
        .filter((r) => r.label)
        .sort((a, b) => b.score - a.score);
    }
  }

  // 5) Object with data: [] (rows)
  if (Array.isArray(data?.data)) {
    const rows = data.data;
    if (Array.isArray(rows[0])) {
      return rows
        .map((row) => ({ label: String(row[0]), score: Number(row[1]) }))
        .filter((r) => r.label && Number.isFinite(r.score))
        .sort((a, b) => b.score - a.score);
    }
    if (typeof rows[0] === "object") {
      return rows
        .map((x) => ({
          label: x?.label ?? String(x?.[0] ?? ""),
          score: Number(x?.score ?? x?.confidence ?? x?.[1] ?? 0),
        }))
        .filter((r) => r.label)
        .sort((a, b) => b.score - a.score);
    }
  }

  const items = [];
  if (typeof console !== "undefined") {
    try { console.warn?.("indicClient: Unrecognized response shape", data); } catch {}
  }

  return items;
}

export async function healthcheck() {
  try {
    const client = await getClient();
    return Boolean(client);
  } catch (e) {
    return false;
  }
}
