import {
    Rule,
    SchematicContext,
    Tree
  } from '@angular-devkit/schematics';
//   import { addPackageToPackageJson } from '@angular-devkit/schematics/tasks';
  import * as json from 'json5';
  import * as path from 'path';
  
  // The main function of the schematic
  export function addLibraryAssetsToAngularJson(options: any): Rule {
    return (tree: Tree, _context: SchematicContext) => {
      // The path to the angular.json file
      const angularJsonPath = 'angular.json';
  
      // Check if angular.json exists
      if (!tree.exists(angularJsonPath)) {
        throw new Error('angular.json not found!');
      }
  
      // Read the angular.json content
      const angularJson = json.parse(tree.read(angularJsonPath)?.toString() || '{}');
  
      // Identify the consuming application's project
      const project = angularJson.projects[options.project];
  
      if (!project) {
        throw new Error(`Project ${options.project} not found in angular.json`);
      }
  
      // Check the build options of the project
      const buildOptions = project.architect?.build?.options;
  
      if (buildOptions?.assets) {
        // Add library assets to the assets array in angular.json
        buildOptions.assets.push({
          glob: '**/*',
          input: 'node_modules/ng-ui-extension/assets',
          output: '/assets/'
        });
      }
      if(buildOptions?.styles)
      {
        buildOptions?.styles.push("@angular/material/prebuilt-themes/deeppurple-amber.css")
      }
  
      // Write the updated angular.json back to the file system
      tree.overwrite(angularJsonPath, JSON.stringify(angularJson, null, 2));
  
      return tree;
    };
  }
  