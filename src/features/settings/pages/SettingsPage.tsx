import { PageContainer } from '@ant-design/pro-components';
import { Descriptions, Tag } from 'antd';
import i18n from '@/shared/i18n';
import { tCommon } from '@/shared/i18n/helpers';

const SettingsPage = (): JSX.Element => {
  const apiBase = import.meta.env.VITE_API_BASE_URL ?? '';
  const versionedBase = `${apiBase.replace(/\/$/, '')}/v1`;
  const isMockEnabled = import.meta.env.VITE_ENABLE_MOCK === 'true';

  return (
    <PageContainer header={{ title: tCommon('settings') }}>
      <Descriptions bordered column={1} size="middle">
        <Descriptions.Item label={tCommon('status.apiBase')}>{versionedBase}</Descriptions.Item>
        <Descriptions.Item label="Locale">{i18n.language}</Descriptions.Item>
        <Descriptions.Item label={tCommon('status.mockEnabled')}>
          <Tag color={isMockEnabled ? 'green' : 'red'}>{isMockEnabled ? 'ON' : 'OFF'}</Tag>
        </Descriptions.Item>
      </Descriptions>
    </PageContainer>
  );
};

export default SettingsPage;
