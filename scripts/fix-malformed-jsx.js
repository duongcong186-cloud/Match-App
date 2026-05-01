const fs = require('fs');
const path = require('path');
const glob = require('glob');
const base = path.join(__dirname, '..', 'app', '(tabs)', 'screens');
const levelFiles = glob.sync('*LevelScreen.tsx', { cwd: base, absolute: true });
let fixed = 0;
for (const file of levelFiles) {
  let content = fs.readFileSync(file, 'utf8');
  const before = content;
  content = content.replace(/<\/View>\s*<\/View>\s*<View style=\{styles\.levelBody\}>/, '</View>\n          <View style={styles.levelBody}>');
  if (content !== before) {
    fs.writeFileSync(file, content, 'utf8');
    console.log('Fixed', path.basename(file));
    fixed += 1;
  }
}
const countingFile = path.join(base, 'CountingIntroScreen.tsx');
let ccontent = fs.readFileSync(countingFile, 'utf8');
let cbefore = ccontent;
ccontent = ccontent.replace(/<\/View>\s*<View style=\{styles\.countingHeaderTitles\}[\s\S]*?<\/View>\s*<\/View>\s*<\/View>\s*<ScrollView/, '</View>\n\n        <ScrollView');
if (ccontent !== cbefore) {
  fs.writeFileSync(countingFile, ccontent, 'utf8');
  console.log('Fixed CountingIntroScreen.tsx');
  fixed += 1;
}
console.log('Total fixed files:', fixed);
