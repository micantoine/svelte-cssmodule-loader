import compiler from './compiler.js';

test('Generate CSS Modules from HTML attributes, Replace css className', async () => {
  const stats = await compiler('replace', {
    localIdentName: '[local]-123456'
  });
  const output = stats.toJson().modules[0].source;
  
  expect(eval(output)).toBe('<style>.red-123456 { color: red; }</style>\n<span class="red-123456">Red</span>');
});

test('Avoid generated class to start with a non character', async () => {
  const stats = await compiler('replace', {
    localIdentName: '1[local]'
  });
  const output = stats.toJson().modules[0].source;
  
  expect(eval(output)).toBe('<style>._1red { color: red; }</style>\n<span class="_1red">Red</span>');
});

test('Avoid generated class to end with a hyphen', async () => {
  const stats = await compiler('replace', {
    localIdentName: '[local]-'
  });
  const output = stats.toJson().modules[0].source;
  
  expect(eval(output)).toBe('<style>.red { color: red; }</style>\n<span class="red">Red</span>');
});

test('Remove unused CSS Modules from HTML attribute', async () => {
  const stats = await compiler('remove', {
    localIdentName: '[local]-123456'
  });
  const output = stats.toJson().modules[0].source;

  expect(eval(output)).toBe('<style>.red { color: red; }</style>\n<span class="">Blue</span>');
});

test('Target proper className from lookalike classNames', async () => {
  const stats = await compiler('target', {
    localIdentName: '[local]-123'
  });
  const output = stats.toJson().modules[0].source;

  expect(eval(output)).toBe(
`<style>
  .red-123 { color: red;}
  .red-crimson-123 { color: crimson;}
  .redMajenta-123 { color: magenta; }
</style>
<span class="red-123">Red</span>
<span class="red-crimson-123">Crimson</span>
<span class="redMajenta-123">Majenta</span>`);
});