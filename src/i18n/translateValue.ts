import type { TFunction } from 'i18next';

type ValueCategory = 'status' | 'gender' | 'species';

/**
 * The Rick & Morty API only serves English. For fields with a known, finite set
 * of values (status, gender, common species) we map them to the active language
 * via i18next. Unknown/free-form values (rare species, types, proper nouns) fall
 * back to the original API string so nothing ever renders blank.
 */
export const translateValue = (
  t: TFunction,
  category: ValueCategory,
  value?: string | null,
): string => {
  if (!value) return '';
  return t(`values.${category}.${value.toLowerCase()}`, { defaultValue: value });
};
