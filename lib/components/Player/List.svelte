<script lang="ts">
  import ListItem from "./ListItem.svelte";

  interface ListProps {
    audio: AudioSingle[];
    isOpen: boolean;
    currentPlayingIndex: number;
    play: (index: number) => void;
  }

  const { audio, isOpen, currentPlayingIndex, play }: ListProps = $props();

  // todo: 打开列表时滚动到正在播放的曲目（在此处实现或在子元素中实现）

</script>

<div class={['wrapper', isOpen && 'open']}>
  <div class={'content'}>
    <ol>
      {#each audio as a, index}
        <ListItem
          a={a}
          index={index}
          isOpen={isOpen}
          isCurrent={currentPlayingIndex === index}
          play={() => play(index)}
        />
      {/each}
    </ol>
  </div>
</div>

<style>
    .wrapper {
        max-height: 0;
        transition: max-height 0.3s;
        overflow-y: auto;
        scroll-behavior: smooth;
        border-bottom-right-radius: 0.25rem;
        background-color: #aaa3;

        &.open {
            max-height: 20rem;
        }

        .content {
            ol {
                list-style: none;
                margin: 0;
                padding: 0;
                display: flex;
                flex-direction: column;
            }
        }
    }

</style>
