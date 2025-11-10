<script lang="ts">
  import GooeyAnim from "@/icons/GooeyAnim.svelte";
  import Pause from "@/icons/Pause.svelte";
  import Play from "@/icons/Play.svelte";
  import Music from "@/icons/Music.svelte";
  import MicrophoneStand from "@/icons/MicrophoneStand.svelte";
  import CompactDisk from "@/icons/CompactDisk.svelte";

  interface MetaProps {
    audio: AudioSingle;
    isLoading: boolean;
    isPlaying: boolean;
    toggle: () => void;
  }

  const { audio, isLoading, isPlaying, toggle }: MetaProps = $props();

</script>

<div class={'meta'}>
  <div class={'cover'}>
    <img src={audio.cover} alt={audio.name} />

    <div
      class={'control'}
      onclick={() => {
          if (!isLoading) {
            toggle();
          }
        }}
    >
      <div class={'wrapper'}>
        {#if isLoading}
          <GooeyAnim class={'loading'} />
        {:else if isPlaying}
          <Pause class={'pause'} />
        {:else}
          <Play class={'play'} />
        {/if}
      </div>
    </div>
  </div>
  <ul>
    <li>
      <Music class={'icon'} />
      <span title={audio.name}>{audio.name}</span>
    </li>
    <li>
      <MicrophoneStand class={'icon'} />
      <span title={audio.artist}>{audio.artist}</span>
    </li>
    <li>
      <CompactDisk class={'icon'} />
      <span title={audio.album}>{audio.album}</span>
    </li>
  </ul>
</div>

<style>
    .meta {
        display: flex;
        flex-direction: row;
        padding: 0.75rem;
        gap: 0.75rem;

        .cover {
            position: relative;
            display: flex;

            img {
                width: 6rem;
                height: 6rem;
                border-radius: 0.25rem;
            }

            .control {
                position: absolute;
                inset: 0;
                display: flex;
                justify-content: center;
                align-items: center;
                cursor: pointer;
                transition: background-color 0.3s;
                background-blend-mode: darken;
                background-color: #0000;
                border-radius: 0.25rem;

                .wrapper {
                    opacity: 0.6;
                    transition: opacity 0.3s;
                    display: flex;
                    border-radius: 100%;
                    padding: 0.5rem;
                    border: 0.2rem solid white;
                    flex-shrink: 0;

                    :global(.play),
                    :global(.pause),
                    :global(.loading) {
                        width: 1.25rem;
                        height: 1.25rem;
                        fill: white;
                    }
                }

                &:hover {
                    background-color: #0005;
                    .wrapper {
                        opacity: 1;
                    }
                }
            }
        }

        ul {
            list-style: none;
            padding-left: 0;
            margin: 0;
            font-size: 1rem;
            overflow: hidden;
            display: flex;
            flex-direction: column;
            justify-content: center;
            gap: 0.25rem;

            li {
                display: flex;
                flex-direction: row;

                :global(.icon) {
                    width: 1rem;
                    height: 1rem;
                    margin-right: 0.75rem;
                    fill: currentColor;
                    justify-self: center;
                    align-self: center;
                    flex-shrink: 0;
                }

                span {
                    overflow: hidden;
                    text-overflow: ellipsis;
                    white-space: nowrap;
                }
            }
        }
    }

</style>
