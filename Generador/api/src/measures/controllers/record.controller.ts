import { ImageService } from '../services/image/image.service';
import { ApiTags } from '@nestjs/swagger';
import { RecordService } from '../services/record/record.service';
import { Controller, Get, NotFoundException, Param, Res } from '@nestjs/common';
import { Response } from 'express';
import { IsImage, IsPublic } from 'src/auth/decorators/user.decorator';

@ApiTags('Measures')
@Controller('records')
export class RecordController {
  constructor(
    private recordService: RecordService,
    private imageService: ImageService,
  ) {}

  @IsPublic()
  @Get(':name')
  streamRecord(@Param('name') name: string, @Res() res: Response) {
    const file = this.recordService.find(name);
    file.pipe(res);
  }

  @IsPublic()
  @Get(':name/images')
  async findCarImages(@Param('name') name: string) {
    return this.imageService.findImages(name);
  }

  @IsPublic()
  @Get(':name/images/zip')
  getZip(@Param('name') name: string, @Res() res: Response) {
    const zip = this.imageService.getImagesInZip(name);
    zip.pipe(res);
  }

  @IsPublic()
  @Get(':name/plates')
  findPlateImages(@Param('name') name: string) {
    return this.imageService.findImages(name, 'plates');
  }

  @IsImage()
  @Get(':name/images/:image')
  streamCarImage(
    @Param('name') name: string,
    @Param('image') image: string,
    @Res() res: Response,
  ) {
    const file = this.imageService.findImage(name, image);
    file.pipe(res);
  }

  @IsImage()
  @Get(':name/plates/:image')
  streamPlateImage(
    @Param('name') name: string,
    @Param('image') image: string,
    @Res() res: Response,
  ) {
    const file = this.imageService.findImage(name, image, 'plates');
    file.pipe(res);
  }
}
