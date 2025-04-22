(async () => {
  const response = await (await fetch('/api/upcoming_events')).json();
  console.log(response);
})();
