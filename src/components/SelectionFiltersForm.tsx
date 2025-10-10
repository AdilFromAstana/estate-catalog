import React, { useEffect } from "react";
import { Form, InputNumber, Select, Row, Col } from "antd";

const FiltersForm = ({ onChange }: { onChange: (filters: any) => void }) => {
  const [form] = Form.useForm();

  useEffect(() => {
    const subscription = form.watch((values) => {
      onChange(values);
    });
    return () => subscription.unsubscribe?.();
  }, [form]);

  return (
    <Form
      form={form}
      layout="vertical"
      onValuesChange={(_, values) => onChange(values)}
    >
      <Row gutter={16}>
        <Col span={8}>
          <Form.Item name="rooms" label="Количество комнат">
            <Select placeholder="Выберите">
              <Select.Option value={1}>1</Select.Option>
              <Select.Option value={2}>2</Select.Option>
              <Select.Option value={3}>3</Select.Option>
            </Select>
          </Form.Item>
        </Col>
        <Col span={8}>
          <Form.Item name="minPrice" label="Цена от">
            <InputNumber min={0} style={{ width: "100%" }} />
          </Form.Item>
        </Col>
        <Col span={8}>
          <Form.Item name="maxPrice" label="Цена до">
            <InputNumber min={0} style={{ width: "100%" }} />
          </Form.Item>
        </Col>
      </Row>

      <Row gutter={16}>
        <Col span={12}>
          <Form.Item name="cityId" label="Город">
            <Select placeholder="Выберите город">
              <Select.Option value={1}>Алматы</Select.Option>
              <Select.Option value={2}>Астана</Select.Option>
            </Select>
          </Form.Item>
        </Col>

        <Col span={12}>
          <Form.Item name="districtId" label="Район">
            <Select placeholder="Выберите район">
              <Select.Option value={3}>Медеуский</Select.Option>
              <Select.Option value={4}>Бостандыкский</Select.Option>
            </Select>
          </Form.Item>
        </Col>
      </Row>
    </Form>
  );
};

export default FiltersForm;
