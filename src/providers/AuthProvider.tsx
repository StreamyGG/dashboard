import {
  createContext,
  useContext,
  createSignal,
  JSX,
  onMount,
} from "solid-js";

const AuthContext = createContext<{
  user: () => any | null;
  setUser: (user: any | null) => void;
  isAuthenticated: () => boolean;
  checkAuth: () => Promise<void>;
  loading: () => boolean;
}>({
  user: () => null,
  setUser: () => {},
  isAuthenticated: () => false,
  checkAuth: async () => {},
  loading: () => true,
});

export const AuthProvider = (props: { children: JSX.Element }) => {
  const [user, setUser] = createSignal<any | null>(null);
  const [loading, setLoading] = createSignal(true);
  const isAuthenticated = () => !!user();

  const checkAuth = async () => {
    setLoading(true);
    try {
      const response = await fetch(
        `${import.meta.env.VITE_API_URL}/auth/verify`,
        {
          method: "GET",
          credentials: "include",
        }
      );

      if (response.ok) {
        const data = await response.json();
        if (data.user) {
          setUser(data.user);
        } else {
          setUser(null);
        }
      } else {
        setUser(null);
      }
    } catch (error) {
      setUser(null);
    } finally {
      setLoading(false);
    }
  };

  onMount(() => {
    checkAuth();
  });

  return (
    <AuthContext.Provider
      value={{ user, setUser, isAuthenticated, checkAuth, loading }}
    >
      {props.children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
