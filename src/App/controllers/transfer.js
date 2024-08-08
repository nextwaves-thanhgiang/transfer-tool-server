const moment = require("moment");
const jwt = require("jsonwebtoken");
const transferModal = require("../models/Transfer");

const SECRET_KEY = "Nextwaves@2023";
// Hàm tạo mã phiếu điều chuyển theo định dạng YYMMDDHHmmss
const generateTransferId = (date, time) => {
  const datePart = moment(date).format("YYMMDD");
  const timePart = moment(time, "HH:mm:ss").format("HHmmss");
  return `TS-${datePart}${timePart}`;
};

class Transfer {
  async createTransferSlip(req, res) {
    try {
      const {
        time,
        date,
        transport_type,
        receiver_name,
        notes,
        selectedProducts,
      } = req.body;

      // Giải mã token từ header
      const token = req.header("Authorization").replace("Bearer ", "");

      console.log(token);

      let userId;

      try {
        const decoded = jwt.verify(token, SECRET_KEY);

        console.log(decoded);

        userId = decoded.userId;
      } catch (error) {
        return res.status(401).json({ message: "Token không hợp lệ" });
      }

      // Kiểm tra transport_type và thiết lập kho nguồn và kho đích
      let fromWarehouse, toWarehouse;
      if (transport_type === "lanh_vat_tu_san_xuat") {
        fromWarehouse = "Kho đường 10";
        toWarehouse = "Kho đường 8";
      } else if (transport_type === "tra_vat_tu_dang_do") {
        fromWarehouse = "Kho đường 8";
        toWarehouse = "Kho đường 10";
      } else {
        return res
          .status(400)
          .json({ message: "Loại vận chuyển không hợp lệ" });
      }

      // Tạo mã phiếu điều chuyển
      const transferId = generateTransferId(date, time);

      // Dữ liệu chuyển phiếu
      const transferSlip = {
        transferId,
        time,
        date,
        transport_type,
        fromWarehouse,
        toWarehouse,
        responsiblePerson: receiver_name,
        notes,
        products: selectedProducts,
        status: "pending",
        createdBy: userId, // Sử dụng _id từ token đã giải mã
        approvedBy: null,
        transferNotes: notes,
        transferMethod: "truck", // Mặc định hoặc lấy từ form
        timestamp: new Date().toISOString(),
      };

      console.log(userId);

      // Lưu dữ liệu vào cơ sở dữ liệu
      await transferModal.create(transferSlip);

      // Lưu dữ liệu vào cơ sở dữ liệu hoặc thực hiện các thao tác cần thiết
      // Ví dụ: await TransferSlipModel.create(transferSlip);

      res.status(200).json({
        message: "Xuất phiếu điều chuyển thành công!",
        transferId,
      });
    } catch (error) {
      console.error("Error creating transfer slip:", error);
      res
        .status(500)
        .json({ message: "Có lỗi xảy ra khi xuất phiếu điều chuyển" });
    }
  }

  async getDataById(req, res) {
    console.log("Join to getDataById");

    const { id } = req.params;

    try {
      const transferData = await transferModal.findOne({ transferId: id });
      if (!transferData) {
        return res.status(404).json({ message: "Tramsfer not found" });
      }

      return res.status(200).json(transferData);
    } catch (error) {
      console.error("Error fetching transfer data:", error);
      return res.status(500).json({ message: "Internal server error" });
    }
  }
}

module.exports = new Transfer();
