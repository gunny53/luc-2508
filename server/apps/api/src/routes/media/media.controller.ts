import {
  Body,
  Controller,
  FileTypeValidator,
  Get,
  MaxFileSizeValidator,
  NotFoundException,
  Param,
  Post,
  Res,
  UploadedFiles,
  UseInterceptors
} from '@nestjs/common'
import { FilesInterceptor } from '@nestjs/platform-express'
import { Response } from 'express'
import { ZodSerializerDto } from 'nestjs-zod'
import path from 'path'
import { UploadFilesResDTO, BatchPresignedUploadBodyDTO, BatchPresignedUploadResDTO } from '@routes/media/media.dto'
import { MediaService } from '@routes/media/media.service'
import { ParseFilePipeWithUnlink } from '@routes/media/parse-file-pipe-with-unlink.pipe'
import { UPLOAD_DIR } from '@shared/constants/other.constant'
import { IsPublic } from '@shared/decorators/auth.decorator'

@Controller('media')
export class MediaController {
  constructor(private readonly mediaService: MediaService) {}

  @Post('images/uploads')
  @ZodSerializerDto(UploadFilesResDTO)
  @UseInterceptors(
    FilesInterceptor('files', 100, {
      limits: {
        fileSize: 10 * 1024 * 1024 
      }
    })
  )
  uploadFile(
    @UploadedFiles(
      new ParseFilePipeWithUnlink({
        validators: [
          new MaxFileSizeValidator({ maxSize: 1 * 1024 * 1024 }), 
          new FileTypeValidator({ fileType: /(jpg|jpeg|png|webp)$/, skipMagicNumbersValidation: true })
        ]
      })
    )
    files: Array<Express.Multer.File>
  ) {
    return this.mediaService.uploadFile(files)
    
    
    
  }

  @Get('static/:filename')
  @IsPublic()
  serveFile(@Param('filename') filename: string, @Res() res: Response) {
    return res.sendFile(path.resolve(UPLOAD_DIR, filename), (error) => {
      if (error) {
        const notfound = new NotFoundException('File not found')
        res.status(notfound.getStatus()).json(notfound.getResponse())
      }
    })
  }

  @Post('images/upload/presigned-urls')
  @ZodSerializerDto(BatchPresignedUploadResDTO)
  @IsPublic()
  async createBatchPresignedUrls(@Body() body: BatchPresignedUploadBodyDTO) {
    return this.mediaService.getBatchPresignUrls(body.files)
  }
}
