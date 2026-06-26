import { reactive, computed } from 'vue';
import { supabase } from '@/utils/supabase';

const state = reactive({
  token: localStorage.getItem('lancer_auth_token') || '',
  user: null,
});

const isLoggedIn = computed(() => !!state.token);

// Listen to Supabase auth state changes automatically
supabase.auth.onAuthStateChange((event, session) => {
  state.token = session?.access_token || '';
  state.user = session?.user || null;
  
  if (session?.access_token) {
    localStorage.setItem('lancer_auth_token', session.access_token);
  } else {
    localStorage.removeItem('lancer_auth_token');
  }
});

// Initialize session check
supabase.auth.getSession().then(({ data: { session } }) => {
  state.token = session?.access_token || '';
  state.user = session?.user || null;
  if (session?.access_token) {
    localStorage.setItem('lancer_auth_token', session.access_token);
  } else {
    localStorage.removeItem('lancer_auth_token');
  }
});

const login = async (email, password) => {
  try {
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password
    });
    
    if (error) throw error;
    
    state.token = data.session?.access_token || '';
    state.user = data.user || null;
    if (state.token) {
      localStorage.setItem('lancer_auth_token', state.token);
    }
    return { success: true };
  } catch (error) {
    console.error("Erro no login:", error.message);
    return { success: false, error: error.message };
  }
};

const signUp = async (email, password) => {
  try {
    const { data, error } = await supabase.auth.signUp({
      email,
      password
    });
    
    if (error) throw error;
    
    return { success: true, data };
  } catch (error) {
    console.error("Erro no cadastro:", error.message);
    return { success: false, error: error.message };
  }
};

const logout = async () => {
  try {
    await supabase.auth.signOut();
  } catch (error) {
    console.error("Erro no logout:", error.message);
  } finally {
    state.token = '';
    state.user = null;
    localStorage.removeItem('lancer_auth_token');
  }
};

export const authStore = {
  state,
  isLoggedIn,
  login,
  signUp,
  logout
};
