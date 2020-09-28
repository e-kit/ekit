lerna create @ekit/$1

cp packages/typescript-type-tester/jest.config.js packages/$1
cp packages/typescript-type-tester/tsconfig.json packages/$1
cp packages/typescript-type-tester/tsconfig.prod.json packages/$1
cp packages/typescript-type-tester/tsconfig.test.json packages/$1
node -e "const json=require('./packages/$1/package.json');json.scripts.test='jest --all';json.scripts.build = 'tsc --project tsconfig.prod.json';json.version='0.0.0';json.main='lib/index.js';json.description = '${1}'.split('-').join(' ');json.license='MIT';require('fs').writeFileSync('./packages/$1/package.json', JSON.stringify(json, null, '  '), { encoding: 'utf8' });"
rm -rf packages/$1/__tests__/$1.test.js
rm -rf packages/$1/lib/$1.js
mkdir -p packages/$1/src
touch packages/$1/src/index.ts
componentName=$(node -e "console.log('${1}'.replace(/-[^-]/g, a => a.replace('-', '').toUpperCase()))")
echo """
# \`@ekit/$1\`

> ${1}

## Usage

\`\`\`shell
npm i -D @ekit/$1
\`\`\`

\`\`\`tsx static
import $componentName from '@ekit/$1';

// TODO: DEMONSTRATE API
\`\`\`""" >packages/$1/README.md
