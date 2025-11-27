import { Modal, Form, Input, InputNumber, Select, Button, Divider, message } from "antd";
import { DeleteOutlined, PlusOutlined } from "@ant-design/icons";
import type { NewsRequest, NewsResponse, NewsDetailResponse } from "../../models/news";
import { useEffect, useState } from "react";

const { TextArea } = Input;
const { Option } = Select;

interface Props {
  open: boolean;
  onClose: () => void;
  onSubmit: (id: number, data: NewsRequest) => void;
  news: NewsResponse | null;
}

const ModalFormUpdateNews = ({ open, onClose, onSubmit, news }: Props) => {
  const [form] = Form.useForm();
  const [newsDetails, setNewsDetails] = useState<NewsDetailResponse[]>([]);

  useEffect(() => {
    if (open && news) {
      
      form.setFieldsValue({
        title: news.title,
        img: news.img,
        author: news.author,
        source: news.source,
        status: news.status,
        userId: news.user?.userId,
      });
      
      // Set initial newsDetails từ API
      if (news.newsDetails && Array.isArray(news.newsDetails) && news.newsDetails.length > 0) {
        setNewsDetails(news.newsDetails);
      } else {
        setNewsDetails([]);
      }
    } else {
      form.resetFields();
      setNewsDetails([]);
    }
  }, [news, open, form]);

  const handleOk = async () => {
    try {
      const values = await form.validateFields();

      // Validate newsDetails
      if (newsDetails.length === 0) {
        message.error("Vui lòng thêm ít nhất một chi tiết nội dung");
        return;
      }

      // Validate từng newsDetail
      for (let i = 0; i < newsDetails.length; i++) {
        const detail = newsDetails[i];
        if (!detail.content || detail.content.trim() === "") {
          message.error(`Chi tiết ${i + 1}: Vui lòng nhập nội dung`);
          return;
        }
        if (detail.type === undefined || detail.type === null) {
          message.error(`Chi tiết ${i + 1}: Vui lòng nhập loại nội dung`);
          return;
        }
        if (detail.contentIndex === undefined || detail.contentIndex === null) {
          message.error(`Chi tiết ${i + 1}: Vui lòng nhập thứ tự`);
          return;
        }
      }

      const payload: NewsRequest = {
        title: values.title,
        img: values.img,
        author: values.author,
        source: values.source,
        status: values.status,
        userId: values.userId,
        newsDetails: newsDetails,
      };

      console.log("Payload gửi lên:", payload);

      if (news) {
        onSubmit(news.id, payload);
        form.resetFields();
        setNewsDetails([]);
      }
    } catch (error) {
      console.error("Validation error:", error);
    }
  };

  const handleCancel = () => {
    form.resetFields();
    setNewsDetails([]);
    onClose();
  };

  const addNewsDetail = () => {
    const newDetail: NewsDetailResponse = {
      content: "",
      status: 1,
      type: 0,
      contentIndex: newsDetails.length,
    };
    setNewsDetails([...newsDetails, newDetail]);
  };

  const updateNewsDetail = (index: number, field: keyof NewsDetailResponse, value: any) => {
    const updated = [...newsDetails];
    updated[index] = {
      ...updated[index],
      [field]: value,
    };
    setNewsDetails(updated);
  };

  const deleteNewsDetail = (index: number) => {
    setNewsDetails(newsDetails.filter((_, i) => i !== index));
  };

  return (
    <Modal
      title="Cập nhật tin tức"
      open={open}
      onOk={handleOk}
      onCancel={handleCancel}
      destroyOnClose
      width={900}
      okText="Cập nhật"
      cancelText="Hủy"
    >
      <Form form={form} layout="vertical">
        {/* Basic Info */}
        <Form.Item
          name="title"
          label="Tiêu đề"
          rules={[{ required: true, message: "Vui lòng nhập tiêu đề" }]}
        >
          <Input placeholder="Nhập tiêu đề tin tức" />
        </Form.Item>

        <Form.Item
          name="img"
          label="URL hình ảnh"
          rules={[{ required: true, message: "Vui lòng nhập URL hình ảnh" }]}
        >
          <Input placeholder="https://example.com/image.jpg" />
        </Form.Item>

        <Form.Item
          name="author"
          label="Tác giả"
          rules={[{ required: true, message: "Vui lòng nhập tác giả" }]}
        >
          <Input placeholder="Nhập tên tác giả" />
        </Form.Item>

        <Form.Item
          name="source"
          label="Nguồn"
          rules={[{ required: true, message: "Vui lòng nhập nguồn" }]}
        >
          <Input placeholder="Nhập nguồn tin tức" />
        </Form.Item>

        <Form.Item
          name="userId"
          label="User ID"
          rules={[{ required: true, message: "Vui lòng nhập User ID" }]}
        >
          <InputNumber min={1} className="w-full" placeholder="Nhập ID người dùng" />
        </Form.Item>

        <Form.Item
          name="status"
          label="Trạng thái"
          rules={[{ required: true, message: "Vui lòng chọn trạng thái" }]}
        >
          <Select>
            <Option value={1}>Hoạt động</Option>
            <Option value={0}>Ngưng hoạt động</Option>
          </Select>
        </Form.Item>

        <Divider>Chi tiết nội dung</Divider>

        {/* News Details */}
        <div className="space-y-4 max-h-96 overflow-y-auto">
          {newsDetails.length === 0 ? (
            <div className="text-center text-gray-400 py-4">Chưa có chi tiết nội dung nào</div>
          ) : (
            newsDetails.map((detail, index) => (
              <div key={index} className="border border-gray-300 rounded p-4 bg-gray-50">
                <div className="flex justify-between items-center mb-3">
                  <h4 className="font-semibold">Chi tiết {index + 1}</h4>
                  <Button
                    type="text"
                    danger
                    size="small"
                    icon={<DeleteOutlined />}
                    onClick={() => deleteNewsDetail(index)}
                  >
                    Xóa
                  </Button>
                </div>

                <div className="mb-3">
                  <label className="block text-sm font-medium mb-1">
                    Nội dung <span className="text-red-500">*</span>
                  </label>
                  <TextArea
                    rows={3}
                    placeholder="Nhập nội dung chi tiết"
                    value={detail.content}
                    onChange={(e) => updateNewsDetail(index, "content", e.target.value)}
                  />
                </div>

                <div className="grid grid-cols-3 gap-3">
                  <div>
                    <label className="block text-sm font-medium mb-1">
                      Loại nội dung <span className="text-red-500">*</span>
                    </label>
                    <InputNumber
                      min={0}
                      className="w-full"
                      placeholder="Nhập loại"
                      value={detail.type}
                      onChange={(val) => updateNewsDetail(index, "type", val)}
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium mb-1">
                      Thứ tự <span className="text-red-500">*</span>
                    </label>
                    <InputNumber
                      min={0}
                      className="w-full"
                      placeholder="Nhập thứ tự"
                      value={detail.contentIndex}
                      onChange={(val) => updateNewsDetail(index, "contentIndex", val)}
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium mb-1">
                      Trạng thái <span className="text-red-500">*</span>
                    </label>
                    <Select
                      value={detail.status}
                      onChange={(val) => updateNewsDetail(index, "status", val)}
                      className="w-full"
                    >
                      <Option value={1}>Hoạt động</Option>
                      <Option value={0}>Ngưng hoạt động</Option>
                    </Select>
                  </div>
                </div>
              </div>
            ))
          )}

          <Button
            type="dashed"
            block
            icon={<PlusOutlined />}
            onClick={addNewsDetail}
            className="mt-3"
          >
            Thêm chi tiết nội dung
          </Button>
        </div>
      </Form>
    </Modal>
  );
};

export default ModalFormUpdateNews;