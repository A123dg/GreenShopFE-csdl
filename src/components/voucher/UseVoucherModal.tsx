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

const ModalFormUseVoucher = ({ open, onClose, onSubmit, voucher }: Props) => {
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
      code: voucher!.code,             // không cho sửa
      discount: voucher!.discount,     // không cho sửa
      expireAt: voucher!.expireAt,     // không cho sửa
      quantity: voucher!.quantity,     // không cho sửa

      usedQuantity: values.usedQuantity, // chỉ trường này cập nhật
      status: 1,
    };

    if (voucher) {
      onSubmit(voucher.id, payload);
    }

    form.resetFields();
  };

  return (
    <Modal
      title="Cập nhật số lần sử dụng voucher"
      open={open}
      onOk={handleOk}
      onCancel={onClose}
      destroyOnHidden
    >
      <Form form={form} layout="vertical">

        <Form.Item name="code" label="Mã voucher">
          <Input disabled />
        </Form.Item>

        <Form.Item name="discount" label="Giảm (%)">
          <InputNumber className="w-full" disabled />
        </Form.Item>

        <Form.Item name="expireAt" label="Ngày hết hạn">
          <DatePicker showTime className="w-full" disabled />
        </Form.Item>

        <Form.Item name="quantity" label="Số lượng">
          <InputNumber className="w-full" disabled />
        </Form.Item>

        <Form.Item
          name="usedQuantity"
          label="Sử dụng"
          rules={[{ required: true, message: "Nhập số lượng muốn sử dụng" }]}
        >
          <InputNumber min={0} className="w-full" />
        </Form.Item>

      </Form>
    </Modal>
  );
};

export default ModalFormUseVoucher;
