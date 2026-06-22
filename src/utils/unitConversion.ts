/**
 * Unit conversion utilities for Thyme to Dine's imperial/metric display toggle.
 *
 * Design notes (matching the project's existing architecture decisions):
 * - Same-dimension conversions (volume<->volume, weight<->weight) are EXACT.
 * - Cross-dimension conversions (volume<->weight, e.g. cups<->grams) require a
 *   per-ingredient density and are inherently approximate. They default to
 *   water's density (1 g/ml) when no ingredient-specific density is supplied,
 *   which is the primary source of imperial-display inaccuracy.
 * - conversion_type === "OTHER" (cloves, items, pods, etc.) is never
 *   convertible and is passed through unchanged.
 * - Source figures: USDA ARS Measurement Conversion Tables (MAFCL), Beltsville.
 */

export type ConversionType = "WEIGHT" | "VOLUME" | "OTHER"

export type VolumeUnit = "tsp" | "tbsp" | "fl_oz" | "cup" | "pint" | "quart" | "gallon" | "ml" | "l"
export type WeightUnit = "g" | "kg" | "oz" | "lb"

// ── Base-unit conversion factors ────────────────────────────────────────
// Volume base unit: milliliters. Weight base unit: grams.
// "1 unit = X base units"

const VOLUME_TO_ML: Record<VolumeUnit, number> = {
  tsp: 4.92892,
  tbsp: 14.7868,     // = 3 tsp
  fl_oz: 29.5735,    // = 2 tbsp
  cup: 236.588,      // = 8 fl oz
  pint: 473.176,     // = 2 cups
  quart: 946.353,    // = 2 pints
  gallon: 3785.41,   // = 4 quarts
  ml: 1,
  l: 1000,
}

const WEIGHT_TO_G: Record<WeightUnit, number> = {
  g: 1,
  kg: 1000,
  oz: 28.3495,
  lb: 453.592,       // = 16 oz
}

// ── Unit string normalization ───────────────────────────────────────────
// Maps the free-text unit strings actually stored in recipe_ingredients.measurement
// (plural/singular, abbreviations, full words) to canonical unit keys.

const UNIT_ALIASES: Record<string, VolumeUnit | WeightUnit> = {
  // Volume
  tsp: "tsp", teaspoon: "tsp", teaspoons: "tsp",
  tbsp: "tbsp", tablespoon: "tbsp", tablespoons: "tbsp",
  "fl oz": "fl_oz", floz: "fl_oz", fl_oz: "fl_oz", "fluid ounce": "fl_oz", "fluid ounces": "fl_oz",
  cup: "cup", cups: "cup",
  pint: "pint", pints: "pint", pt: "pint",
  quart: "quart", quarts: "quart", qt: "quart",
  gallon: "gallon", gallons: "gallon", gal: "gallon",
  ml: "ml", millilitre: "ml", millilitres: "ml", milliliter: "ml", milliliters: "ml",
  l: "l", litre: "l", litres: "l", liter: "l", liters: "l",
  // Weight
  g: "g", gram: "g", grams: "g",
  kg: "kg", kilogram: "kg", kilograms: "kg",
  oz: "oz", ounce: "oz", ounces: "oz",
  lb: "lb", lbs: "lb", pound: "lb", pounds: "lb",
}

/**
 * Normalize a free-text unit string (e.g. "litres", "Gram", "Tbsp") to a
 * canonical VolumeUnit/WeightUnit key, or null if unrecognized (e.g. "cloves",
 * "medium", "biscuits" — these belong to conversion_type OTHER).
 */
export function normalizeUnit(raw: string): VolumeUnit | WeightUnit | null {
  const key = raw.trim().toLowerCase()
  return UNIT_ALIASES[key] ?? null
}

// ── Same-dimension (exact) conversions ──────────────────────────────────

export function convertVolume(quantity: number, from: VolumeUnit, to: VolumeUnit): number {
  const ml = quantity * VOLUME_TO_ML[from]
  return ml / VOLUME_TO_ML[to]
}

export function convertWeight(quantity: number, from: WeightUnit, to: WeightUnit): number {
  const grams = quantity * WEIGHT_TO_G[from]
  return grams / WEIGHT_TO_G[to]
}

