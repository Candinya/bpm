import { mount } from "svelte";

import App from "@/components/App.svelte";

interface NewPlayerProps {
  el: HTMLElement;
  audio: AudioSingle[];
}
export const NewPlayer = ({ el, audio }: NewPlayerProps) => {
  return mount(App, {
    target: el,
    props: {
      audio,
    },
  });
};
