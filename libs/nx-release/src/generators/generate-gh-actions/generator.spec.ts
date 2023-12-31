import {createTreeWithEmptyWorkspace} from '@nx/devkit/testing';
import * as nxDevkit from '@nx/devkit';
import {Tree} from '@nx/devkit';

import * as spinnerHelper from "../helpers/spinner.helper";

import {GenerateGhActionsGeneratorSchema} from './schema';
import generateGhActionsGenerator from "./generator";

describe('generate-gh-actions generator', () => {
  let tree: Tree;
  const options: GenerateGhActionsGeneratorSchema = { name: 'test' };

  beforeEach(() => {
    tree = createTreeWithEmptyWorkspace();
    jest.spyOn(spinnerHelper, 'getSpinner').mockReturnValue(({
        start: jest.fn(),
        succeed: jest.fn(),
        fail: jest.fn(),
      }) as any
    );
  });

  it('should generate the GitHub actions', async () => {
    jest.spyOn(nxDevkit, 'generateFiles').mockImplementation(() => {});

    await generateGhActionsGenerator(tree, options);
    expect(nxDevkit.generateFiles).toHaveBeenCalled();
  });
});
