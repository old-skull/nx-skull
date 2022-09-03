import {
  addProjectConfiguration,
  formatFiles,
  getWorkspaceLayout,
  names,
  Tree,
} from '@nrwl/devkit';
import { execSync } from 'child_process';
import { MixArgs, NormalizedSchema } from './interfaces';
import { ApplicationGeneratorSchema } from './schema';
import { capitalize } from './util';

const normalizeOptions = (
  tree: Tree,
  options: ApplicationGeneratorSchema
): NormalizedSchema => {
  const { name, directory, tags, module } = options;

  const appName = names(name).fileName;

  const projectDirectory = directory
    ? `${names(directory).fileName}/${appName}`
    : appName;
  const projectName = projectDirectory.replace(new RegExp('/', 'g'), '-');
  const projectModule = capitalize(module);
  const projectRoot = `${getWorkspaceLayout(tree).appsDir}/${projectDirectory}`;
  const parsedTags = tags ? tags.split(',').map((s) => s.trim()) : [];

  return {
    ...options,
    projectName,
    projectModule,
    projectRoot,
    projectDirectory,
    parsedTags,
  };
};

export const execMix = ({
  projectRoot,
  projectModule,
  projectName,
}: MixArgs) => {
  const module = projectModule || capitalize(projectName);

  execSync(`mix new ${projectRoot} --module ${module}`);
};

export const applicationGenerator = async (
  tree: Tree,
  options: ApplicationGeneratorSchema
) => {
  const { projectName, projectModule, projectRoot, parsedTags } =
    normalizeOptions(tree, options);

  addProjectConfiguration(tree, projectName, {
    root: projectRoot,
    projectType: 'application',
    sourceRoot: `${projectRoot}/src`,
    tags: parsedTags,
  });

  execMix({ projectRoot, projectName, projectModule });

  await formatFiles(tree);
};
