import { Module } from '@nestjs/common'
import { SearchController } from './search.controller'
import { SearchService } from './search.service'
import { SearchRepo } from './search.repo'
import { ElasticsearchService } from '@shared/services/elasticsearch.service'
import { SearchSyncService } from '@shared/services/search-sync.service'
import { SearchSyncConsumer } from '@shared/queue/consumer/search-sync.consumer'
import { BullModule } from '@nestjs/bullmq'
import { SEARCH_SYNC_QUEUE_NAME } from '@shared/constants/search-sync.constant'

@Module({
  imports: [
    BullModule.registerQueue({
      name: SEARCH_SYNC_QUEUE_NAME
    })
  ],
  controllers: [SearchController],
  providers: [SearchService, SearchRepo, ElasticsearchService, SearchSyncService, SearchSyncConsumer]
})
export class SearchModule {}
