import { useState, useMemo, useEffect } from "react";
import { Table, Input, Button } from "antd";
import { useNews } from "../../hooks/useNews";
import { EyeIcon } from "@heroicons/react/24/solid";
import debounce from "lodash.debounce";
import type { NewsResponse } from "../../models/news";
import ModalViewNewsDetails from "../../components/news/ModalNewsDetail";

const UserNewsPage = () => {
  const {
    news,
    loading,
    query,
    setQuery,
    fetchNews,
  } = useNews();

  const [openViewDetail, setOpenViewDetail] = useState(false);
  const [selectedNews, setSelectedNews] = useState<NewsResponse | null>(null);
  const [showAdvancedSearch, setShowAdvancedSearch] = useState(false);

  const debouncedFetch = useMemo(
    () =>
      debounce((title: string) => {
        fetchNews({ ...query, title });
      }, 500),
    [fetchNews, query]
  );

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setQuery((prev) => ({ ...prev, title: value }));
    debouncedFetch(value);
  };

  useEffect(() => {
    return () => {
      debouncedFetch.cancel();
    };
  }, [debouncedFetch]);

  const columns = [
    { title: "ID", dataIndex: "id", width: 50 },
    { title: "Tiêu đề", dataIndex: "title", width: 150 },
    { title: "Tác giả", dataIndex: "author", width: 100 },
    { title: "Nguồn", dataIndex: "source", width: 150 },
    { title: "Lượt xem", dataIndex: "viewCount", width: 80 },
    {
      title: "Trạng thái",
      dataIndex: "status",
      width: 90,
      render: (status: number) => (
        <span className={status === 1 ? "text-green-600" : "text-red-600"}>
          {status === 1 ? "Hoạt động" : "Ngưng hoạt động"}
        </span>
      ),
    },
    {
      title: "Ngày tạo",
      dataIndex: "createdAt",
      width: 100,
      render: (date: string) => new Date(date).toLocaleDateString("vi-VN"),
    },
    {
      title: "Thao tác",
      width: 120,
      render: (record: NewsResponse) => (
        <div className="flex space-x-2 items-center">
          <button
            className="flex items-center gap-2 bg-gray-200 border border-blue-500 text-blue-500 px-3 py-1 rounded transition hover:bg-blue-50"
            onClick={() => {
              setSelectedNews(record);
              setOpenViewDetail(true);
            }}
            title="Xem chi tiết"
          >
            <EyeIcon className="w-5 h-5" /><span>Xem chi tiết</span>
          </button>

          
        </div>
      ),
    },
  ];

  return (
    <div className="space-y-3">
      <div className="flex justify-between mb-4">
        <h2 className="text-2xl font-bold text-green-700 mb-4">Danh sách tin tức</h2>
     
      </div>

      <div className="flex !space-x-2 mb-4 items-end">
        <Input
          placeholder="Tìm kiếm theo tiêu đề..."
          value={query?.title || ""}
          onChange={handleSearchChange}
          className="w-64"
        />

        <Button onClick={() => setShowAdvancedSearch((prev) => !prev)}>
          Tìm kiếm nâng cao
        </Button>
      </div>

      {showAdvancedSearch && (
        <div className="flex !space-x-2 mb-4 items-end">
          <Input
            placeholder="Tác giả"
            value={query?.author || ""}
            onChange={(e) =>
              setQuery((prev) => ({ ...prev, author: e.target.value || undefined }))
            }
            style={{ width: 150 }}
          />

          <Input
            placeholder="Nguồn"
            value={query?.source || ""}
            onChange={(e) =>
              setQuery((prev) => ({ ...prev, source: e.target.value || undefined }))
            }
            style={{ width: 150 }}
          />

          <Button type="primary" onClick={() => fetchNews(query)}>
            Áp dụng
          </Button>
        </div>
      )}

      <Table
        columns={columns}
        dataSource={news}
        rowKey="id"
        pagination={false}
        loading={loading}
        components={{
          header: {
            cell: (props: any) => (
              <th {...props} className="!bg-green-300 text-black font-semibold">
                {props.children}
              </th>
            ),
          },
        }}
      />
       <ModalViewNewsDetails
  open={openViewDetail}
  onClose={() => setOpenViewDetail(false)}
  newsDetails={selectedNews?.newsDetails}
/>
    </div>
  );
};

export default UserNewsPage;