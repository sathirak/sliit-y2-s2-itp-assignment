import useSWR, { mutate } from 'swr';
import { useState, useEffect, useCallback } from 'react';
import type { UserDto } from '@/lib/dtos/user';
import { getAllUsers, getUserById, searchUsers, createUser, updateUser, deleteUser, getUser } from '@/lib/services/user';

// SWR Keys
const USERS_KEY = 'users';
const USER_KEY = (id: string) => `users/${id}`;
const SEARCH_USERS_KEY = (query: string) => `users/search/${query}`;

// Hook to get all users
export function useUsers() {
  const { data, error, isLoading, mutate: mutateUsers } = useSWR<UserDto[]>(
    USERS_KEY,
    getAllUsers,
    {
      revalidateOnFocus: false,
      dedupingInterval: 60000, // Dedupe requests within 1 minute
    }
  );

  return {
    users: data || [],
    isLoading,
    isError: !!error,
    error,
    mutateUsers,
  };
}

// Hook to get a specific user by ID
export function useUser(id: string | null) {
  const { data, error, isLoading } = useSWR<UserDto>(
    id ? USER_KEY(id) : null,
    id ? () => getUserById(id) : null,
    {
      revalidateOnFocus: false,
    }
  );

  return {
    user: data,
    isLoading,
    isError: !!error,
    error,
  };
}

// Hook to get current user profile (using the /me endpoint)
export function useCurrentUser() {
  const { data, error, isLoading, mutate: mutateCurrentUser } = useSWR<UserDto>(
    'user/me',
    getUser,
    {
      revalidateOnFocus: false,
      dedupingInterval: 60000, // Dedupe requests within 1 minute
    }
  );

  return {
    user: data,
    isLoading,
    isError: !!error,
    error,
    mutateCurrentUser,
  };
}

// Hook to search users with debouncing
export function useSearchUsers(query: string, enabled: boolean = true) {
  const [debouncedQuery, setDebouncedQuery] = useState(query);

  // Debounce the query
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedQuery(query);
    }, 500);

    return () => clearTimeout(timer);
  }, [query]);

  const shouldFetch = enabled && debouncedQuery.trim().length > 0;
  
  const { data, error, isLoading } = useSWR<UserDto[]>(
    shouldFetch ? SEARCH_USERS_KEY(debouncedQuery) : null,
    shouldFetch ? () => searchUsers(debouncedQuery) : null,
    {
      revalidateOnFocus: false,
      dedupingInterval: 30000, // Dedupe search requests within 30 seconds
    }
  );

  return {
    users: data || [],
    isLoading,
    isError: !!error,
    error,
  };
}

// Hook with mutation functions for user management
export function useUserMutations() {
  // Create user
  const createUserMutation = async (userData: Partial<UserDto>) => {
    const newUser = await createUser(userData);
    
    // Update the users cache
    mutate(
      USERS_KEY,
      (users: UserDto[] = []) => [newUser, ...users],
      false
    );
    
    // Revalidate users list
    mutate(USERS_KEY);
    
    return newUser;
  };

  // Update user
  const updateUserMutation = async (id: string, userData: Partial<UserDto>) => {
    const updatedUser = await updateUser(id, userData);
    
    // Update the users cache
    mutate(
      USERS_KEY,
      (users: UserDto[] = []) =>
        users.map(user => user.id === id ? updatedUser : user),
      false
    );
    
    // Update individual user cache
    mutate(USER_KEY(id), updatedUser, false);
    
    // Revalidate caches
    mutate(USERS_KEY);
    mutate(USER_KEY(id));
    
    return updatedUser;
  };

  // Delete user
  const deleteUserMutation = async (id: string) => {
    await deleteUser(id);
    
    // Remove from users cache
    mutate(
      USERS_KEY,
      (users: UserDto[] = []) => users.filter(user => user.id !== id),
      false
    );
    
    // Remove individual user cache
    mutate(USER_KEY(id), undefined, false);
    
    // Revalidate users list
    mutate(USERS_KEY);
  };

  // Update current user profile
  const updateCurrentUserMutation = async (userData: Partial<UserDto>) => {
    // Get current user first to know their ID
    const currentUserResponse = await getUser();
    const updatedUser = await updateUser(currentUserResponse.id, userData);
    
    // Update the current user cache
    mutate('user/me', updatedUser, false);
    
    // Update the users list cache
    mutate(
      USERS_KEY,
      (users: UserDto[] = []) =>
        users.map(user => user.id === currentUserResponse.id ? updatedUser : user),
      false
    );
    
    // Update individual user cache
    mutate(USER_KEY(currentUserResponse.id), updatedUser, false);
    
    // Revalidate caches
    mutate('user/me');
    mutate(USERS_KEY);
    mutate(USER_KEY(currentUserResponse.id));
    
    return updatedUser;
  };

  return {
    createUser: createUserMutation,
    updateUser: updateUserMutation,
    updateCurrentUser: updateCurrentUserMutation,
    deleteUser: deleteUserMutation,
  };
}

// Utility function to manually refresh users cache
export function refreshUsers() {
  return mutate(USERS_KEY);
}

// Utility function to manually refresh a specific user
export function refreshUser(id: string) {
  return mutate(USER_KEY(id));
}
