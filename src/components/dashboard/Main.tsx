import { useAuth } from "../../providers/AuthProvider";

export const Dashboard = () => {
  const { user } = useAuth();

  return <div class="flex h-screen bg-background"></div>;
};
