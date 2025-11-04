import { SetMetadata } from '@nestjs/common';

export const SERVICE_AUTH_KEY = 'serviceAuth';
export const ServiceAuth = () => SetMetadata(SERVICE_AUTH_KEY, true); 