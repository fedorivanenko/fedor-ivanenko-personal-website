import { Suspense } from "react";

// Mock DB
const db = {
  query: async (query: string) => {
    const id = parseInt(query.match(/id = (\d+)/)?.[1] || "0");
    // Random delay 100-2000ms to simulate varying query times
    await new Promise((r) => setTimeout(r, Math.random() * 1900 + 100));
    return { id, name: id };
  },
};

async function Item({ id }: { id: number }) {
  const data = await db.query(`SELECT * FROM items WHERE id = ${id}`);
  return <p>{data.name}</p>;
}

export default function Page() {
  const ids = Array.from({ length: 100 }, (_, i) => i + 1);

  return (
    <div className="flex flex-wrap gap-4">
      {ids.map((id) => {
        console.log("render", id);
        return (
          <div
            key={id}
            className="w-12 h-12 flex items-center justify-center border border-border rounded"
          >
            <Suspense fallback={<div>...</div>}>
              <Item id={id} />
            </Suspense>
          </div>
        );
      })}
    </div>
  );
}
