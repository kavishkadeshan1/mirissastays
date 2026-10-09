const { test } = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const ts = require('typescript');
const Module = require('node:module');

function source(file) {
  const filename = path.resolve(file);
  const mod = new Module(filename, module);
  mod.filename = filename;
  mod.paths = Module._nodeModulePaths(path.dirname(filename));
  mod._compile(
    ts.transpileModule(fs.readFileSync(filename, 'utf8'), {
      compilerOptions: {
        module: ts.ModuleKind.CommonJS,
        esModuleInterop: true,
        target: ts.ScriptTarget.ES2020,
      },
    }).outputText,
    filename
  );
  return mod.exports;
}

const {
  extractEmbedSrc,
  resolveStayMapEmbed,
  getDestinationMapEmbed,
  generateExternalMapUrl,
  generateDirectionsUrl,
} = source('src/lib/map-utils.ts');

test('extractEmbedSrc extracts src URL from Google Maps iframe snippet', () => {
  const iframe = '<iframe src="https://www.google.com/maps/embed?pb=123" width="600" height="450" style="border:0;" allowfullscreen="" loading="lazy"></iframe>';
  assert.equal(extractEmbedSrc(iframe), 'https://www.google.com/maps/embed?pb=123');
});

test('extractEmbedSrc handles raw Google Maps embed URLs', () => {
  const url = 'https://maps.google.com/maps?q=5.945,80.452&hl=en&z=16&output=embed';
  assert.equal(extractEmbedSrc(url), url);
});

test('resolveStayMapEmbed uses mapEmbed if available', () => {
  const stay = {
    title: 'Test Stay',
    address: 'Mirissa Beach',
    mapEmbed: '<iframe src="https://www.google.com/maps/embed?pb=test"></iframe>',
    latitude: 5.94,
    longitude: 80.45,
  };
  assert.equal(resolveStayMapEmbed(stay), 'https://www.google.com/maps/embed?pb=test');
});

test('resolveStayMapEmbed falls back to latitude and longitude when mapEmbed is missing', () => {
  const stay = {
    title: 'Test Villa',
    address: 'Weligama Surf Point',
    mapEmbed: null,
    latitude: 5.9725,
    longitude: 80.4305,
  };
  const embed = resolveStayMapEmbed(stay);
  assert.match(embed, /maps\.google\.com\/maps\?q=5\.9725,80\.4305/);
  assert.match(embed, /output=embed/);
});

test('resolveStayMapEmbed falls back to title and address when coordinates are missing', () => {
  const stay = {
    title: 'Ocean Haven',
    address: 'Coconut Tree Hill, Mirissa',
    mapEmbed: null,
    latitude: null,
    longitude: null,
  };
  const embed = resolveStayMapEmbed(stay);
  assert.match(embed, /maps\.google\.com\/maps\?q=/);
  assert.match(embed, /Ocean%20Haven/);
  assert.match(embed, /output=embed/);
});

test('getDestinationMapEmbed produces working embed URL for each coastal place', () => {
  for (const slug of ['mirissa', 'weligama', 'madiha', 'midigama', 'thalaramba', 'kamburugamuwa']) {
    const embed = getDestinationMapEmbed(slug);
    assert.match(embed, /maps\.google\.com\/maps\?q=/);
    assert.match(embed, /output=embed/);
  }
});

test('generateDirectionsUrl generates Google Maps turn-by-turn directions link', () => {
  const directions = generateDirectionsUrl({ latitude: 5.94, longitude: 80.45, title: 'Mirissa Place' });
  assert.match(directions, /google\.com\/maps\/dir\/\?api=1&destination=5\.94,80\.45/);
});
