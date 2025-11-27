import { Modal, Table, Tag } from "antd";
import type { NewsDetailResponse } from "../../models/news";

interface Props {
  open: boolean;
  onClose: () => void;
  newsDetails: NewsDetailResponse[] | undefined;
}

const ModalViewNewsDetails = ({ open, onClose, newsDetails }: Props) => {
  const columns = [
    {
      title: "Thứ tự",
      dataIndex: "contentIndex",
      width: 90,
    },
    {
      title: "Loại nội dung",
      dataIndex: "type",
      width: 150,
    },
    {
      title: "Nội dung",
      dataIndex: "content",
      render: (text: string) => (
        <div className="whitespace-pre-wrap">{text}</div>
      ),
    },
    {
      title: "Trạng thái",
      dataIndex: "status",
      width: 130,
      render: (value: number) =>
        value === 1 ? (
          <Tag color="green">Hoạt động</Tag>
        ) : (
          <Tag color="red">Ngưng hoạt động</Tag>
        ),
    },
  ];

  return (
    <Modal
      title="Chi tiết nội dung tin tức"
      open={open}
      onCancel={onClose}
      footer={null}
      width={900}
      centered
    >
      {!newsDetails || newsDetails.length === 0 ? (
        <div className="text-center text-gray-500 italic py-6">
          Không có chi tiết nội dung
        </div>
      ) : (
        <Table
          columns={columns}
          dataSource={[...newsDetails].sort(
            (a, b) => a.contentIndex - b.contentIndex
          )}
          pagination={false}
          scroll={{ y: 450 }}
        />
      )}
    </Modal>
  );
};

export default ModalViewNewsDetails;
