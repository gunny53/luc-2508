import { Controller, Get, Header, Query } from '@nestjs/common'
import { SkipThrottle } from '@nestjs/throttler'
import { ZodSerializerDto } from 'nestjs-zod'
import { SearchProductsQueryDTO, SearchProductsResDTO } from './search.dto'
import { SearchService } from './search.service'
import { IsPublic } from 'src/shared/decorators/auth.decorator'

@SkipThrottle()
@Controller('search')
@IsPublic()
export class SearchController {
  constructor(private readonly searchService: SearchService) {}

  /* English content normalized from the original source text. */
  @Get('products')
  @ZodSerializerDto(SearchProductsResDTO)
  @Header('Cache-Control', 'public, max-age=600, s-maxage=900, stale-while-revalidate=1800')
  @Header('Vary', 'Accept-Language, Accept-Encoding, User-Agent')
  @Header('X-Cache-Strategy', 'redis+elasticsearch+smart-search')
  @Header('X-Search-Type', 'elasticsearch')
  searchProducts(@Query() query: SearchProductsQueryDTO) {
    return this.searchService.searchProducts(query as any)
  }
}
