import { ApplicationGeneratorSchema } from './schema';

export interface NormalizedSchema extends ApplicationGeneratorSchema {
  projectName: string;
  projectModule: string;
  projectRoot: string;
  projectDirectory: string;
  parsedTags: string[];
}

export interface MixArgs {
  projectRoot: string;
  projectName: string;
  projectModule?: string;
}
