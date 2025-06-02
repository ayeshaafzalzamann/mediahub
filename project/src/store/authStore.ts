import { create } from 'zustand';
import supabase from '../lib/supabase';
import { User, LoginCredentials, SignupCredentials } from '../types';
import { toast } from 'react-hot-toast';

interface AuthState {
  user: User | null;
  isLoading: boolean;
  error: string | null;
  
  // Actions
  login: (credentials: LoginCredentials) => Promise<void>;
  signup: (credentials: SignupCredentials) => Promise<void>;
  logout: () => Promise<void>;
  checkSession: () => Promise<void>;
}

export const useAuthStore = create<AuthState>((set) => ({
  user: null,
  isLoading: false,
  error: null,

  login: async (credentials: LoginCredentials) => {
    set({ isLoading: true, error: null });
    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email: credentials.email,
        password: credentials.password,
      });

      if (error) throw error;

      if (data.user) {
        set({
          user: {
            id: data.user.id,
            email: data.user.email!,
          },
          isLoading: false,
        });
        toast.success('Successfully logged in!');
      }
    } catch (error: any) {
      set({
        error: error.message || 'Failed to login',
        isLoading: false,
      });
      toast.error(error.message || 'Failed to login');
    }
  },

  signup: async (credentials: SignupCredentials) => {
    set({ isLoading: true, error: null });
    try {
      const { data, error } = await supabase.auth.signUp({
        email: credentials.email,
        password: credentials.password,
      });

      if (error) throw error;

      if (data.user) {
        set({
          user: {
            id: data.user.id,
            email: data.user.email!,
          },
          isLoading: false,
        });
        toast.success('Account created successfully!');
      }
    } catch (error: any) {
      set({
        error: error.message || 'Failed to sign up',
        isLoading: false,
      });
      toast.error(error.message || 'Failed to sign up');
    }
  },

  logout: async () => {
    set({ isLoading: true });
    try {
      const { error } = await supabase.auth.signOut();
      if (error) throw error;
      
      set({ user: null, isLoading: false });
      toast.success('Logged out successfully');
    } catch (error: any) {
      set({
        error: error.message || 'Failed to logout',
        isLoading: false,
      });
      toast.error(error.message || 'Failed to logout');
    }
  },

  checkSession: async () => {
    set({ isLoading: true });
    try {
      const { data } = await supabase.auth.getSession();
      
      if (data.session?.user) {
        set({
          user: {
            id: data.session.user.id,
            email: data.session.user.email!,
          },
          isLoading: false,
        });
      } else {
        set({ user: null, isLoading: false });
      }
    } catch (error: any) {
      set({
        error: error.message || 'Session check failed',
        isLoading: false,
        user: null,
      });
    }
  },
}));