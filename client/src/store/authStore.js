import { create } from 'zustand';

const authInitialState = {
  accessToken: null,
  idToken: null,
  user: null
};

const useAuthStore = create((set, get) => ({
  ...authInitialState,
  login: async (code) => {
    const response = await fetch('/api/auth/google/authenticate', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Accept: 'application/json'
      },
      body: JSON.stringify({
        code
      })
    });
    if (!response.ok) {
      throw new Error('Unexpected error occurred while logging in');
    }
    const { accessToken, user, idToken } = await response.json();
    set({ user, accessToken, idToken });
  },
  refresh: async () => {
    const response = await fetch('/api/auth/google/refresh', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Accept: 'application/json'
      }
    });
    if (!response.ok) {
      set(authInitialState);
      return;
    }
    const { accessToken, user, idToken } = await response.json();
    set({ user, accessToken, idToken });
  },
  logout: async () => {
    await fetch('/api/auth/google/logout', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Accept: 'application/json',
        Authorization: `Bearer ${get().idToken}`
      }
    });
    set(authInitialState);
  }
}));

export default useAuthStore;
