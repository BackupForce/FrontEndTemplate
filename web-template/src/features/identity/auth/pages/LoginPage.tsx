import { Button, Card, Form, Input, Typography, message } from "antd";
import { useNavigate } from 'react-router-dom';
import { authToken } from '@/core/auth/authToken';
import { login, fetchMe } from '@/features/identity/auth/api/auth.api';
import type {LoginDto}  from '@/features/identity/auth/types/dto';
import { useAuth } from '@/shared/auth/useAuth';

const { Title } = Typography;

export default function LoginPage() {
  const [form] = Form.useForm();
  const navigate = useNavigate();
  const { setUser } = useAuth();

  const onFinish = async (values: LoginDto) => {
    try {
      const res = await login(values);
      console.log("登入成功", res);

      authToken.set(res.token); 
      // 可儲存 token，例如：
      //localStorage.setItem("token", res.token);
      message.success("登入成功");

      const user = await fetchMe();
      setUser(user);

      // 導向到主畫面
      navigate('/');
    } catch (error: unknown) {
      const err = error as Error;
      message.error(err.message || '登入失敗');
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <Card className="w-full max-w-md shadow-lg">
        <Title level={3}>登入系統</Title>

        <Form layout="vertical" form={form} onFinish={onFinish} autoComplete="off">
          <Form.Item
            label="電子郵件"
            name="email"
            rules={[
              { required: true, message: "請輸入 Email" },
              { type: "email", message: "Email 格式不正確" },
            ]}
          >
            <Input placeholder="請輸入 Email" />
          </Form.Item>

          <Form.Item
            label="密碼"
            name="password"
            rules={[{ required: true, message: "請輸入密碼" }]}
          >
            <Input.Password placeholder="請輸入密碼" />
          </Form.Item>

          <Form.Item>
            <Button type="primary" htmlType="submit" block>
              登入
            </Button>
          </Form.Item>
        </Form>
      </Card>
    </div>
  );
}
