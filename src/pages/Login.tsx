import { useState } from "react";
import { Box } from "@mui/material";
import { useTranslation } from "react-i18next";
import { Form, Input, Button, Card, Typography, Alert, Space } from "antd";
import { UserOutlined, LockOutlined } from "@ant-design/icons";
import { useAuthContext } from "@/contexts/stateContext";
import axiosClient from "@/helpers/axios-client";
import loginBack from "./../assets/images/table.jpg";
import { useAuthStore } from "@/AuthStore";

function App() {
  const {setCloseLoginDialog,startSession} = useAuthStore((state)=>state)
  const { t } = useTranslation('login');
  const [error, setError] = useState({ val: false, msg: "" });
  const [loading, setLoading] = useState(false);
  const { authenticate, setUser } = useAuthContext();
  const [form] = Form.useForm();
 
  const submitHandler = (values: { username: string; password: string }) => {
    setLoading(true);
    setError({ val: false, msg: "" });
    
    axiosClient
      .post("login", {
        username: values.username,
        password: values.password
      })
      .then(({ data }) => {
        if (data.status) {
          setCloseLoginDialog()
          setUser(data.user);
          authenticate(data.token);
          startSession(data.token, data.user)
          localStorage.setItem("user_type", data.user.user_type);
        }
      })
      .catch((error) => {
        setError({ val: true, msg: error.response?.data?.message || "Login failed" });
      })
      .finally(() => setLoading(false));
  };

  return (
    <Box
      sx={{
        display: "flex",
        height: "100vh",
        justifyContent: "center",
        alignItems: "center",
        backgroundImage: `linear-gradient(rgba(0, 0, 0, 0.5), rgba(0, 0, 0, 0.5)), url(${loginBack})`,
        backgroundSize: "cover",
        backgroundPosition: "center",
      }}
    >
      <Card 
        style={{ 
          width: 400, 
          boxShadow: '0 4px 12px rgba(0, 0, 0, 0.15)',
          borderRadius: '12px'
        }}
        bodyStyle={{ padding: '32px' }}
      >
        <Space direction="vertical" size="large" style={{ width: '100%' }}>
          <div style={{ textAlign: 'center' }}>
            <Typography.Title level={2} style={{ margin: 0, color: '#111827' }}>
              {t("login.title")}
            </Typography.Title>
          </div>

          <Form
            form={form}
            name="login"
            onFinish={submitHandler}
            layout="vertical"
            size="large"
            dir="rtl"
          >
            <Form.Item
              name="username"
              label={t("login.username")}
              rules={[{ required: true, message: 'Please input your username!' }]}
            >
              <Input 
                prefix={<UserOutlined />} 
                placeholder={t("login.username")}
                style={{ borderRadius: '8px' }}
              />
            </Form.Item>

            <Form.Item
              name="password"
              label={t("login.password")}
              rules={[{ required: true, message: 'Please input your password!' }]}
            >
              <Input.Password 
                prefix={<LockOutlined />} 
                placeholder={t("login.password")}
                style={{ borderRadius: '8px' }}
              />
            </Form.Item>

            <Form.Item style={{ marginBottom: 0 }}>
              <Button 
                type="primary" 
                htmlType="submit" 
                loading={loading}
                block
                style={{ 
                  height: '48px',
                  borderRadius: '8px',
                  fontSize: '16px',
                  fontWeight: 'bold'
                }}
              >
                {loading ? t("login.loading") : t("login.submit")}
              </Button>
            </Form.Item>
          </Form>

          {error.val && (
            <Alert
              message={error.msg}
              type="error"
              showIcon
              style={{ borderRadius: '8px' }}
            />
          )}
        </Space>
      </Card>
    </Box>
  );
}

export default App;
