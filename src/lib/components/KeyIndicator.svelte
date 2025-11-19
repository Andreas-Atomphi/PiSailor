<script lang="ts">
    import hotkeys from "hotkeys-js";
    import { onDestroy, onMount } from "svelte";
    import "tailwindcss";

    let mainDiv: HTMLDivElement | null;
    const scope = "general";

    const {
        onTrigger=()=>{},
        key,
        icon,
        className,
        shape = "square"
    }: {
        onTrigger?: () => void;
        key?: string;
        icon?: string;
        className?: string;
        shape?: "square" | "round" | "circle";
    } = $props();

    onMount(() => {
        
        window.addEventListener("keydown", e => {
            if (hotkeys.getScope() != scope) return;
            if (key == e.key)
                mainDiv?.classList.add("pulse")
        })

        window.addEventListener("keyup", e => {
            if (key == e.key)
            mainDiv?.classList.remove("pulse")
        })
    });

    onDestroy(() => {});
</script>

<div class={className} tabindex="-1">
    <div
        bind:this={mainDiv}
        tabindex="-1"
        class="
        relative
        block
        left-0
        top-0
        text-white
        {{circle: "rounded-full", square: "", round: "rounded"}[shape]}
        bg-black
        border-solid
        border-white
        border-2
        w-[2.5rem]
        h-[2.5rem]
        text-clip
    "
    >
        <span class="align-middle material-symbols-outlined select-none"
            >{icon}</span
        >
        <span
            class="
                block
                absolute
                text-white
                rounded-full
                bg-black
                border-solid
                border-white
                border-1
                w-[1.75rem]
                h-[1.75rem]
                -left-[1rem]
                -bottom-[1rem]
                text-center
                align-middle
                select-none
                max-sm:hidden
            "
        >
            {key}
        </span>
    </div>
</div>


<style>
    .pulse {
        background-color: white !important;
        color: black !important;
    }
</style>