// ── Cross-dimension (approximate, density-dependent) conversions ───────

/**
 * @param densityGPerMl Defaults to water (1 g/ml). Pass an ingredient-specific
 *   density when available for better accuracy (e.g. flour ~0.53 g/ml, honey ~1.42 g/ml).
 */
export function convertVolumeToWeight(
  quantity: number,
  from: VolumeUnit,
  to: WeightUnit,
  densityGPerMl: number = 1
): number {
  const ml = quantity * VOLUME_TO_ML[from]
  const grams = ml * densityGPerMl
  return grams / WEIGHT_TO_G[to]
}

export function convertWeightToVolume(
  quantity: number,
  from: WeightUnit,
  to: VolumeUnit,
  densityGPerMl: number = 1
): number {
  const grams = quantity * WEIGHT_TO_G[from]
  const ml = grams / densityGPerMl
  return ml / VOLUME_TO_ML[to]
}

// ── "Nice" display unit selection ───────────────────────────────────────
// Picks a sensible unit for imperial display rather than always showing the
// same unit (e.g. 1.5 cups instead of 0.09375 gallons).

function round(n: number, decimals = 2): number {
  const factor = 10 ** decimals
  return Math.round(n * factor) / factor
}

export function metricVolumeToImperialDisplay(ml: number): { quantity: number, unit: VolumeUnit } {
  if (ml < VOLUME_TO_ML.tbsp) return { quantity: round(ml / VOLUME_TO_ML.tsp), unit: "tsp" }
  if (ml < VOLUME_TO_ML.cup) return { quantity: round(ml / VOLUME_TO_ML.tbsp), unit: "tbsp" }
  if (ml < VOLUME_TO_ML.quart) return { quantity: round(ml / VOLUME_TO_ML.cup), unit: "cup" }
  if (ml < VOLUME_TO_ML.gallon) return { quantity: round(ml / VOLUME_TO_ML.quart), unit: "quart" }
  return { quantity: round(ml / VOLUME_TO_ML.gallon), unit: "gallon" }
}

export function metricWeightToImperialDisplay(g: number): { quantity: number, unit: WeightUnit } {
  if (g < WEIGHT_TO_G.lb) return { quantity: round(g / WEIGHT_TO_G.oz), unit: "oz" }
  return { quantity: round(g / WEIGHT_TO_G.lb), unit: "lb" }
}

// ── Top-level entry point ───────────────────────────────────────────────

export interface DisplayQuantity {
  quantity: number
  unit: string
}

/**
 * Convert a recipe_ingredients (quantity, measurement) pair for live display,
 * driven by the ingredient's conversion_type.
 *
 * - conversion_type "OTHER" -> passed through unchanged (not convertible).
 * - "metric" target -> normalized to ml (volume) or g (weight).
 * - "imperial" target -> normalized to a sensible imperial unit (tsp/tbsp/cup/.../oz/lb).
 * - Unrecognized unit strings are passed through unchanged rather than throwing,
 *   so malformed/legacy data (e.g. inconsistent unit naming) degrades gracefully.
 */
export function convertForDisplay(
  quantity: number,
  unit: string,
  conversionType: ConversionType,
  targetSystem: "metric" | "imperial"
): DisplayQuantity {
  if (conversionType === "OTHER") {
    return { quantity, unit }
  }

  const normalized = normalizeUnit(unit)
  if (!normalized) {
    return { quantity, unit } // unrecognized unit string — don't guess, pass through
  }

  if (conversionType === "VOLUME") {
    const from = normalized as VolumeUnit
    if (targetSystem === "metric") {
      return { quantity: round(convertVolume(quantity, from, "ml")), unit: "ml" }
    }
    return metricVolumeToImperialDisplay(convertVolume(quantity, from, "ml"))
  }

  // conversionType === "WEIGHT"
  const from = normalized as WeightUnit
  if (targetSystem === "metric") {
    return { quantity: round(convertWeight(quantity, from, "g")), unit: "g" }
  }
  return metricWeightToImperialDisplay(convertWeight(quantity, from, "g"))
}