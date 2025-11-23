import { Modal, Form, Input, InputNumber, DatePicker } from "antd";
import type { VoucherRequest } from "../../models/voucher";

interface Props {
  open: boolean;
  onClose: () => void;
  onSubmit: (data: VoucherRequest) => void;
}

const ModalFormCreateVoucher = ({ open, onClose, onSubmit }: Props) => {
  const [form] = Form.useForm();

  const handleOk = async () => {
    const values = await form.validateFields();
    const payload: VoucherRequest = {
      code: values.code,
      discount: values.discount,
      expireAt: values.expireAt.format("YYYY-MM-DDTHH:mm:ss"),
      quantity: values.quantity,
      usedQuantity: 0,
      status: 1,
    };
    onSubmit(payload);
    form.resetFields();
  };

  return (
    <Modal
      title="Tạo voucher"
      open={open}
      onOk={handleOk}
      onCancel={onClose}
      destroyOnClose
    >
      <Form form={form} layout="vertical">
        <Form.Item name="code" label="Mã voucher" rules={[{ required: true }]}>
          <Input />
        </Form.Item>

        <Form.Item name="discount" label="Giảm (%)" rules={[{ required: true }]}>
          <InputNumber min={1} max={100} className="w-full" />
        </Form.Item>

        <Form.Item name="expireAt" label="Ngày hết hạn" rules={[{ required: true }]}>
          <DatePicker showTime className="w-full" />
        </Form.Item>

        <Form.Item name="quantity" label="Số lượng" rules={[{ required: true }]}>
          <InputNumber min={1} className="w-full" />
        </Form.Item>
      </Form>
    </Modal>
  );
};

export default ModalFormCreateVoucher;
