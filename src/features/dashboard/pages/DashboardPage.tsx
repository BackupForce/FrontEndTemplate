import { PageContainer } from '@ant-design/pro-components';
import { Typography } from 'antd';
import { tCommon } from '@/shared/i18n/helpers';

const DashboardPage = (): JSX.Element => {
  return (
    <PageContainer header={{ title: tCommon('dashboard') }}>
      <Typography.Paragraph>
        {tCommon('appTitle')} - {tCommon('dashboard')}
      </Typography.Paragraph>
    </PageContainer>
  );
};

export default DashboardPage;
