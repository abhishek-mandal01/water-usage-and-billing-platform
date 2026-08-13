const fs = require('fs');
const path = require('path');

function getRelativePath(fromFile, toDir) {
  let rel = path.relative(path.dirname(fromFile), toDir).replace(/\\/g, '/');
  if (!rel.startsWith('.')) rel = './' + rel;
  return rel;
}

function processDirectory(dir) {
  const files = fs.readdirSync(dir);
  for (const file of files) {
    const fullPath = path.join(dir, file);
    if (fs.statSync(fullPath).isDirectory()) {
      processDirectory(fullPath);
    } else if (fullPath.endsWith('.jsx')) {
      let content = fs.readFileSync(fullPath, 'utf8');
      if (content.includes("from 'react-i18next'") || content.includes('from "react-i18next"')) {
        const langSelectorPath = path.join(__dirname, 'src', 'components', 'LanguageSelector');
        const relativeImportPath = getRelativePath(fullPath, langSelectorPath) + '/useTranslation';
        
        content = content.replace(/import\s+\{\s*useTranslation\s*\}\s+from\s+['"]react-i18next['"];?/g, `import { useTranslation } from '${relativeImportPath}';`);
        fs.writeFileSync(fullPath, content);
        console.log('Updated: ' + fullPath);
      }
    }
  }
}

processDirectory(path.join(__dirname, 'src'));
