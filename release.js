// release.js
require('dotenv').config();
const { execSync } = require('child_process');
const prompts = require('prompts');

(async () => {
  const response = await prompts({
    type: 'select',
    name: 'versionType',
    message: 'What type of release is this?',
    choices: [
      { title: 'Patch', value: 'patch' },
      { title: 'Minor', value: 'minor' },
      { title: 'Major', value: 'major' }
    ]
  });

  if (!response.versionType) {
    console.log('❌ Release cancelled.');
    process.exit(1);
  }

  try {
    const cmd = `npm --prefix frontend version ${response.versionType} -m "chore: bumped version to %s"`;
    console.log(`🏗 Running: ${cmd}`);
    execSync(cmd, { stdio: 'inherit' });

    console.log('🚀 Pushing to git...');
    execSync('git push', { stdio: 'inherit' });
    execSync('git push --follow-tags', { stdio: 'inherit' });

    console.log('✅ Release complete!');

    const repo = process.env.GITHUB_REPOSITORY;
    const workflowUrl = `https://github.com/${repo}/actions`;
    console.log(`🔗 Workflow: ${workflowUrl}`);
  } catch (error) {
    console.error('🔥 Release failed:', error.message);
    process.exit(1);
  }
})();
