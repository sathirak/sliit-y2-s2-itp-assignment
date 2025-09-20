import type { UserDto } from '@/lib/dtos/user';
import { apiPrivateClient } from '@/lib/private';

export const getUser = async (): Promise<UserDto> => {
    const result = await apiPrivateClient
        .get<UserDto>("user/me")
        .json();
    return result;
};