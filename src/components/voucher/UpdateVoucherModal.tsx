import { Modal, Form, Input, InputNumber, DatePicker } from "antd";
import dayjs from "dayjs";
import type { VoucherRequest, VoucherResposne } from "../../models/voucher";
import { useEffect } from "react";

interface Props {
  open: boolean;
  onClose: () => void;
  onSubmit: (id: number, data: VoucherRequest) => void;
  voucher: VoucherResposne | null; 
}

const ModalFormUpdateVoucher = ({ open, onClose, onSubmit, voucher }: Props) => {
  const [form] = Form.useForm();

  useEffect(() => {
    if (voucher) {
      form.setFieldsValue({
        code: voucher.code,
        discount: voucher.discount,
        expireAt: dayjs(voucher.expireAt),
        quantity: voucher.quantity,
        usedQuantity: voucher.usedQuantity,
      });
    }
  }, [voucher, form]);

  const handleOk = async () => {
    const values = await form.validateFields();

    const payload: VoucherRequest = {
      code: values.code,
      discount: values.discount,
      expireAt: values.expireAt.format("YYYY-MM-DDTHH:mm:ss"), 
      quantity: values.quantity,
      usedQuantity: values.usedQuantity,
      status: 1,
    };

    if (voucher) {
      onSubmit(voucher.id, payload);
    }

    form.resetFields();
  };

  return (
    <Modal
      title="Cập nhật voucher"
      open={open}
      onOk={handleOk}
      onCancel={onClose}
      destroyOnHidden

    >
      <Form form={form} layout="vertical">
        <Form.Item name="code" label="Mã voucher" rules={[{ required: true }]}>
          <Input />
        </Form.Item>

        <Form.Item
          name="discount"
          label="Giảm (%)"
          rules={[{ required: true }]}
        >
          <InputNumber min={1} max={100} className="w-full" />
        </Form.Item>

        <Form.Item
          name="expireAt"
          label="Ngày hết hạn"
          rules={[{ required: true }]}
        >
          <DatePicker showTime className="w-full" />
        </Form.Item>

        <Form.Item
          name="quantity"
          label="Số lượng"
          rules={[{ required: true }]}
        >
          <InputNumber min={1} className="w-full" />
        </Form.Item>

        <Form.Item
          name="usedQuantity"
          label="Đã sử dụng"
          rules={[{ required: true }]}
        >
          <InputNumber min={0} className="w-full" />
        </Form.Item>
      </Form>
    </Modal>
  );
};

export default ModalFormUpdateVoucher;
