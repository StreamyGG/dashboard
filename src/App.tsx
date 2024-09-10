import { AuthProvider } from "./providers/AuthProvider";
import { Router, Route } from "@solidjs/router";
import { Login } from "./components/auth/Login";
import { Register } from "./components/auth/Register";
import { ProtectedRoute } from "./components/auth/ProtectedRoute";
import { Dashboard } from "./components/dashboard/Main";
import { ParentProps } from "solid-js";
import { ThemeProvider } from "./providers/ThemeProvider";

function MountApp(props: ParentProps) {
  return (
    <AuthProvider>
      <ThemeProvider>{props.children}</ThemeProvider>
    </AuthProvider>
  );
}

const App = () => {
  return (
    <Router root={MountApp}>
      <Route path="/login" component={Login} />
      <Route path="/register" component={Register} />
      <Route
        path="/"
        component={() => (
          <ProtectedRoute>
            <Dashboard />
          </ProtectedRoute>
        )}
      />
    </Router>
  );
};

export default App;
