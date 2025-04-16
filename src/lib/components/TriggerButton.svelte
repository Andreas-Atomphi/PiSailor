<script lang="ts">
    import hotkeys from "hotkeys-js";
    import { onDestroy, onMount } from "svelte";
    import "tailwindcss";
    const {
        onTrigger = () => {},
        hotkey,
        scope = "general",
        icon,
        className,
    }: {
        onTrigger?: () => void;
        hotkey?: string;
        scope?: string;
        icon?: string;
        className?: string;
    } = $props();

    onMount(() => {
        if (hotkey != undefined)
            hotkeys(hotkey, scope, function () {
                onTrigger();
            });
    });

    onDestroy(() => {
        if (hotkey != undefined) hotkeys.unbind(hotkey, scope);
    });
</script>

<div class={className} tabindex="-1">
    <button
        tabindex="-1"
        onclick={onTrigger}
        type="button"
        class="
        relative
        block
        left-0
        top-0
        text-white
        rounded-full
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
            {hotkey}
        </span>
    </button>
</div>
