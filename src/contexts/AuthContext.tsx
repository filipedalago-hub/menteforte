import { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import { User } from '@supabase/supabase-js';
import { supabase, Profile } from '../lib/supabase';
import { analytics } from '../lib/analytics';
import { errorTracking } from '../lib/errorTracking';
import { storage } from '../lib/storage';

type AuthContextType = {
  user: User | null;
  profile: Profile | null;
  loading: boolean;
  signIn: (email: string, password: string) => Promise<{ error: Error | null }>;
  signUp: (email: string, password: string, displayName: string) => Promise<{ error: Error | null }>;
  signOut: () => Promise<void>;
  refreshProfile: () => Promise<void>;
  updateProfile: (data: Partial<Profile>) => Promise<void>;
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [profile, setProfile] = useState<Profile | null>(null);
  const [loading, setLoading] = useState(true);

  const fetchProfile = async (userId: string) => {
    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', userId)
        .maybeSingle();

      if (error) {
        errorTracking.captureException(error, { context: 'fetchProfile', userId });
        return null;
      }

      return data;
    } catch (error) {
      errorTracking.captureException(error, { context: 'fetchProfile', userId });
      return null;
    }
  };

  const refreshProfile = async () => {
    if (user) {
      const profileData = await fetchProfile(user.id);
      setProfile(profileData);
    }
  };

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setUser(session?.user ?? null);
      if (session?.user) {
        fetchProfile(session.user.id).then(setProfile);

        analytics.setUserId(session.user.id);
        errorTracking.setUser(session.user.id, session.user.email);
      }
      setLoading(false);
    });

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      (() => {
        setUser(session?.user ?? null);
        if (session?.user) {
          fetchProfile(session.user.id).then(setProfile);

          analytics.setUserId(session.user.id);
          errorTracking.setUser(session.user.id, session.user.email);
        } else {
          setProfile(null);

          analytics.setUserId(null);
          errorTracking.setUser(null);
          storage.clear();
        }
      })();
    });

    return () => subscription.unsubscribe();
  }, []);

  const signIn = async (email: string, password: string) => {
    try {
      const { error } = await supabase.auth.signInWithPassword({ email, password });

      if (error) {
        errorTracking.captureException(error, { context: 'signIn', email });
        return { error: new Error(error.message) };
      }

      analytics.userLogin('email');

      return { error: null };
    } catch (error) {
      errorTracking.captureException(error, { context: 'signIn', email });
      return { error: error instanceof Error ? error : new Error('Erro ao fazer login') };
    }
  };

  const signUp = async (email: string, password: string, displayName: string) => {
    try {
      const { data: authData, error: authError } = await supabase.auth.signUp({
        email,
        password,
      });

      if (authError) {
        errorTracking.captureException(authError, { context: 'signUp', email });
        return { error: new Error(authError.message) };
      }

      if (authData.user) {
        const { error: profileError } = await supabase.from('profiles').insert({
          id: authData.user.id,
          email,
          display_name: displayName,
          xp: 0,
          level: 1,
          current_streak: 0,
          longest_streak: 0,
        });

        if (profileError) {
          errorTracking.captureException(profileError, {
            context: 'signUp_createProfile',
            userId: authData.user.id
          });
          return { error: new Error(profileError.message) };
        }

        analytics.userSignup('email');
      }

      return { error: null };
    } catch (error) {
      errorTracking.captureException(error, { context: 'signUp', email });
      return { error: error instanceof Error ? error : new Error('Erro ao criar conta') };
    }
  };

  const signOut = async () => {
    try {
      analytics.userLogout();

      await supabase.auth.signOut();
      setUser(null);
      setProfile(null);

      analytics.setUserId(null);
      errorTracking.setUser(null);
      storage.clear();
    } catch (error) {
      errorTracking.captureException(error, { context: 'signOut' });
    }
  };

  const updateProfile = async (data: Partial<Profile>) => {
    if (!user) return;

    try {
      const { error } = await supabase
        .from('profiles')
        .update({ ...data, updated_at: new Date().toISOString() })
        .eq('id', user.id);

      if (error) {
        errorTracking.captureException(error, {
          context: 'updateProfile',
          userId: user.id,
          data
        });
      } else {
        await refreshProfile();
      }
    } catch (error) {
      errorTracking.captureException(error, {
        context: 'updateProfile',
        userId: user.id
      });
    }
  };

  return (
    <AuthContext.Provider value={{ user, profile, loading, signIn, signUp, signOut, refreshProfile, updateProfile }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
