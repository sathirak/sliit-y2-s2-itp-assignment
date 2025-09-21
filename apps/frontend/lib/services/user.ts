import type { UserDto } from '@/lib/dtos/user';
import { apiPrivateClient } from '@/lib/private';

export const getUser = async (): Promise<UserDto> => {
    const result = await apiPrivateClient
        .get<UserDto>("user/me")
        .json<UserDto>();
    return result;
};

export const getAllUsers = async (): Promise<UserDto[]> => {
    const result = await apiPrivateClient
        .get<UserDto[]>("user")
        .json<UserDto[]>();
    return result;
};

export const getUserById = async (id: string): Promise<UserDto> => {
    const result = await apiPrivateClient
        .get<UserDto>(`user/${id}`)
        .json<UserDto>();
    return result;
};

export const createUser = async (data: Partial<UserDto>): Promise<UserDto> => {
    const result = await apiPrivateClient
        .post("user", { json: data })
        .json<UserDto>();
    return result;
};

export const updateUser = async (id: string, data: Partial<UserDto>): Promise<UserDto> => {
    const result = await apiPrivateClient
        .put(`user/${id}`, { json: data })
        .json<UserDto>();
    return result;
};

export const deleteUser = async (id: string): Promise<void> => {
    await apiPrivateClient
        .delete(`user/${id}`)
        .json();
};