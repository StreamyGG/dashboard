import { createSignal, createEffect } from "solid-js";
import { useAuth } from "../../providers/AuthProvider";
import { useNavigate } from "@solidjs/router";
import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
  CardFooter,
  CardDescription,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  TextField,
  TextFieldLabel,
  TextFieldRoot,
} from "@/components/ui/textfield";
import { toaster } from "@kobalte/core";
import {
  Toast,
  ToastContent,
  ToastDescription,
  ToastProgress,
  ToastTitle,
  ToastRegion,
  ToastList,
} from "@/components/ui/toast";

export const Login = () => {
  const [email, setEmail] = createSignal("");
  const [password, setPassword] = createSignal("");
  const [isLoading, setIsLoading] = createSignal(false);
  const [errorMessage, setErrorMessage] = createSignal("");
  const [error, setError] = createSignal("");
  const { isAuthenticated, setUser } = useAuth();
  const navigate = useNavigate();

  createEffect(() => {
    if (isAuthenticated()) {
      navigate("/", { replace: true });
    }
  });

  const handleLogin = async (e: Event) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      const response = await fetch(
        `${import.meta.env.VITE_API_URL}/auth/login`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ email: email(), password: password() }),
          credentials: "include",
        }
      );
      if (response.ok) {
        const data = await response.json();
        setUser(data.user);
        navigate("/", { replace: true });
      } else {
        setError(response.statusText || "Login error");
        const errorData = await response.json();
        setErrorMessage(errorData.error || "An error occurred during login.");
        showErrorToast();
      }
    } catch (error) {
      console.error("Login error:", error);
      setError("Login Error");
      setErrorMessage(
        "An error occurred during login, check console for more details."
      );
      showErrorToast();
    } finally {
      setIsLoading(false);
    }
  };

  const showErrorToast = () => {
    toaster.show((props) => (
      <Toast toastId={props.toastId} variant="destructive">
        <ToastContent>
          <ToastTitle>{error()}</ToastTitle>
          <ToastDescription>{errorMessage()}</ToastDescription>
        </ToastContent>
        <ToastProgress />
      </Toast>
    ));
  };

  return (
    <>
      <ToastRegion>
        <ToastList />
      </ToastRegion>
      <div class="flex items-center justify-center min-h-screen bg-background">
        <Card class="w-[350px]">
          <CardHeader>
            <CardTitle>Login</CardTitle>
            <CardDescription>Sign in to your account</CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleLogin} class="space-y-4">
              <div>
                <TextFieldRoot>
                  <TextFieldLabel>Email</TextFieldLabel>
                  <TextField
                    id="email"
                    type="email"
                    placeholder="Email"
                    required
                    onInput={(e) =>
                      setEmail((e.target as HTMLInputElement).value)
                    }
                  />
                </TextFieldRoot>
              </div>
              <div>
                <TextFieldRoot>
                  <TextFieldLabel>Password</TextFieldLabel>
                  <TextField
                    id="password"
                    type="password"
                    placeholder="Password"
                    required
                    onInput={(e) =>
                      setPassword((e.target as HTMLInputElement).value)
                    }
                  />
                </TextFieldRoot>
              </div>
              <Button type="submit" disabled={isLoading()} class="w-full">
                {isLoading() ? "Loading..." : "Login"}
              </Button>
            </form>
          </CardContent>
          <CardFooter>
            <p class="text-sm text-center text-muted-foreground">
              Don't have an account?{" "}
              <a href="/register" class="text-primary hover:underline">
                Register
              </a>
            </p>
          </CardFooter>
        </Card>
      </div>
    </>
  );
};
