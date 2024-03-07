import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import {
  writeFileSync,
  createReadStream,
  readdirSync,
  existsSync,
  rmSync,
} from 'fs';
import { randomUUID } from 'crypto';

@Injectable()
export class RecordService {
  private saveDir = '/videos';

  find(name: string) {
    name = `${name}.h264`;
    const path = this.getPath(name);
    const videos = readdirSync(this.saveDir);
    if (!videos.includes(name)) {
      throw new HttpException('El video no existe', HttpStatus.BAD_REQUEST);
    }
    if (existsSync(path)) {
      const file = createReadStream(path);
      return file;
    }
    throw new HttpException('No se encontro el video', 500);
  }

  save(file: Express.Multer.File) {
    const id = randomUUID();
    const name = `${id}.h264`;
    const path = this.getPath(name);
    writeFileSync(path, file.buffer);
    return id;
  }

  delete(id: string) {
    const name = `${id}.h264`;
    const path = this.getPath(name);
    if (existsSync(path)) {
      try {
        rmSync(path);
      } catch (e) {
        return false;
      }
    }
    return true;
  }

  private getPath(name: string) {
    return `${this.saveDir}/${name}`;
  }
}
