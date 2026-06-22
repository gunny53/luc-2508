import { Module } from '@nestjs/common'
import { LanguageController } from '@routes/language/language.controller'
import { LanguageRepo } from '@routes/language/language.repo'
import { LanguageService } from '@routes/language/language.service'

@Module({
  providers: [LanguageService, LanguageRepo],
  controllers: [LanguageController]
})
export class LanguageModule {}
