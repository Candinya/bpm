import Player from "@/components/Player";
import { useEffect, useState } from "preact/hooks";

interface AppProps {
  audio: AudioSingle[];
}
const App = ({ audio }: AppProps) => {
  const readConfig = (): Config => {
    const cfg = localStorage.getItem("bpm");
    if (!cfg) {
      // 返回默认设置
      return {
        playingIndex: 0,
      };
    } else {
      return JSON.parse(cfg);
    }
  };

  const saveCfg = (config: Config) => {
    localStorage.setItem("bpm", JSON.stringify(config));
  };

  return (
    <Player
      audio={audio}
      initialPlayingIndex={readConfig().playingIndex}
      setInitialPlayingIndex={(i) =>
        saveCfg({
          // ...readConfig(), // 暂时配置只有一项所以不需要这个
          playingIndex: i,
        })
      }
    />
  );
};

export default App;
