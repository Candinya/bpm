<script lang="ts">
  import Play from "@/icons/Play.svelte";

  interface ItemProps {
    a: AudioSingle;
    index: number;
    isOpen: boolean;
    isCurrent: boolean;
    play: () => void;
  }

  const { a, index, isOpen, isCurrent, play }: ItemProps = $props();

  // let liRef: HTMLLIElement;
  //
  // const itemScrollIntoView = (isOpen: boolean) => {
  //   if (isOpen && isCurrent) {
  //     liRef?.scrollIntoView({ behavior: "smooth" });
  //   }
  // }
  //
  // $effect(() => itemScrollIntoView(isOpen));

</script>

<li
  class={{'active' : isCurrent}}
  onclick={play}
>
  <div class={'line'}>
    <span class={'index'}>{index + 1}.</span>
    {#if isCurrent}
      <Play class={'icon'} />
    {/if}
    <div class={'info'}>
      <span class={'name'} title={a.name}>
        {a.name}
      </span>
      <span class={'artist'} title={a.artist}>
        {a.artist}
      </span>
    </div>
  </div>
</li>

<style>
    li {
        font-size: 0.75rem;
        padding: 0.25rem 0.5rem;
        background-color: transparent;
        transition: background-color 0.3s;
        cursor: pointer;

        .line {
            display: flex;
            flex-direction: row;
            align-items: center;
            gap: 0.5rem;
            width: 100%;

            .index {
                font-size: 0.6rem;
                opacity: 0.75;
                font-weight: 300;
            }

            :global(.icon) {
                width: 0.5rem;
                height: 0.5rem;
                fill: currentColor;
            }

            .info {
                display: flex;
                flex-direction: row;
                gap: 0.75rem;
                justify-content: space-between;
                width: 0;
                flex-grow: 1;

                span {
                    overflow: hidden;
                    text-overflow: ellipsis;
                    white-space: nowrap;

                    &.name {
                        opacity: 0.8;
                    }

                    &.artist {
                        opacity: 0.6;
                        font-weight: 300;
                    }
                }
            }
        }

        &:hover {
            background-color: #38bdf850;
        }

        &.active {
            background-color: #38bdf870;
        }
    }

</style>
