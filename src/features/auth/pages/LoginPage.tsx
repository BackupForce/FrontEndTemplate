import { LockOutlined, MailOutlined } from '@ant-design/icons';
import { Button, Card, Form, Input, Typography } from 'antd';
import { useState } from 'react';
import { useAuth } from '@/app/providers/AuthProvider';
import { handleApiError } from '@/shared/ui/errors/handleApiError';
import { tAuth } from '@/shared/i18n/helpers';

interface LoginFormValues {
  email: string;
  password: string;
}

const LoginPage = (): JSX.Element => {
  const { SignIn } = useAuth();
  const [loading, setLoading] = useState(false);

  const onFinish = async (values: LoginFormValues): Promise<void> => {
    setLoading(true);
    try {
      await SignIn(values.email, values.password);
    } catch (error) {
      handleApiError(error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: '100vh' }}>
      <Card style={{ width: 360 }}>
        <Typography.Title level={4} style={{ textAlign: 'center' }}>
          {tAuth('title')}
        </Typography.Title>
        <Form name="login" layout="vertical" onFinish={onFinish} requiredMark={false}>
          <Form.Item name="email" label={tAuth('email')} rules={[{ required: true, message: tAuth('required') }]}> 
            <Input prefix={<MailOutlined />} type="email" placeholder="email@example.com" />
          </Form.Item>
          <Form.Item
            name="password"
            label={tAuth('password')}
            rules={[{ required: true, message: tAuth('required') }]}
          >
            <Input.Password prefix={<LockOutlined />} placeholder="******" />
          </Form.Item>
          <Form.Item>
            <Button type="primary" htmlType="submit" block loading={loading}>
              {tAuth('submit')}
            </Button>
          </Form.Item>
        </Form>
      </Card>
    </div>
  );
};

export default LoginPage;
