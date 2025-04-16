<script lang="ts">
    import { onMount } from "svelte";


    let selected = 0;
    let mainDiv = $state(document.getElementById("menu"));
    let classList;

    onMount(() => {
        mainDiv = document.getElementById("menu");
        classList = mainDiv?.classList;
    })
    const {
        classNames = "",
        children
    } : {
        classNames?: string,
        children: any
    } = $props();

    export { classList }

</script>




<div id="menu" class="transition-width duration-200 {classNames}">
    {#if children}
        {@render children()}
    {:else}
        <p> Empty </p>
    {/if}
</div>

<style>

    #menu {
        padding: 0;
    }

    :global(#menu .menu-button) {
        margin: 0;
        width: 100%;
        height: 2.5rem;
        color: white;
        border-top: 1px solid white;
        border-bottom: 1px solid white;
        background-color: black;
        text-align: center;
    }

    :global(#menu .menu-button-hovered) {
        background-color: #555;
    }
</style>