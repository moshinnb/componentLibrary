import * as fs from 'fs-extra';
import * as path from 'path';

const angularJsonPath = path.join(__dirname, 'angular.json');
const libraryAssetsPath = path.join(__dirname, '../dist/my-angular-library/assets');

// Function to update angular.json with assets
async function updateAngularJson() {
  try {
    // Check if angular.json exists in the consuming application
    if (!fs.existsSync(angularJsonPath)) {
      console.error('angular.json file not found in the consuming application.');
      return;
    }

    // Read the angular.json file
    const angularJson = await fs.readJson(angularJsonPath);

    // Assuming there is only one project, or specify your project name
    const projectName = Object.keys(angularJson.projects)[0];
    const buildOptions = angularJson.projects[projectName].architect.build.options;

    // Check if assets already exist
    if (!buildOptions.assets) {
      buildOptions.assets = [];
    }

    // Add the library assets to the assets array
    buildOptions.assets.push({
      glob: '**/*',
      input: 'node_modules/ng-ui-extension/assets',
    //   input: path.join(libraryAssetsPath),
      output: 'assets'
    });

    // Save the modified angular.json file
    await fs.writeJson(angularJsonPath, angularJson, { spaces: 2 });

    console.log('angular.json updated successfully!');
  } catch (err) {
    console.error('Error updating angular.json:', err);
  }
}

// Run the function
updateAngularJson();
