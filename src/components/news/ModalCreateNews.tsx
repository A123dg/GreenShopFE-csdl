import {
  Modal,
  Form,
  Input,
  InputNumber,
  Select,
  Button,
  Card,
} from "antd";
import { MinusCircleOutlined, PlusOutlined } from "@ant-design/icons";
import type { NewsRequest } from "../../models/news";
import { useEffect } from "react";

const { TextArea } = Input;
const { Option } = Select;

interface Props {
  open: boolean;
  onClose: () => void;
  onSubmit: (data: NewsRequest) => void;
}

const ModalFormCreateNews = ({ open, onClose, onSubmit }: Props) => {
  const [form] = Form.useForm();

  // ⭐ Reset form khi mở modal (có destroyOnClose)
  useEffect(() => {
    if (open) {
      form.setFieldsValue({
        newsDetail: [
          { content: "", type: 1, contentIndex: 0, status: 1 }
        ]
      });
    }
  }, [open]);

  const handleOk = async () => {
    const values = await form.validateFields();

    const payload: NewsRequest = {
      title: values.title,
      img: values.img,
      author: values.author,
      source: values.source,
      status: values.status,
      userId: values.userId,
      newsDetails: values.newsDetail || [],
    };

    onSubmit(payload);
    form.resetFields();
  };

  return (
    <Modal
      title="Tạo tin tức"
      open={open}
      onOk={handleOk}
      onCancel={onClose}
      destroyOnClose
      width={900}
    >
      <Form
        form={form}
        layout="vertical"
        initialValues={{
          newsDetail: [
            { content: "", type: 1, contentIndex: 0, status: 1 }
          ]
        }}
      >
        <Form.Item
          name="title"
          label="Tiêu đề"
          rules={[{ required: true, message: "Vui lòng nhập tiêu đề" }]}
        >
          <Input placeholder="Nhập tiêu đề" />
        </Form.Item>

        <Form.Item
          name="img"
          label="URL hình ảnh"
          rules={[{ required: true, message: "Vui lòng nhập URL" }]}
        >
          <Input placeholder="https://example.com/image.jpg" />
        </Form.Item>

        <Form.Item
          name="author"
          label="Tác giả"
          rules={[{ required: true, message: "Vui lòng nhập tên tác giả" }]}
        >
          <Input />
        </Form.Item>

        <Form.Item
          name="source"
          label="Nguồn"
          rules={[{ required: true, message: "Vui lòng nhập nguồn" }]}
        >
          <Input />
        </Form.Item>

        <Form.Item
          name="userId"
          label="User ID"
          rules={[{ required: true, message: "Vui lòng nhập User ID" }]}
        >
          <InputNumber min={1} className="w-full" />
        </Form.Item>

        <Form.Item name="status" label="Trạng thái" initialValue={1}>
          <Select>
            <Option value={1}>Hoạt động</Option>
            <Option value={0}>Ngưng hoạt động</Option>
          </Select>
        </Form.Item>

        <Form.List name="newsDetail">
          {(fields, { add, remove }) => (
            <>
              {fields.map(({ key, name }) => (
                <Card
                  key={key}
                  size="small"
                  title={`Nội dung chi tiết ${name + 1}`}
                  className="mb-3"
                  extra={
                    fields.length > 1 ? (
                      <MinusCircleOutlined onClick={() => remove(name)} />
                    ) : null
                  }
                >
                  <Form.Item
                    name={[name, "content"]}
                    label="Nội dung"
                    rules={[{ required: true, message: "Nhập nội dung" }]}
                  >
                    <TextArea rows={4} />
                  </Form.Item>

                  <Form.Item
                    name={[name, "type"]}
                    label="Loại nội dung"
                    rules={[{ required: true }]}
                  >
                    <InputNumber min={0} className="w-full" />
                  </Form.Item>

                  <Form.Item
                    name={[name, "contentIndex"]}
                    label="Thứ tự nội dung"
                    rules={[{ required: true }]}
                  >
                    <InputNumber min={0} className="w-full" />
                  </Form.Item>

                  <Form.Item
                    name={[name, "status"]}
                    label="Trạng thái nội dung"
                    rules={[{ required: true }]}
                  >
                    <Select>
                      <Option value={1}>Hoạt động</Option>
                      <Option value={0}>Ngưng hoạt động</Option>
                    </Select>
                  </Form.Item>
                </Card>
              ))}

              <Button
                type="dashed"
                onClick={() =>
                  add({
                    content: "",
                    type: 1,
                    contentIndex: fields.length,
                    status: 1,
                  })
                }
                block
                icon={<PlusOutlined />}
              >
                Thêm nội dung mới
              </Button>
            </>
          )}
        </Form.List>
      </Form>
    </Modal>
  );
};

export default ModalFormCreateNews;
