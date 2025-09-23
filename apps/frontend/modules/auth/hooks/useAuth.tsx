"use client";
import { useState, useEffect } from 'react';
import { getUser } from '@/lib/services/user';
import { createClient } from '@/utils/supabase/client';
import type { UserDto } from '@/lib/dtos/user';

export function useAuth() {
	const [user, setUser] = useState<UserDto | null>(null);
	const [loading, setLoading] = useState(true);
	const [error, setError] = useState<string | null>(null);
	const supabase = createClient();

	useEffect(() => {
		const getInitialSession = async () => {
			const { data: { session } } = await supabase.auth.getSession();
			
			if (session?.user) {
				try {
					const userData = await getUser();
					setUser(userData);
				} catch (err: any) {
					console.error('Error fetching user data:', err);
					setError(err?.message || 'Failed to fetch user');
				}
			}
			setLoading(false);
		};

		getInitialSession();

		const { data: { subscription } } = supabase.auth.onAuthStateChange(
			async (event, session) => {
				
				if (session?.user) {
					try {
						const userData = await getUser();
						setUser(userData);
						setError(null);
					} catch (err: any) {
						console.error('Error fetching user data:', err);
						setError(err?.message || 'Failed to fetch user');
					}
				} else {
					setUser(null);
					setError(null);
				}
				setLoading(false);
			}
		);

		return () => {
			subscription.unsubscribe();
		};
	}, [supabase.auth]);

	const signOut = async () => {
		setLoading(true);
		const { error } = await supabase.auth.signOut();
		if (error) {
			console.log('Error signing out:', error);
			setError(error.message);
			setLoading(false);
		}
	};

	return { 
		user, 
		setUser, 
		loading, 
		error,
		signOut,
	};
}
