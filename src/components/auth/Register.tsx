import { createSignal, Show } from "solid-js";
import { useAuth } from "../../providers/AuthProvider";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
  CardFooter,
} from "../ui/card";
import { TextFieldLabel, TextFieldRoot, TextField } from "../ui/textfield";
import EyeIcon from "../../assets/icons/EyeIcon.svg";
import EyeOffIcon from "../../assets/icons/EyeOffIcon.svg";
import { Button } from "../ui/button";
import { useNavigate } from "@solidjs/router";
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

export const Register = () => {
  const [email, setEmail] = createSignal("");
  const [password, setPassword] = createSignal("");
  const [username, setUsername] = createSignal("");
  const [displayName, setDisplayName] = createSignal("");
  const [step, setStep] = createSignal(0);
  const [showPassword, setShowPassword] = createSignal(false);
  const [errorMessage, setErrorMessage] = createSignal("");
  const [error, setError] = createSignal("");
  const { setUser } = useAuth();
  const navigate = useNavigate();

  const handleNextStep = (e: Event) => {
    e.preventDefault();
    if (username() && email() && password()) {
      setStep(1);
    } else {
      setError("Please fill in all required fields");
      setErrorMessage("Username, Email, and Password are required.");
      showErrorToast();
    }
  };

  const handlePreviousStep = (e: Event) => {
    e.preventDefault();
    setStep(0);
  };

  const handleRegister = async (e: Event) => {
    e.preventDefault();
    try {
      const response = await fetch(
        `${import.meta.env.VITE_API_URL}/auth/register`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            email: email(),
            password: password(),
            username: username(),
            display_name: displayName(),
          }),
          credentials: "include",
        }
      );
      if (response.ok) {
        const data = await response.json();
        setUser(data.user);
        navigate("/");
      } else {
        console.error("Registration failed.");
        setError(response.statusText);
        const errorData = await response.json();
        setErrorMessage(errorData.error);
        showErrorToast();
      }
    } catch (error) {
      console.error("An error occurred during registration:", error);
      setErrorMessage("An error occurred during registration");
      showErrorToast();
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
      <div class="flex items-center justify-center min-h-screen">
        <form onSubmit={handleRegister} class="w-full max-w-md">
          <div class="flex flex-col space-y-4">
            <Show when={step() === 0}>
              <Card>
                <CardHeader>
                  <CardTitle>Register</CardTitle>
                  <CardDescription>Create a new account</CardDescription>
                </CardHeader>
                <CardContent>
                  <TextFieldRoot class="mb-4">
                    <TextFieldLabel>Username</TextFieldLabel>
                    <TextField
                      id="username"
                      type="text"
                      placeholder="A unique username for your account"
                      value={username()}
                      onInput={(e) => setUsername(e.currentTarget.value)}
                      required
                    />
                  </TextFieldRoot>
                  <TextFieldRoot class="mb-4">
                    <TextFieldLabel>Email</TextFieldLabel>
                    <TextField
                      id="email"
                      type="email"
                      placeholder="bobby@streamy.gg"
                      value={email()}
                      onInput={(e) => setEmail(e.currentTarget.value)}
                      required
                    />
                  </TextFieldRoot>
                  <TextFieldRoot class="mb-4">
                    <TextFieldLabel>Password</TextFieldLabel>
                    <div class="relative">
                      <TextField
                        id="password"
                        type={showPassword() ? "text" : "password"}
                        placeholder="********"
                        value={password()}
                        onInput={(e) => setPassword(e.currentTarget.value)}
                        required
                      />
                      <Button
                        type="button"
                        variant="ghost"
                        size="icon"
                        class="absolute right-0 top-0"
                        onClick={() => setShowPassword(!showPassword())}
                      >
                        <img
                          src={showPassword() ? EyeOffIcon : EyeIcon}
                          alt={
                            showPassword() ? "Hide password" : "Show password"
                          }
                        />
                      </Button>
                    </div>
                  </TextFieldRoot>
                  <Button onClick={handleNextStep} class="w-full">
                    Next
                  </Button>
                </CardContent>
                <CardFooter>
                  <p class="text-sm text-center text-muted-foreground">
                    Already have an account?{" "}
                    <a href="/login" class="text-primary hover:underline">
                      Login
                    </a>
                  </p>
                </CardFooter>
              </Card>
            </Show>

            <Show when={step() === 1}>
              <Card>
                <CardHeader>
                  <CardTitle>Additional Information</CardTitle>
                  <CardDescription>
                    We need a few more details to get you set up
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <TextFieldRoot class="mb-4">
                    <TextFieldLabel>Display Name</TextFieldLabel>
                    <TextField
                      type="text"
                      placeholder="What should we call you?"
                      value={displayName()}
                      onInput={(e) => setDisplayName(e.currentTarget.value)}
                      required
                    />
                  </TextFieldRoot>
                  <div class="flex justify-between">
                    <Button
                      onClick={handlePreviousStep}
                      variant="ghost"
                      class="w-1/3"
                    >
                      Back
                    </Button>
                    <Button type="submit" variant="default" class="w-2/3 ml-2">
                      Register
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </Show>
          </div>
        </form>
      </div>
    </>
  );
};
