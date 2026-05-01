const fs = require('fs');
const path = require('path');
const glob = require('glob');
const base = path.join(__dirname, '..', 'app', '(tabs)', 'screens');
const files = glob.sync('*LevelScreen.tsx', { cwd: base, absolute: true });
let fixed = 0;
for (const file of files) {
  const content = fs.readFileSync(file, 'utf8');
  const updated = content.replace(/<\/View>\s*<\/View>\s*<\/View>\s*<View style=\{styles\.levelBody\}>/g, '<View style={styles.levelBody}>');
  if (updated !== content) {
    fs.writeFileSync(file, updated, 'utf8');
    console.log('Fixed', path.basename(file));
    fixed += 1;
  }
}
console.log('Total fixed files:', fixed);
