import { Body, Controller, Delete, Get, Param, Post, Put } from '@nestjs/common'
import { ZodSerializerDto } from 'nestjs-zod'
import {
  CreateLanguageBodyDTO,
  GetLanguageDetailResDTO,
  GetLanguageParamsDTO,
  GetLanguagesResDTO,
  UpdateLanguageBodyDTO
} from '@routes/language/language.dto'
import { LanguageService } from '@routes/language/language.service'
import { ActiveUser } from '@shared/decorators/active-user.decorator'
import { MessageResDTO } from '@shared/dtos/response.dto'
import { AccessTokenPayload } from '@shared/types/jwt.type'

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
