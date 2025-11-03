const CategoryTabs = ({ selectedCategory, setSelectedCategory }) => {
  const categories = ["Thời Trang Nam", "Điện Thoại & Phụ Kiện", "Máy Tính & Laptop", "Máy Ảnh & Máy Quay Phim", "Thiết Bị Điện Tử", "Đồng Hồ", "Giày Dép Nam", "Thiết Bị Điện Gia Dụng"];

  return (
    <nav>
      <div id="navbar-container" className="flex border-b-2 border-blue-500">
        {categories.map((category) => (
          <button key={category} onClick={() => setSelectedCategory(category)} className={`tab flex-1 px-4 py-2 font-semibold rounded-t-md cursor-pointer ${selectedCategory === category ? 'bg-white text-blue-600 border-l-2 border-t-2 border-r-2 border-b-2 border-blue-500 border-b-white mb-[-2px] relative' : 'text-gray-600 bg-gray-100 border-l border-t border-r border-gray-200'}`}>{category}</button>
        ))}
      </div>
    </nav>
  );
};

export default CategoryTabs;