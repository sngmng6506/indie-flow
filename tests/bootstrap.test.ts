import { test } from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';

test('web startup boots schema and verified data before accepting requests', () => {
  const pkg=JSON.parse(readFileSync(new URL('../package.json',import.meta.url),'utf8'));
  const rail=JSON.parse(readFileSync(new URL('../railway.json',import.meta.url),'utf8'));
  const boot=readFileSync(new URL('../scripts/bootstrap.mjs',import.meta.url),'utf8');
  assert.equal(pkg.scripts.start,'node scripts/bootstrap.mjs');
  assert.equal(rail.deploy.startCommand,'npm run start');
  const steps=["./migrate.mjs","./seed-verified-2026.mjs","./seed-extended-2026.mjs","../dist/server/entry.mjs"];
  let position=-1;
  for(const step of steps) {
    const found=boot.indexOf("await import('"+step+"')");
    assert.ok(found>position,'Missing or unordered boot step: '+step);
    position=found;
  }
});
