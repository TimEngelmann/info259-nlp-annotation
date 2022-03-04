import { useContext } from "react";
import { Form, Input, Button, Checkbox } from "antd";
import styles from "../styles/Home.module.css";

import { useRouter } from "next/router";

import { AuthUserContext } from "../utils/auth";

export default function Register() {
  const userContext = useContext(AuthUserContext);
  const router = useRouter();

  const onFinish = async (values) => {
  
    try {
      const cred = await userContext.createUser(
        values.email,
        values.password,
        values.username
      );
      router.push("/");
    } catch (e) {
      // console.log("Registration failed from server side");
    }
  };

  const onFinishFailed = (errorInfo) => {
    // console.log("Registration Data has not been submitted", errorInfo);
  };

  return (
    <div className={styles.container}>
      <main className={styles.main}>
        <h1>Register</h1>
        <Form
          name="basic"
          labelCol={{ span: 8 }}
          wrapperCol={{ span: 16 }}
          initialValues={{ remember: true }}
          onFinish={onFinish}
          onFinishFailed={onFinishFailed}
          autoComplete="off"
        >
          <Form.Item
            label="Username"
            name="username"
            rules={[{ required: true, message: "Please input your username!" }]}
          >
            <Input />
          </Form.Item>

          <Form.Item
            label="Email"
            name="email"
            rules={[
              { required: true, message: "Please input your email adress!" },
            ]}
          >
            <Input />
          </Form.Item>

          <Form.Item
            label="Password"
            name="password"
            rules={[{ required: true, message: "Please input your password!" }]}
          >
            <Input.Password />
          </Form.Item>

          <Form.Item wrapperCol={{ offset: 8, span: 16 }}>
            <Button type="primary" htmlType="submit">
              Submit
            </Button>
          </Form.Item>
        </Form>
      </main>
    </div>
  );
}
