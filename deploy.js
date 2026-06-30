const fs = require('fs');
const path = require('path');

function incrementVersion() {
    const htmlFiles = [
        'index.html'
    ];

    const version = Date.now();
    const cacheVersion = Math.floor(version / 1000);

    console.log(`🚀 Updating versions...`);
    console.log(`📅 Timestamp: ${version}`);
    console.log(`🗂️ Cache Version: ${cacheVersion}`);

    htmlFiles.forEach(filePath => {
        if (fs.existsSync(filePath)) {
            let content = fs.readFileSync(filePath, 'utf8');

            // Update CSS version
            content = content.replace(
                /href="styles\.css\?v=\d+"/g,
                `href="styles.css?v=${version}"`
            );

            // Update JS version
            content = content.replace(
                /src="script\.js\?v=\d+"/g,
                `src="script.js?v=${version}"`
            );

            // Update shared-database version
            content = content.replace(
                /src="shared-database\.js\?v=\d+"/g,
                `src="shared-database.js?v=${version}"`
            );

            // If no version exists, add it
            content = content.replace(
                /href="styles\.css"/g,
                `href="styles.css?v=${version}"`
            );

            content = content.replace(
                /src="script\.js"/g,
                `src="script.js?v=${version}"`
            );

            content = content.replace(
                /src="shared-database\.js"/g,
                `src="shared-database.js?v=${version}"`
            );

            fs.writeFileSync(filePath, content, 'utf8');
            console.log(`✅ Updated ${filePath} with version ${version}`);
        } else {
            console.log(`❌ File not found: ${filePath}`);
        }
    });

    // Update service worker cache name
    const swPath = 'sw.js';
    if (fs.existsSync(swPath)) {
        let swContent = fs.readFileSync(swPath, 'utf8');
        swContent = swContent.replace(
            /const CACHE_NAME = 'bangla-batch-v\d+';/g,
            `const CACHE_NAME = 'bangla-batch-v${cacheVersion}';`
        );
        fs.writeFileSync(swPath, swContent, 'utf8');
        console.log(`✅ Updated service worker with new cache version: bangla-batch-v${cacheVersion}`);
    } else {
        console.log(`❌ Service worker not found: ${swPath}`);
    }

    // Update shared-database.js timestamp
    const dbPath = 'shared-database.js';
    if (fs.existsSync(dbPath)) {
        let dbContent = fs.readFileSync(dbPath, 'utf8');

        // Add or update lastUpdated timestamp
        if (dbContent.includes('lastUpdated')) {
            dbContent = dbContent.replace(
                /lastUpdated: "[^"]*"/g,
                `lastUpdated: "${new Date().toISOString()}"`
            );
        } else {
            // Add lastUpdated to the sharedDB object
            dbContent = dbContent.replace(
                /const sharedDB = {/,
                `const sharedDB = {
    lastUpdated: "${new Date().toISOString()}",`
            );
        }

        fs.writeFileSync(dbPath, dbContent, 'utf8');
        console.log(`✅ Updated shared-database.js with new timestamp`);
    }

    console.log(`\n🎉 Deployment ready!`);
    console.log(`📝 Version: ${version}`);
    console.log(`🗂️ Cache Version: ${cacheVersion}`);
    console.log(`⏰ Timestamp: ${new Date().toISOString()}`);
    console.log(`\n🚀 Next steps:`);
    console.log(`   1. Run: firebase deploy`);
    console.log(`   2. Users will get INSTANT updates!`);
    console.log(`\n💡 Tip: Use 'npm run deploy' for one-command deployment`);
    console.log(`⚡ Auto-update system: Active (5-second check interval)`);
}

// Run the function
incrementVersion();