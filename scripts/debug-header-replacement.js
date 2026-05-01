const fs = require('fs');
const path = require('path');
const file = path.join(__dirname, '..', 'app', '(tabs)', 'screens', 'AdditionLevelScreen.tsx');
const text = fs.readFileSync(file, 'utf8');
const startToken = '<View style={[styles.levelDetailHeader';
const startIndex = text.indexOf(startToken);
console.log('startIndex', startIndex);
const regex = /<\/?View\b/g;
regex.lastIndex = startIndex;
let depth = 0;
let match;
while ((match = regex.exec(text)) !== null) {
  const tag = match[0];
  if (tag === '<View') depth += 1;
  else if (tag === '</View') depth -= 1;
  console.log('tag', tag, 'idx', match.index, 'depth', depth);
  if (depth === 0) {
    console.log('stopat', match.index);
    console.log(text.slice(startIndex, regex.lastIndex + 6));
    break;
  }
}
