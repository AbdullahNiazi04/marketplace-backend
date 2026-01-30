import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

function fixImports(dir) {
    const files = fs.readdirSync(dir);

    for (const file of files) {
        const filePath = path.join(dir, file);
        const stat = fs.statSync(filePath);

        if (stat.isDirectory()) {
            if (file !== 'node_modules' && file !== 'dist' && file !== '.git') {
                fixImports(filePath);
            }
        } else if (file.endsWith('.ts')) {
            let content = fs.readFileSync(filePath, 'utf8');
            const regex = /(import|export)\s+(?:.+?\s+from\s+)?['"](\.{1,2}\/.*?)['"]/g;
            
            let changed = false;
            const newContent = content.replace(regex, (match, type, importPath) => {
                // If it already ends in .js, check if it's a directory masquerading as a file
                // e.g. ./dto.js where ./dto is a directory
                
                const currentDir = path.dirname(filePath);
                
                // Case 1: mistyped directory import as file import (created by previous script)
                if (importPath.endsWith('.js')) {
                    const pathWithoutJs = importPath.slice(0, -3);
                    const resolvedPathNoJs = path.resolve(currentDir, pathWithoutJs);
                    
                    if (fs.existsSync(resolvedPathNoJs) && fs.statSync(resolvedPathNoJs).isDirectory()) {
                        // usage of console.log for debugging
                        // console.log(`Fixing directory import in ${file}: ${importPath} -> ${pathWithoutJs}/index.js`);
                        return match.replace(importPath, `${pathWithoutJs}/index.js`);
                    }
                    return match;
                }
                
                // Case 2: No extension (missed by previous script?)
                const resolvedPath = path.resolve(currentDir, importPath);
                if (fs.existsSync(resolvedPath) && fs.statSync(resolvedPath).isDirectory()) {
                     return match.replace(importPath, `${importPath}/index.js`);
                }
                
                // Default fallback (should exist from previous run or be ignored)
                return match;
            });

            if (content !== newContent) {
                fs.writeFileSync(filePath, newContent);
                console.log(`Refined: ${filePath}`);
            }
        }
    }
}

fixImports(path.join(__dirname, 'src'));
console.log('Finished refining imports.');
