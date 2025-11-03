// Test quiz level loading
const testLevels = async () => {
  console.log('Testing quiz level imports...\n');
  
  for (let level = 1; level <= 26; level++) {
    try {
      let module;
      
      // Test based on level mapping
      if (level === 1) {
        const modules = await Promise.all([
          import('./src/data/quiz/study/data/study-wine-intro-01.js'),
          import('./src/data/quiz/study/data/study-wine-intro-02.js'),
        ]);
        console.log(`✅ Level ${level}: OK (${modules.length} study modules loaded)`);
      } else if (level >= 2 && level <= 6) {
        console.log(`⏭️  Level ${level}: Skipping detailed test`);
      } else if (level >= 7 && level <= 26) {
        const levelFile = String(level - 6).padStart(2, '0');
        module = await import(`./src/data/quiz/levels/level${levelFile}-*.js`);
        console.log(`✅ Level ${level}: OK`);
      }
    } catch (error) {
      console.error(`❌ Level ${level}: FAILED - ${error.message}`);
    }
  }
};

testLevels().catch(console.error);
