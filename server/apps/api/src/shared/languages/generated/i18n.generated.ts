import type { Path } from 'nestjs-i18n'

export type I18nTranslationValue = string | { [key: string]: I18nTranslationValue }
export type I18nTranslations = { [key: string]: I18nTranslationValue }
export type I18nPath = Path<I18nTranslations>
