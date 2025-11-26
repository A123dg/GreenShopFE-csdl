import { Modal, Spin } from "antd";
import { useEffect, useState, useMemo } from "react";
import type { NewsResponse } from "../../models/news";
import { useNews } from "../../hooks/useNews";

interface Props {
  open: boolean;
  onClose: () => void;
  newsId: number | null;
}

const ModalViewNewsDetail = ({ open, onClose, newsId }: Props) => {
  const { getNewsById, loading } = useNews();
  const [news, setNews] = useState<NewsResponse | null>(null);

  useEffect(() => {
    if (open && newsId !== null) {
      getNewsById(newsId).then((res) => { if (res?.data) setNews(res.data); else setNews(null); })
    } else {
      setNews(null);
    }
  }, [open, newsId, getNewsById]);

  const sortedDetails = useMemo(() => {
    return [...(news?.newsDetails || [])].sort(
      (a, b) => a.contentIndex - b.contentIndex
    );
  }, [news]);

  return (
    <Modal
      title={<span className="text-xl font-bold text-green-700">Chi tiết tin tức</span>}
      open={open}
      onCancel={onClose}
      footer={null}
      width={800}
    >
      {loading || !news ? (
        <div className="flex justify-center items-center h-64">
          <Spin size="large" />
        </div>
      ) : (
        <div className="space-y-4">
          {/* Header */}
          <div className="border-b pb-4">
            <h3 className="text-lg font-semibold mb-2">{news.title}</h3>
            <div className="grid grid-cols-2 gap-2 text-sm text-gray-600">
              <div><span className="font-medium">Tác giả:</span> {news.author}</div>
              <div><span className="font-medium">Nguồn:</span> {news.source}</div>
              <div><span className="font-medium">Lượt xem:</span> {news.viewCount}</div>
              <div>
                <span className="font-medium">Trạng thái:</span>{" "}
                <span className={news.status === 1 ? "text-green-600" : "text-red-600"}>
                  {news.status === 1 ? "Hoạt động" : "Ngưng hoạt động"}
                </span>
              </div>
              <div>
                <span className="font-medium">Ngày tạo:</span>{" "}
                {new Date(news.createdAt).toLocaleDateString("vi-VN")}
              </div>
            </div>
          </div>

          {/* Image */}
          {news.img && (
            <div className="flex justify-center">
              <img
                src={news.img}
                alt={news.title}
                className="max-w-full h-auto rounded-lg shadow-md"
              />
            </div>
          )}

          {/* Details */}
          <div className="space-y-3">
            <h4 className="font-semibold text-lg text-green-700">Nội dung chi tiết:</h4>
            {sortedDetails.length > 0 ? (
              sortedDetails.map((detail, i) => (
                <div key={i} className="p-3 bg-gray-50 rounded-lg border">
                  <div className="flex justify-between items-start mb-2">
                    <span className="text-xs font-medium text-gray-500">
                      Phần {detail.contentIndex + 1} - Loại: {detail.type === 1 ? "Văn bản" : "Khác"}
                    </span>
                    <span
                      className={`text-xs px-2 py-1 rounded ${
                        detail.status === 1
                          ? "bg-green-100 text-green-700"
                          : "bg-red-100 text-red-700"
                      }`}
                    >
                      {detail.status === 1 ? "Hoạt động" : "Ngưng"}
                    </span>
                  </div>
                  <div className="text-sm text-gray-700 whitespace-pre-wrap">
                    {detail.content}
                  </div>
                </div>
              ))
            ) : (
              <p className="text-gray-500 italic">Không có nội dung chi tiết</p>
            )}
          </div>
        </div>
      )}
    </Modal>
  );
};

export default ModalViewNewsDetail;
