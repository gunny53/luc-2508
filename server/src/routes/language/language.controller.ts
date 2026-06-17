import { Body, Controller, Delete, Get, Param, Post, Put } from '@nestjs/common'
import { ZodSerializerDto } from 'nestjs-zod'
import {
  CreateLanguageBodyDTO,
  GetLanguageDetailResDTO,
  GetLanguageParamsDTO,
  GetLanguagesResDTO,
  UpdateLanguageBodyDTO
} from 'src/routes/language/language.dto'
import { LanguageService } from 'src/routes/language/language.service'
import { ActiveUser } from 'src/shared/decorators/active-user.decorator'
import { MessageResDTO } from 'src/shared/dtos/response.dto'
import { AccessTokenPayload } from 'src/shared/types/jwt.type'

@Controller('languages')
export class LanguageController {
  constructor(private readonly languageService: LanguageService) {}

  @Get()
  @ZodSerializerDto(GetLanguagesResDTO)
  findAll() {
    return this.languageService.findAll()
  }

  @Get(':languageId')
  @ZodSerializerDto(GetLanguageDetailResDTO)
  findById(@Param() params: GetLanguageParamsDTO) {
    return this.languageService.findById(params.languageId)
  }

  @Post()
  @ZodSerializerDto(GetLanguageDetailResDTO)
  create(@Body() body: CreateLanguageBodyDTO, @ActiveUser() user: AccessTokenPayload) {
    return this.languageService.create({
      data: body,
      createdById: user.userId
    } as any)
  }
  // English content normalized from the original source text.

  // English content normalized from the original source text.

  @Put(':languageId')
  @ZodSerializerDto(GetLanguageDetailResDTO)
  update(
    @Body() body: UpdateLanguageBodyDTO,
    @Param() params: GetLanguageParamsDTO,
    @ActiveUser() user: AccessTokenPayload
  ) {
    return this.languageService.update({
      data: body,
      id: params.languageId,
      updatedById: user.userId
    } as any)
  }

  @Delete(':languageId')
  @ZodSerializerDto(MessageResDTO)
  delete(@Param() params: GetLanguageParamsDTO) {
    return this.languageService.delete(params.languageId)
  }
}
