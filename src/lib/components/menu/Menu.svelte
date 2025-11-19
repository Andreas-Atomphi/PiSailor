<script lang="ts">
    import type { Snippet } from 'svelte';
  
    let {
      classNames = '',
      children = [] as Snippet[],
      itemsPerPage = 5
    }: {
      classNames?: string;
      children: Snippet[];
      itemsPerPage?: number;
    } = $props();
  
    let currentPage = $state(0);  // $state inicializa estado reativo :contentReference[oaicite:2]{index=2}
  
    // 3. Valores derivados
    let totalPages = $derived(
      Math.ceil(children.length / itemsPerPage)
    );                            // $derived de um cálculo :contentReference[oaicite:3]{index=3}
  
    let pagedChildren = $derived(
      children.slice(
        currentPage * itemsPerPage,
        (currentPage + 1) * itemsPerPage
      )
    );                            // $derived de um slice :contentReference[oaicite:4]{index=4}
  
    // 4. Funções de navegação
    const prevPage = () => { if (currentPage > 0) currentPage -= 1; };
    const nextPage = () => {
      if (currentPage < totalPages - 1) currentPage += 1;
    };
  </script>
  
  <div class="drawer {classNames}">
    <div class="drawer-toggle"></div>
  
    <div class="drawer-content">
      {#if children.length > 0}
        {#each pagedChildren as child}
          {@render child()}   <!-- renderiza snippet :contentReference[oaicite:5]{index=5} -->
        {/each}
  
        <div class="pagination-controls">
          <button onclick={prevPage} disabled={currentPage === 0}>
            ← Anterior
          </button>
          <span>Página {currentPage + 1} de {totalPages}</span>
          <button onclick={nextPage} disabled={currentPage === totalPages - 1}>
            Próxima →
          </button>
        </div>
      {:else}
        <p>Empty</p>
      {/if}
    </div>
  
    <div class="drawer-side">
      <div class="drawer-overlay"></div>
    </div>
  </div>
  
  <style>
    .pagination-controls {
      display: flex;
      gap: 1rem;
      justify-content: center;
      align-items: center;
      margin-top: 1rem;
    }
  </style>
  