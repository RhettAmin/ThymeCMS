/**
 * Nutrient scaling utilities — converts per-100g FDC/Foundation Foods nutrient
 * profiles to the actual quantity used in a recipe, live on the page.
 *
 * Reference: USDA FoodData Central Foundation Foods documentation
 * (https://fdc.nal.usda.gov/Foundation_Foods_Documentation) — nutrient values
 * are reported per 100g edible portion, so scaling is a proportional multiply
 * once the recipe quantity is expressed in grams.
 *
 * The hard part isn't the math — it's getting "grams used" from whatever unit
 * the recipe actually specifies (grams, cups, tbsp, cloves, etc). See
 * resolveGrams() below; it depends on unitConversion.ts.
 */

import { Ingredient } from "@/models/recipeModels";
import {
  convertWeight,
  convertVolumeToWeight,
  normalizeUnit,
  ConversionType,
  WeightUnit,
  VolumeUnit,
} from "./unitConversion";

export interface NutrientProfile {
  calories: number;
  fat: number;
  saturatedFat: number;
  transFat: number;
  carbohydrate: number;
  fibre: number;
  sugars: number;
  protein: number;
  cholesterol: number;
  sodium: number;
  vitaminD: number;
  iron: number;
  potassium: number;
  calcium: number;
}

const NUTRIENT_KEYS: (keyof NutrientProfile)[] = [
  "calories", "fat", "saturatedFat", "transFat", "carbohydrate",
  "fibre", "sugars", "protein", "cholesterol", "sodium",
  "vitaminD", "iron", "potassium", "calcium",
];

function round(n: number, decimals = 2): number {
  const factor = 10 ** decimals;
  return Math.round(n * factor) / factor;
}

// ── Core scaling ─────────────────────────────────────────────────────────

/**
 * Scale a per-100g FDC nutrient profile to an arbitrary gram quantity.
 * e.g. 30g of sugar -> each value * (30 / 100).
 */
export function scaleNutrientsByGrams(per100g: NutrientProfile, grams: number): Ingredient {
  const factor = grams / 100;
  const ing = new Ingredient
  for (const key of NUTRIENT_KEYS) {
    ing[key] = round(per100g[key] * factor);
  }
  return ing;
}

// ── Resolving "grams used" from a recipe_ingredients row ──────────────────

export interface GramsResolution {
  grams: number;
  /** True if this required a density assumption (no per-ingredient density supplied). */
  isApproximate: boolean;
}

/**
 * Resolve the gram-weight basis for a single recipe_ingredient line.
 *
 * - WEIGHT (oz, lb, g, kg, ...): EXACT, no density needed.
 * - VOLUME (tsp, tbsp, cup, ml, ...): requires a density (g/ml). Falls back
 *   to water (1 g/ml) if none supplied — same caveat as unitConversion.ts,
 *   flagged via `isApproximate` so the UI can show a "~" or tooltip.
 * - OTHER (cloves, items, pods, biscuits, ...): there is no formula. Returns
 *   null unless `gramWeightOverride` is supplied. This is the open question
 *   from the schema design — whether recipe_ingredients needs a stored
 *   `gram_weight` column to preserve the resolved basis for exactly this case.
 * - `gramWeightOverride` (e.g. a stored gram_weight value, or "3 cloves garlic
 *   = 9g" entered manually) always takes priority over computed conversion,
 *   for all three conversion types.
 */
export function resolveGrams(
  quantity: number,
  measurement: string,
  conversionType: ConversionType,
  options?: { densityGPerMl?: number; gramWeightOverride?: number }
): GramsResolution | null {
  if (options?.gramWeightOverride != null) {
    return { grams: options.gramWeightOverride, isApproximate: false };
  }

  const normalized = normalizeUnit(measurement);

  if (conversionType === "WEIGHT") {
    if (!normalized) return null;
    return { grams: convertWeight(quantity, normalized as WeightUnit, "g"), isApproximate: false };
  }

  if (conversionType === "VOLUME") {
    if (!normalized) return null;
    const density = options?.densityGPerMl ?? 1; // water fallback
    return {
      grams: convertVolumeToWeight(quantity, normalized as VolumeUnit, "g", density),
      isApproximate: options?.densityGPerMl == null,
    };
  }

  // OTHER — cloves, items, pods, etc. No formula without a manual gram value.
  return null;
}

// ── End-to-end: scale one ingredient's nutrients by its recipe usage ──────

export interface ScaledIngredientResult {
  nutrients: NutrientProfile;
  grams: number;
  isApproximate: boolean;
}

/**
 * Scale an ingredient's per-100g FDC profile to its actual recipe usage.
 * Returns null if grams can't be resolved (OTHER type, no override, e.g.
 * "2 cloves garlic" with no gram_weight stored) — the caller should decide
 * how to surface that (e.g. show nutrition as "—" rather than 0, since 0 is
 * misleading and silently wrong).
 */
export function scaleIngredientNutrients(
  per100g: NutrientProfile,
  quantity: number,
  measurement: string,
  conversionType: ConversionType,
  options?: { densityGPerMl?: number; gramWeightOverride?: number }
): ScaledIngredientResult | null {
  const resolved = resolveGrams(quantity, measurement, conversionType, options);
  if (!resolved) return null;

  return {
    nutrients: scaleNutrientsByGrams(per100g, resolved.grams),
    grams: resolved.grams,
    isApproximate: resolved.isApproximate,
  };
}

// ── Aggregating across a recipe ────────────────────────────────────────────

/** Sum scaled nutrient profiles, e.g. across all ingredients in a recipe. */
export function sumNutrientProfiles(profiles: NutrientProfile[]): NutrientProfile {
  const total = {} as NutrientProfile;
  for (const key of NUTRIENT_KEYS) {
    total[key] = round(profiles.reduce((sum, p) => sum + p[key], 0));
  }
  return total;
}

/** Derive per-serving values from a recipe-level total (matches the existing
 *  snapshot-totals-divided-by-servings approach to recipe nutrition). */
export function perServing(total: NutrientProfile, servings: number): NutrientProfile {
  if (servings <= 0) throw new Error("servings must be greater than 0");
  const result = {} as NutrientProfile;
  for (const key of NUTRIENT_KEYS) {
    result[key] = round(total[key] / servings);
  }
  return result;
}