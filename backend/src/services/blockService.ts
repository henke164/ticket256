export default async function getCurrentBlock(blockId: number) {
  const res = await fetch(
    `https://blockchain.info/block-height/${blockId}?format=json`,
  );

  const json = await res.json();
  return json.blocks[0].hash;
}
