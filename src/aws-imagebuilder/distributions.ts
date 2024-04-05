import { ILaunchTemplate } from 'aws-cdk-lib/aws-ec2';
import { CfnDistributionConfiguration } from 'aws-cdk-lib/aws-imagebuilder';
import {
  captureStackTrace,
  IResolvable,
  IResolveContext,
  Stack,
} from 'aws-cdk-lib/core';


export interface AmiDistributionProps {
  nameTemplate?: string;
}

export class AmiDistribution implements IResolvable {
  public readonly creationStack: string[];
  protected name: string;

  public constructor(amiName: string, props: AmiDistributionProps = {}) {
    const { nameTemplate = `${amiName} - {{imagebuilder:buildDate}}` } = props;
    this.name = nameTemplate;
    this.creationStack = captureStackTrace();
  }

  resolve(context: IResolveContext) {
    return {
      amiDistributionConfiguration: {
        Name: this.name,
      },
      region: Stack.of(context.scope).region,
    };
  }
}

export interface LaunchTemplateDistributionProps extends AmiDistributionProps {
  amiName: string;
  launchTemplates: ILaunchTemplate[];
  setDefaultVersion?: boolean;
}

export class LaunchTemplateDistribution extends AmiDistribution {
  readonly launchTemplateConfigurations?: CfnDistributionConfiguration.LaunchTemplateConfigurationProperty[];
  private props: LaunchTemplateDistributionProps;

  public constructor(props: LaunchTemplateDistributionProps) {
    super(props.amiName, props);
    this.props = props;
  }

  resolve(context: IResolveContext) {
    const { launchTemplates, setDefaultVersion = true } = this.props;

    return {
      ...super.resolve(context),
      launchTemplateConfigurations: launchTemplates.map((launchTemplate) => ({
        accountId: Stack.of(context.scope).account,
        launchTemplateId: launchTemplate.launchTemplateId,
        setDefaultVersion,
      })),
    };
  }
}
