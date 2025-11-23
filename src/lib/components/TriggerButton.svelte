<script lang="ts">
    import hotkeys from "hotkeys-js";
    import { onDestroy, onMount } from "svelte";
    import "tailwindcss";

    let button: HTMLButtonElement | null;
    let shortcutIndicator: HTMLSpanElement | null;

    const {
        onTrigger = () => {},
        hotkey,
        scope = "general",
        icon,
        className,
        shape = "circle"
    }: {
        onTrigger?: () => void;
        hotkey?: string;
        scope?: string;
        icon?: string;
        className?: string;
        shape?: "square" | "round" | "circle";
    } = $props();

    onMount(() => {
        if (hotkey != undefined)
            hotkeys(hotkey, scope, function() {
                shortcutIndicator?.classList.add("pulse")
                onTrigger();
                setTimeout(() => {
                    if (scope != hotkeys.getScope())
                    shortcutIndicator?.classList.remove("pulse")
                }, 100)
                window.addEventListener("keyup", e => {
                    if (hotkey == e.key)
                    shortcutIndicator?.classList.remove("pulse")
                })
            });
    });

    onDestroy(() => {
        if (hotkey != undefined) hotkeys.unbind(hotkey, scope);
    });
</script>

<div class={className} tabindex="-1">
    <button
        bind:this={button}
        tabindex="-1"
        onclick={onTrigger}
        onmousedown={() => {
            button?.classList.add("pulse");
        }}
        onmouseout={() => {
            button?.classList.remove("pulse");
        }}
        onblur={() => {
            button?.classList.remove("pulse");
        }}
        onmouseup={() => {
            button?.classList.remove("pulse");
        }}
        type="button"
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
            bind:this={shortcutIndicator}
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
            {hotkey}
        </span>
    </button>
</div>


<style>
    .pulse {
        background-color: white !important;
        color: black !important;
    }
</style>