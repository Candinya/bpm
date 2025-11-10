<script lang="ts">
  import { sec2time } from "@/utils/sec2time";
  import ListMusic from "@/icons/ListMusic.svelte";

  interface ProgressAndControlProps {
    duration: number;
    buffered: AudioBuffered[];
    played: number;
    seek: (sec: number) => void;
    isShowingList: boolean;
    toggleShowingList: () => void;
  }

  const {
    duration,
    buffered,
    played,
    seek,
    isShowingList,
    toggleShowingList,
  }: ProgressAndControlProps = $props();

  const seek2time = (percent: number) => Math.floor(percent * duration);

</script>

<div class={'pac'}>
  <!--进度条-->
  <div class={'wrapper'}>
    <!--进度控制-->
    <div
      class={'progress'}
      onclick={(ev) => {
            seek(seek2time(ev.offsetX / ev.currentTarget.offsetWidth));
          }}
    >
      <!--总长度（固定是 100% 所以不用计算）-->
      <div class={'total'} />
      <!--已加载部分的长度（数据分段）-->
      {#each buffered as part }
        <div
          class={'buffered'}
          style:left={`${(part.start / duration) * 100}%`}
          style:width={`${((part.end - part.start) / duration) * 100}%`}
        />
      {/each}
      <!--已播放部分的长度（从头开始展示，所以起点是 0 ）-->
      <div
        class={'played'}
        style:width={`${(played / duration) * 100}%`}
      />

      <div
        class={'thumb'}
        style:left={`${(played / duration) * 100}%`}
      >
        <div />
      </div>
    </div>

    <!--时间-->
    <div class={'time'}>
      <div class={'inner'}>
        <div class={'timetext'}>
          <span>{sec2time(played)}</span>
          <span>/</span>
          <span>{sec2time(duration)}</span>
        </div>
      </div>
    </div>
  </div>

  <!--歌单显示按钮-->
  <ListMusic
    class={['button', isShowingList && 'active']}
    onclick={toggleShowingList}
  />
</div>

<style>
    .pac {
        background-color: white;
        border-bottom-right-radius: 0.25rem;
        padding: 0.5rem;
        display: flex;
        flex-direction: row;
        gap: 0.5rem;
        align-items: center;

        .wrapper {
            display: flex;
            flex-direction: row;
            width: 100%;
            align-items: center;

            .progress {
                flex-grow: 1;
                position: relative;
                cursor: pointer;
                height: 0.25rem;
                padding: 0.25rem 0; /* 扩大一点以更好地点击到，但这会改变元素的高度，所以在下方需要修正 */

                .total,
                .buffered,
                .played {
                    position: absolute;
                    inset: 0;
                    top: 0.25rem; /* 修正因为父元素 padding 导致的位置偏移 */
                    height: 0.25rem; /* 需要手动设置，因为如果 100% 的话会把 padding 的部分也包括进去 */
                }

                .total {
                    background-color: #ddd;
                    width: 100%;
                }

                .buffered {
                    background-color: #aaa;
                }

                .played {
                    background-color: #555;
                }

                .thumb {
                    position: absolute;

                    > div {
                        position: absolute;
                        width: 0.5rem;
                        height: 0.5rem;
                        top: -0.25rem;
                        left: -0.25rem;
                        background-color: white;
                        border: 0.125rem solid #555;
                        border-radius: 100%;
                        opacity: 0;
                        transition: opacity 0.3s;
                    }
                }

                &:hover {
                    .thumb > div {
                        opacity: 1;
                    }
                }
            }

            .time {
                display: flex;
                overflow: hidden;
                position: relative;

                .inner {
                    display: flex;
                    margin-left: 0.5rem;

                    .timetext {
                        font-size: 0.625rem;
                        display: flex;
                        gap: 0.125rem;
                        color: #555;
                    }
                }
            }
        }

        :global(.button) {
            width: 0.875rem;
            height: 0.875rem;
            opacity: 0.5;
            cursor: pointer;
            transition: opacity 0.3s;

            &:hover {
                opacity: 0.7;
            }

            &.active {
                opacity: 1;
            }
        }
    }
</style>
