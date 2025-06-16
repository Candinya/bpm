import { render } from "preact";

import Player from "./components/Player";

interface NewPlayerProps {
  el: HTMLElement;
  audio: AudioSingle[];
}
export const NewPlayer = ({ el, audio }: NewPlayerProps) => {
  return render(<Player audio={audio} />, el);
};
