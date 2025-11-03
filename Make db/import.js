const { MongoClient } = require('mongodb');
const { products } = require('./products.js'); // Import mảng sản phẩm

// THAY THẾ BẰNG THÔNG TIN CỦA BẠN
const uri = "mongodb+srv://thaihoa3189_db_user:0946361989@cluster0.78vvbww.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0";
const dbName = "E-commerce";
const collectionName = "products";

async function run() {
  const client = new MongoClient(uri);

  try {
    // Kết nối tới server
    await client.connect();
    console.log("Đã kết nối thành công tới server Atlas.");

    const database = client.db(dbName);
    const collection = database.collection(collectionName);

    // Xóa dữ liệu cũ (TÙY CHỌN: Bỏ dòng này nếu bạn muốn giữ lại dữ liệu cũ)
    // await collection.deleteMany({});
    // console.log("Đã xóa dữ liệu cũ (nếu có).");

    // Chèn collection mới
    const result = await collection.insertMany(products);
    console.log(`Đã chèn thành công ${result.insertedCount} sản phẩm.`);

  } catch (err) {
    console.error("Đã xảy ra lỗi:", err);
  } finally {
    // Đảm bảo client sẽ đóng khi bạn hoàn thành hoặc gặp lỗi
    await client.close();
    console.log("Đã đóng kết nối.");
  }
}

run().catch(console.dir);