const fs = require('fs');
const path = require('path');
const glob = require('glob');
const base = path.join(__dirname, '..', 'app', '(tabs)', 'screens');
const files = glob.sync('**/*.tsx', { cwd: base, absolute: true });
const patchFile = (file, regex, replacement) => {
  const content = fs.readFileSync(file, 'utf8');
  if (!regex.test(content)) return false;
  fs.writeFileSync(file, content.replace(regex, replacement), 'utf8');
  return true;
};
const introReplacement = `<View style={[styles.introHeader, { backgroundColor: category.color }]}>\n          <TouchableOpacity style={styles.headerBack} onPress={() => navigation.goBack()}>\n            <Ionicons name="arrow-back" size={24} color="#fff" />\n          </TouchableOpacity>\n          <View style={styles.introHeaderContent}>\n            <View style={styles.screenHeaderIcon}>\n              <Ionicons name={category.icon} size={26} color="#fff" />\n            </View>\n            <View style={styles.headerTitleGroup}>\n              <Text style={styles.introTitle}>{category.title}</Text>\n              <Text style={styles.introSubtitle}>{category.subtitle}</Text>\n            </View>\n          </View>\n        </View>`;
const levelReplacement = `<View style={[styles.levelDetailHeader, { backgroundColor: category.color }]}>\n            <TouchableOpacity \n              style={styles.headerBack} \n              onPress={() => navigation.goBack()}\n            >\n              <Ionicons name="arrow-back" size={24} color="#fff" />\n            </TouchableOpacity>\n\n            <View style={styles.headerContentGroup}>\n              <View style={styles.screenHeaderIcon}>\n                <Ionicons name={category.icon} size={26} color="#fff" />\n              </View>\n              <View style={styles.headerTitleGroup}>\n                <Text style={styles.levelTitle}>{category.title}</Text>\n                <Text style={styles.levelSubtitle}>{category.description}</Text>\n              </View>\n            </View>\n          </View>`;
const practiceReplacement = `<View style={[styles.practiceHeader, { backgroundColor: category.color }]}>\n        <TouchableOpacity style={styles.practiceBackButton} onPress={() => navigation.goBack()}>\n          <Ionicons name="chevron-back" size={28} color="#ffffff" />\n        </TouchableOpacity>\n        <View style={styles.practiceHeaderContent}>\n          <View style={styles.screenHeaderIcon}>\n            <Ionicons name={category.icon} size={26} color="#fff" />\n          </View>\n          <View style={styles.practiceHeaderTextGroup}>\n            <Text style={[styles.practiceHeaderTitle, { color: '#ffffff' }]}>{category.title}</Text>\n            <Text style={styles.practiceHeaderSubtitle}>{category.subtitle}</Text>\n          </View>\n        </View>\n      </View>`;
const practiceGenericReplacement = `<View style={[styles.practiceHeader, { backgroundColor: category?.color ?? '#3b82f6' }]}>\n        <TouchableOpacity style={styles.practiceBackButton} onPress={() => navigation.goBack()}>\n          <Ionicons name="chevron-back" size={28} color="#ffffff" />\n        </TouchableOpacity>\n        <View style={styles.practiceHeaderContent}>\n          <View style={styles.screenHeaderIcon}>\n            <Ionicons name={category?.icon ?? 'help-circle'} size={26} color="#fff" />\n          </View>\n          <View style={styles.practiceHeaderTextGroup}>\n            <Text style={[styles.practiceHeaderTitle, { color: '#ffffff' }]}>{category?.title ?? 'Practice'}</Text>\n            <Text style={styles.practiceHeaderSubtitle}>{category?.subtitle ?? 'Practice questions'}</Text>\n          </View>\n        </View>\n      </View>`;
let updated = 0;
for (const file of files) {
  const basename = path.basename(file);
  if (/IntroScreen\.tsx?$/.test(basename)) {
    if (patchFile(file, /<View style=\{\[styles\.introHeader[\s\S]*?<\/View>/, introReplacement)) {
      console.log('Updated', basename);
      updated++;
    }
  } else if (/LevelScreen\.tsx?$/.test(basename)) {
    if (patchFile(file, /<View style=\{\[styles\.levelDetailHeader[\s\S]*?<\/View>/, levelReplacement)) {
      console.log('Updated', basename);
      updated++;
    }
  } else if (/PracticeScreen\.tsx?$/.test(basename)) {
    if (basename === 'PracticeScreen.tsx') {
      if (patchFile(file, /<View style=\{\[styles\.practiceHeader[\s\S]*?<\/View>/, practiceGenericReplacement)) {
        console.log('Updated', basename);
        updated++;
      }
    } else {
      if (patchFile(file, /<View style=\{\[styles\.practiceHeader[\s\S]*?<\/View>/, practiceReplacement)) {
        console.log('Updated', basename);
        updated++;
      }
    }
  }
}
console.log('Patched files count:', updated);
