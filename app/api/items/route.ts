export async function GET() {
  const encoder = new TextEncoder();

  const stream = new ReadableStream({
    async start(controller) {
      for (let i = 1; i <= 20; i++) {
        const item = { id: i, name: `Item ${i}` };
        controller.enqueue(encoder.encode(JSON.stringify(item) + "\n"));
        await new Promise(r => setTimeout(r, 200)); // simulate delay
      }
      controller.close();
    },
  });

  return new Response(stream, {
    headers: { "Content-Type": "application/json" },
  });
}