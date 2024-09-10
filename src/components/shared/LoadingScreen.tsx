import { createSignal, onMount, Show } from "solid-js";

export const LoadingScreen = () => {
  const [showLoader, setShowLoader] = createSignal(true);
  const [fadeOut, setFadeOut] = createSignal(false);

  onMount(() => {
    const timer = setTimeout(() => {
      setFadeOut(true);
      setTimeout(() => setShowLoader(false), 1000);
    }, 3000);

    return () => clearTimeout(timer);
  });

  return (
    <Show when={showLoader()}>
      <div
        class={`fixed inset-0 bg-background bg-opacity-80 flex justify-center items-center transition-opacity duration-500 ${
          fadeOut() ? "opacity-0" : "opacity-100"
        }`}
      >
        <div class="w-16 h-16 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
      </div>
    </Show>
  );
};
