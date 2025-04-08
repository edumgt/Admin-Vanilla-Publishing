const fs = require('fs');
const path = require('path');
const { minify } = require('terser');
const { execSync } = require('child_process');
const htmlMinifier = require('html-minifier');


const DIST_DIR = 'dist';

// 파일 리스트 가져오기
const getFiles = (dir, ext) => {
    return fs.readdirSync(dir)
        .filter(file => file.endsWith(ext))
        .map(file => path.join(dir, file));
};

// JS 난독화
const obfuscateJS = async () => {
    const jsFiles = getFiles(DIST_DIR+"/assets/js", '.js');
    for (const file of jsFiles) {
        const code = fs.readFileSync(file, 'utf8');
        const result = await minify(code, { 
            compress: true, 
            mangle: true 
        });
        fs.writeFileSync(file, result.code, 'utf8');
        //console.log(`JS 난독화 완료: ${file}`);
    }
};

// CSS 난독화
// const obfuscateCSS = () => {
//     const cssFiles = getFiles(DIST_DIR+"/assets/css", '.css');
//     for (const file of cssFiles) {
//         execSync(`cleancss -o ${file} ${file}`);
//         console.log(`CSS 난독화 완료: ${file}`);
//     }
// };

// HTML 난독화
const obfuscateHTML = () => {
    const htmlFiles = getFiles(DIST_DIR, '.html');
    for (const file of htmlFiles) {
        const code = fs.readFileSync(file, 'utf8');
        const minified = htmlMinifier.minify(code, {
            removeComments: true,
            collapseWhitespace: true,
            minifyJS: true,
            minifyCSS: true
        });
        fs.writeFileSync(file, minified, 'utf8');
        //console.log(`HTML 난독화 완료: ${file}`);
    }
};

// 난독화 실행
(async () => {
    await obfuscateJS();
    //obfuscateCSS();
    obfuscateHTML();
})();
