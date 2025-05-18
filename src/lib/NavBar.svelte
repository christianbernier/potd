<script lang="ts">
	import NavBarLink from "./NavBarLink.svelte";

  const {
    current,
    back,
    forward,
    up
  }: {
    current: string,
    back?: string,
    forward?: string,
    up?: string
  } = $props();
</script>

<div class="container">
  {current}

  <div class="links">
    <NavBarLink text="&lt;" url={back} key="ArrowLeft"/>
    <NavBarLink text="^" url={up} key="ArrowUp"/>
    <NavBarLink text="&gt;" url={forward} key="ArrowRight"/>
  </div>
</div>

<style>
  .container {
    width: 100%;
    margin-bottom: var(--margin-lg);
    display: flex;
    flex-direction: row;
    align-items: center;
    justify-content: space-between;
  }
</style>
