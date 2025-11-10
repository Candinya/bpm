<script lang="ts">
  import MusicNote from "@/icons/MusicNote.svelte";
  import ChevronRight from "@/icons/ChevronRight.svelte";

  interface OpenToggleProps {
    isExpanded: boolean;
    toggle: () => void;
  }

  const { isExpanded, toggle }: OpenToggleProps = $props();

</script>

<div class={'toggle'} onclick={toggle}>
  <MusicNote class={'icon'} />
  <ChevronRight class={['indicator', isExpanded && 'opened']} />
</div>

<style>
    .toggle {
        width: 1.5rem;
        height: 3.75rem;

        position: absolute;
        right: -1.5rem; /* 能不能用相对值，让 CSS 自己计算，而不是指定？ */
        top: 1.25rem;
        border: none;
        cursor: pointer;
        padding: 0;
        margin: 0;
        border-top-right-radius: 0.25rem;
        border-bottom-right-radius: 0.25rem;
        display: flex;
        flex-direction: column;
        justify-content: space-evenly;
        align-items: center;

        /* 背景样式：和 wrapper 相同 */
        background-color: #888a;
        backdrop-filter: blur(0.75rem);

        box-shadow: 0 0.25rem 0.25rem rgba(0, 0, 0, 0.25);

        :global(.icon),
        :global(.indicator) {
            width: 0.75rem;
            height: 0.75rem;
            fill: currentColor;
        }

        :global(.indicator) {
            transition: rotate 0.3s 0.5s; /* 延迟至主动画结束后 */
            /* 状态切换 */
            &.opened {
                rotate: 180deg;
            }
        }
    }
</style>
