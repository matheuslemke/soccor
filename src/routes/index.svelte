<script context="module">
  export async function load() {
    const today = new Date().toISOString().split('T')[0]
    const url = `https://v3.football.api-sports.io/fixtures/${today}`
    const response = await fetch(url)

    return {
      status: response.status,
      props: {
        article: response.ok && (await response.json())
      }
    }
  }
</script>

<script>
  import { onMount } from 'svelte'
  onMount(() => {
    load()
  })
</script>

<h1>Brasileirão</h1>
