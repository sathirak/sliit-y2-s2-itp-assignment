import { SetMetadata } from '@nestjs/common';

export const IS_ALLOW_GUESTS = 'isAllowGuests';
export const AllowGuests = () => SetMetadata(IS_ALLOW_GUESTS, true);
