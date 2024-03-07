import * as path from 'path';
import { Injectable, HttpException, HttpStatus } from '@nestjs/common';
import {
  readdirSync,
  createReadStream,
  copyFileSync,
  existsSync,
  mkdirSync,
  lstatSync,
  createWriteStream,
  ReadStream,
  writeFileSync,
  rmSync,
} from 'fs';
import { randomUUID } from 'crypto';
import * as archiver from 'archiver';

type ImageType = 'images' | 'plates';

@Injectable()
export class ImageService {
  private saveDir = '/images';
  private reportDir = '/reports';

  async findImages(name: string, type: ImageType = 'images') {
    try {
      const imgs = readdirSync(this.getPath(name, type)).map(
        (i) => `/records/${name}/${type}/${i}`,
      );
      return imgs;
    } catch (err) {
      return [];
    }
  }

  findImage(name: string, image: string, type: ImageType = 'images') {
    const imgPath = this.getPath(name, type);
    const images = readdirSync(imgPath);
    if (!images.includes(image)) {
      throw new HttpException('La imagen no existe', HttpStatus.BAD_REQUEST);
    }
    const img = `${imgPath}/${image}`;
    if (existsSync(img)) {
      const file = createReadStream(img);
      return file;
    }
    throw new HttpException('No se encontro la imagen', 500);
  }

  getImagesInZip(name: string) {
    const imagePath = path.join(this.saveDir, name);
    const subdirs = readdirSync(imagePath);
    const zipPath = subdirs.find((x) => x.endsWith('.zip'));
    if (zipPath) {
      return createReadStream(path.join(imagePath, zipPath));
    }
    const cacheOut = createWriteStream(path.join(imagePath, 'video.zip'));
    const imagesDirectory = subdirs
      .map((x) => ({
        directory: path.join(imagePath, x),
        folderName: x,
      }))
      .filter(({ directory }) => lstatSync(directory).isDirectory());
    const zip = archiver('zip');
    imagesDirectory.forEach(({ directory, folderName }) =>
      zip.directory(directory, folderName),
    );
    zip.finalize();
    zip.pipe(cacheOut);
    return zip;
  }

  moveToReportFolder(name: string, image: string, type: ImageType = 'images') {
    const id = randomUUID() + '.jpg';
    const oldPath = `${this.getPath(name, type)}/${image}`;
    const newPath = this.getReportPath(id);

    copyFileSync(oldPath, newPath);
    return id;
  }

  updateReportImage(
    name: string,
    video: string,
    image: string,
    type: ImageType = 'images',
  ) {
    image = image.split('/').at(-1);
    const oldPath = `${this.getPath(video, type)}/${image}`;
    const newPath = this.getReportPath(name);
    copyFileSync(oldPath, newPath);
    return name;
  }

  findReportImage(id: string): ReadStream {
    const imgPath = this.getReportPath(id);
    if (existsSync(imgPath)) {
      const file = createReadStream(imgPath);
      return file;
    }
    throw new HttpException('No se encontro la imagen', 500);
  }

  addPic(
    id: string,
    file: Express.Multer.File,
    imageType: ImageType = 'images',
  ) {
    const dirPath = this.getPath(id, imageType);
    const name = randomUUID();
    const imgPath = `${dirPath}/${name}`;
    if (!existsSync(dirPath)) {
      mkdirSync(dirPath, { recursive: true });
    }
    writeFileSync(imgPath, file.buffer);
    return name;
  }

  delete(video: string) {
    const dirPath = path.join(this.saveDir, video);
    if (existsSync(dirPath)) {
      try {
        rmSync(dirPath, {
          recursive: true,
        });
      } catch (e) {
        return false;
      }
    }
    return true;
  }

  private getPath(name: string, type: ImageType) {
    const subDir = type;
    return path.join(this.saveDir, name, subDir);
  }

  private getReportPath(id: string) {
    if (!existsSync(this.reportDir)) {
      mkdirSync(this.reportDir);
    }
    return path.join(this.reportDir, id);
  }
}
