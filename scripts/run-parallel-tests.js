const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

// Read test files from the text file
const testFilesPath = path.join(__dirname, '../cypress/test-files.txt');
const testFiles = fs.readFileSync(testFilesPath, 'utf8')
    .split('\n')
    .map(line => line.trim())
    .filter(line => line.length > 0);

console.log(`Found ${testFiles.length} test files to run in parallel\n`);

// Build command with spec pattern
const specs = testFiles.join(',');
const command = `cypress-parallel -s "cypress run --env configFile=test --browser chrome --headed" -t 3 -p cypress/parallel-reporter-config.json --spec "${specs}"`;

try {
    execSync(command, { stdio: 'inherit', shell: true });
} catch (error) {
    process.exit(1);
}