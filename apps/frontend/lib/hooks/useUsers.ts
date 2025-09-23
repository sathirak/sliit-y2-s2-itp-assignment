import useSWR, { mutate } from 'swr';
import { useState, useEffect, useCallback } from 'react';
import type { UserDto } from '@/lib/dtos/user';
import { getAllUsers, getUserById, searchUsers, createUser, updateUser, deleteUser } from '@/lib/services/user';

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

  return {
    createUser: createUserMutation,
    updateUser: updateUserMutation,
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
