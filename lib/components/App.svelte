<script lang="ts">
  import Player from "@/components/Player/index.svelte";

  interface AppProps {
    audio: AudioSingle[];
  }

  const { audio }: AppProps = $props();

  const readCfg = (): Config => {
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
</script>

<Player
  audio={audio}
  initialPlayingIndex={readCfg().playingIndex}
  setInitialPlayingIndex={(i) =>
    saveCfg({
      // ...readConfig(), // 暂时配置只有一项所以不需要这个
      playingIndex: i,
    })
  }
/>
