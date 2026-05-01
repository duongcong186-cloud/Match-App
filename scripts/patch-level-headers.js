const fs = require('fs');
const path = require('path');
const glob = require('glob');
const base = path.join(__dirname, '..', 'app', '(tabs)', 'screens');
const files = glob.sync('*LevelScreen.tsx', { cwd: base, absolute: true });

const replacement = `          <View style={[styles.levelDetailHeader, { backgroundColor: category.color }]}>\n            <TouchableOpacity \n              style={styles.headerBack} \n              onPress={() => navigation.goBack()}\n            >\n              <Ionicons name="arrow-back" size={24} color="#fff" />\n            </TouchableOpacity>\n\n            <View style={styles.headerContentGroup}>\n              <View style={styles.screenHeaderIcon}>\n                <Ionicons name={category.icon} size={26} color="#fff" />\n              </View>\n              <View style={styles.headerTitleGroup}>\n                <Text style={styles.levelTitle}>{category.title}</Text>\n                <Text style={styles.levelSubtitle}>{category.description}</Text>\n              </View>\n            </View>\n          </View>`;

const replaceBlock = (text, startToken, replacement) => {
  const startIndex = text.indexOf(startToken);
  if (startIndex === -1) return null;
  const regex = /<\/?View\b/g;
  regex.lastIndex = startIndex;
  let depth = 0;
  let match;
  while ((match = regex.exec(text)) !== null) {
    const tag = match[0];
    if (tag === '<View') {
      depth += 1;
    } else if (tag === '</View') {
      depth -= 1;
    }
    if (depth === 0) {
      const endIndex = regex.lastIndex + 6; // length of '</View>'
      return text.slice(0, startIndex) + replacement + text.slice(endIndex);
    }
  }
  return null;
};

let updated = 0;
for (const file of files) {
  const content = fs.readFileSync(file, 'utf8');
  const startToken = '<View style={[styles.levelDetailHeader';
  const replaced = replaceBlock(content, startToken, replacement);
  if (replaced && replaced !== content) {
    fs.writeFileSync(file, replaced, 'utf8');
    console.log('Fixed', path.basename(file));
    updated += 1;
  }
}
console.log('Fixed level screen files:', updated);
