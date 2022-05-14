self.addEventListener("message", (event: MessageEvent) => {
  if (event.data.broadcast) {
    self.postMessage({ type: "Broadcast", from: event.data.origin });
  }
});
