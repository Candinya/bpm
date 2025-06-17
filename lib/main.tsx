import { render } from "preact";

import App from "@/components/App";

interface NewPlayerProps {
  el: HTMLElement;
  audio: AudioSingle[];
}
export const NewPlayer = ({ el, audio }: NewPlayerProps) => {
  return render(<App audio={audio} />, el);
};
