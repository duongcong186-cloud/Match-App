const fs = require('fs');
const path = require('path');
const glob = require('glob');
const root = path.join(__dirname, '..');
const screensDir = path.join(root, 'app', '(tabs)', 'screens');
const screenFiles = glob.sync('*.tsx', { cwd: screensDir, absolute: true });
let updated = 0;
for (const file of screenFiles) {
  let content = fs.readFileSync(file, 'utf8');
  const before = content;
  content = content.replace(/name=\{category\.icon\}/g, 'name={category.icon as any}');
  content = content.replace(/name=\{category\?\.icon \?\? 'help-circle'\}/g, 'name={category?.icon as any ?? "help-circle"}');
  content = content.replace(/name=\{trophy \? 'trophy' : 'sparkles'\}/g, 'name={(trophy ? "trophy" : "sparkles") as any}');
  if (content !== before) {
    fs.writeFileSync(file, content, 'utf8');
    updated += 1;
    console.log('Patched', path.basename(file));
  }
}
const layoutFile = path.join(root, 'app', '(tabs)', '_layout.tsx');
let layout = fs.readFileSync(layoutFile, 'utf8');
const layoutBefore = layout;
layout = layout.replace(
  "const colorScheme = useColorScheme();",
  "const colorScheme = useColorScheme();\n  const theme = colorScheme === 'dark' ? 'dark' : 'light';"
);
layout = layout.replace(/Colors\[colorScheme \?\? 'light'\]\.tint/g, 'Colors[theme].tint');
if (layout !== layoutBefore) {
  fs.writeFileSync(layoutFile, layout, 'utf8');
  updated += 1;
  console.log('Patched _layout.tsx');
}
const hookFile = path.join(root, 'hooks', 'use-theme-color.ts');
let hook = fs.readFileSync(hookFile, 'utf8');
const hookBefore = hook;
hook = hook.replace(
  "const theme = useColorScheme() ?? 'light';",
  "const theme = useColorScheme() === 'dark' ? 'dark' : 'light';"
);
if (hook !== hookBefore) {
  fs.writeFileSync(hookFile, hook, 'utf8');
  updated += 1;
  console.log('Patched use-theme-color.ts');
}
const iconSymbolFile = path.join(root, 'components', 'ui', 'icon-symbol.tsx');
let iconSymbol = fs.readFileSync(iconSymbolFile, 'utf8');
const iconBefore = iconSymbol;
iconSymbol = iconSymbol.replace(
  "type IconMapping = Record<SymbolViewProps['name'], ComponentProps<typeof MaterialIcons>['name']>;",
  'type IconMapping = Record<string, ComponentProps<typeof MaterialIcons>["name"]>;'
);
if (iconSymbol !== iconBefore) {
  fs.writeFileSync(iconSymbolFile, iconSymbol, 'utf8');
  updated += 1;
  console.log('Patched icon-symbol.tsx');
}
const stylesFile = path.join(root, 'app', '(tabs)', 'styles', 'index.ts');
let styles = fs.readFileSync(stylesFile, 'utf8');
const stylesBefore = styles;
styles = styles.replace(
  "  feedbackText: { fontSize: 16, fontWeight: '700', textAlign: 'center', marginTop: 12 },\n\n  resultCard:",
  '  resultCard:'
);
if (styles !== stylesBefore) {
  fs.writeFileSync(stylesFile, styles, 'utf8');
  updated += 1;
  console.log('Patched styles/index.ts');
}
console.log('Total patches applied:', updated);
