<script>
  import { onDestroy } from 'svelte'

  let date = new Date()
  $: time = `${date.getHours()}:${date.getMinutes()}:${date.getSeconds()}`
  
  const interval = setInterval(() => date = new Date(), 1000)

  onDestroy(() => {
    clearInterval(interval);
  })
</script>

<style>
  datetime {
    font-family: monospace;
  }
</style>

<datetime>{time}</datetime>