import { create } from 'zustand';
import { jwtDecode } from 'jwt-decode';
import madEyeAuth from '../services/madEyeAuth';

const useUserStore = create((set) => ({
  user: null,
  init: async () => {
    try {
      // Fetch the accessToken from localStorage
      const accessToken = localStorage.getItem('accessToken');
      if (accessToken) {
        const response = await madEyeAuth.validateToken();
        if (response === 'unauthorized') {
          window.location.href = '/';
          return;
        }
        const payload = jwtDecode(accessToken);

        const { name } = payload;
        set({ user: { name } });
      } else {
        window.location.href = '/';
        return;
      }
    } catch (error) {
      window.location.href = '/';
    }
  },
  setUser: (user) => set({ user }),
  editUser: (name) => set((state) => ({ user: { ...state.user, name } })),
  deleteUser: () => set({ user: null }),
}));

export default useUserStore;
