import { SetMetadata } from '@nestjs/common';

export const NEED_RADAR_KEY = 'needRadarKey';

export const NeedRadarKey = () => SetMetadata(NEED_RADAR_KEY, true);
