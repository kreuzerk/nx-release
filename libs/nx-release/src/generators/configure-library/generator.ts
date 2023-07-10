import {formatFiles, Tree, updateJson} from '@nx/devkit';
import * as process from "process";
import * as inquirer from 'inquirer';
import * as chalk from "chalk";
import * as ora from 'ora';

import {getLibraryProjectNames, getLibrarySourceRoot} from "../helpers/projects";

import {ConfigureLibraryGeneratorSchema} from './schema';

export async function configureLibraryGenerator(
  tree: Tree,
  options: ConfigureLibraryGeneratorSchema
) {
  let {libName} = options;
  const {libPath, updatePublishConfig} = options;
  const spinner = ora();

  try {
    if (!libName) {
      const libraryProjects = getLibraryProjectNames(tree);

      if (libraryProjects.length === 0) {
        console.log(chalk.blue(`🐋 nx-release: no library projects found in your workspace -> aborting`));
        process.exit(0);
      }

      const projectPrompt = await inquirer.prompt({
        type: 'list',
        name: 'selectedProject',
        choices: libraryProjects
      });
      libName = projectPrompt.selectedProject;
    }

    spinner.text = '🐋 nx-release: configuring executor';
    spinner.start();

    updateJson(tree, `${getLibrarySourceRoot(tree, libName)}/project.json`, (packageJson: any) => {
      packageJson.targets.release = {
        executor: 'nx-release:build-update-publish',
        options: {
          libName
        }
      };
      return packageJson;
    });

    spinner.succeed();

    if (updatePublishConfig) {
      spinner.text = '🐋 nx-release: add public publish config';
      spinner.start();

      updateJson(tree, `${projectRoot}/package.json`, (packageJson: any) => {
        packageJson.publishConfig = {
          access: 'public'
        };
        return packageJson;
      });
      spinner.succeed();
    }
    await formatFiles(tree);
  } catch (e) {
    spinner.fail(`🐋 nx-release: something went wrong: ${e.toString()}`)
  }
}

export default configureLibraryGenerator;
