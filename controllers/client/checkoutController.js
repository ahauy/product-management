const Orders = require('../../models/orders.model')
const Cart = require('../../models/cart.model')
const Product = require('../../models/products.model')
const generateRandomString = require('../../helpers/admin/generate')
const formatMoney = require("../../helpers/client/formatMoney");
const axios = require("axios");
const crypto = require("crypto");
const mongoose = require("mongoose");

// [GET] /checkout/failure
module.exports.failure = async (req, res) => {
  res.render("client/pages/checkout/failure", {
    pageTitle: "Thanh toán thất bại"
  });
}

// [GET] /checkout/:orderId
module.exports.getCheckout = async (req, res) => {
  try {
    const orderId = req.params.orderId;
    if (!mongoose.Types.ObjectId.isValid(orderId)) {
      return res.redirect("/");
    }
    const order = await Orders.findOne({_id: orderId})
    if(!order) return res.redirect("/");

    const discountMoney = order.products.reduce((acc, cur) => {
      const price = cur.price || 0;
      const salePrice = cur.salePrice || price;
      return acc + (price - salePrice)
    }, 0)

    res.render('client/pages/checkout/checkout.success.pug', {
      order: order,
      formatMoney: formatMoney,
      discountMoney: discountMoney
    })
  } catch (error) {
    console.log(error);
    res.redirect("/");
  }
}

// [POST] /checkout/order
module.exports.orderPost = async (req, res) => {
  try {
    const cartId = req.cookies.cartId;
    const cart = await Cart.findOne({_id: cartId});
    
    // 1. Lấy thông tin khách hàng từ form
    const userInfo = {
      fullName: req.body.fullName,
      email: req.body.email,
      phone: req.body.phone,
      address: req.body.address, 
      province: req.body.province ? req.body.province : "",
      district: req.body.district ? req.body.district : "",
      ward: req.body.ward ? req.body.ward : "",
    }
    
    const note = req.body.note;
    const voucherCode = req.body.voucherCode;
    const paymentMethod = req.body.paymentMethod; // "MOMO" hoặc "COD"

    // 2. Tạo mã đơn hàng (để dùng luôn hoặc gửi sang MoMo)
    // Sửa lại cách gọi hàm generate:
    const orderCode = "OD" + generateRandomString.generateRandomString(8).toUpperCase();

    // --- TRƯỜNG HỢP 1: THANH TOÁN MOMO ---
    if (paymentMethod === "MOMO") {
      // Cấu hình MoMo
      const partnerCode = "MOMO"; 
      const accessKey = "F8BBA842ECF85"; 
      const secretKey = "K951B6PE1waDMi640xX08PD3vg6EkVlz"; 
      const apiEndpoint = "https://test-payment.momo.vn/v2/gateway/api/create";

      // LƯU Ý QUAN TRỌNG: 
      // Vì chưa lưu đơn hàng vào DB nên chưa có _id. 
      // Ta dùng luôn orderCode làm orderId để gửi sang MoMo.
      const orderId = orderCode; 
      const requestId = orderCode;
      const amount = cart.totalPrice.toString();
      const orderInfoText = "Thanh toan don hang " + orderCode;
      
      const redirectUrl = `http://localhost:3000/checkout/momo/callback`; 
      const ipnUrl = `http://localhost:3000/checkout/momo/ipn`; 
      const requestType = "payWithATM"; 

      // --- MẤU CHỐT Ở ĐÂY: GỬI THÔNG TIN KHÁCH HÀNG VÀO EXTRADATA ---
      // Ta đóng gói thông tin khách hàng vào JSON, sau đó mã hóa Base64 để gửi đi
      const extraDataObj = {
        userInfo: userInfo,
        note: note,
        voucherCode: voucherCode,
        orderCode: orderCode // Gửi mã code đi để lúc về lấy lại dùng
      };
      
      // Mã hóa sang Base64 để không bị lỗi ký tự đặc biệt
      const extraData = Buffer.from(JSON.stringify(extraDataObj)).toString('base64');

      // Tạo chữ ký
      const rawSignature = `accessKey=${accessKey}&amount=${amount}&extraData=${extraData}&ipnUrl=${ipnUrl}&orderId=${orderId}&orderInfo=${orderInfoText}&partnerCode=${partnerCode}&redirectUrl=${redirectUrl}&requestId=${requestId}&requestType=${requestType}`;

      const signature = crypto
        .createHmac("sha256", secretKey)
        .update(rawSignature)
        .digest("hex");

      const requestBody = {
        partnerCode, partnerName: "Test Portfolio", storeId: "MomoTestStore",
        requestId, amount, orderId, orderInfo: orderInfoText,
        redirectUrl, ipnUrl, lang: "vi", requestType,
        autoCapture: true,
        extraData: extraData, // Gửi gói hàng đi
        signature: signature,
      };

      const response = await axios.post(apiEndpoint, requestBody);
      
      if(response.data.resultCode === 0) {
        return res.redirect(response.data.payUrl);
      } else {
        console.log("Lỗi tạo link MoMo:", response.data.message);
        return res.redirect("/checkout/failure"); 
      }
    } 
    
    // --- TRƯỜNG HỢP 2: THANH TOÁN COD (Lưu luôn) ---
    else {
      // Tạo danh sách sản phẩm từ giỏ hàng
      const products = [];
      for(let item of cart.products) {
        const product = await Product.findOne({_id: item.productId})
        const objectProduct = {
          productId: item.productId,
          title: item.name || product.title,
          image: item.image || product.thumbnail,
          price: product.price,
          discountPercentage: product.discountPercentage,
          salePrice: product.salePrice,
          quantity: item.quantity,
          size: item.size,
          subtotal: item.subtotal || (product.salePrice * item.quantity),
        }
        products.push(objectProduct)
      }

      const orderInfo = {
        code: orderCode,
        userInfo: userInfo,
        products: products,
        note: note,
        paymentMethod: "COD",
        voucherCode: voucherCode,
        totalPrice: cart.totalPrice,
        status: "pending",
        paymentStatus: "unpaid"
      }

      const order = new Orders(orderInfo);
      await order.save();

      // Xóa giỏ hàng
      await Cart.updateOne({ _id: cartId }, { products: [], totalQuantity: 0, totalPrice: 0 });
      
      res.redirect(`/checkout/${order.id}`)
    }

  } catch (error) {
    console.log(error);
    res.redirect("/checkout/failure");
  }
}

// [GET] /checkout/momo/callback
module.exports.momoCallback = async (req, res) => {
  try {
    const { resultCode, extraData } = req.query; // Lấy extraData MoMo trả về

    // resultCode = 0 nghĩa là Giao dịch thành công
    if (resultCode == 0) {
      
      // 1. GIẢI MÃ EXTRA DATA ĐỂ LẤY LẠI THÔNG TIN KHÁCH HÀNG
      if(!extraData) return res.redirect("/checkout/failure");
      
      const decodedExtraData = JSON.parse(Buffer.from(extraData, 'base64').toString('utf8'));
      const { userInfo, note, voucherCode, orderCode } = decodedExtraData;

      // 2. Lấy lại giỏ hàng (Vì callback chạy trên trình duyệt người dùng nên vẫn còn Cookie)
      const cartId = req.cookies.cartId;
      const cart = await Cart.findOne({_id: cartId});
      
      if(!cart) return res.redirect("/checkout/failure");

      // 3. Tái tạo danh sách sản phẩm
      const products = [];
      for(let item of cart.products) {
        const product = await Product.findOne({_id: item.productId})
        // Kiểm tra phòng hờ sản phẩm bị xóa
        if(product) {
            const objectProduct = {
            productId: item.productId,
            title: product.title, 
            image: product.thumbnail,
            price: product.price,
            discountPercentage: product.discountPercentage,
            salePrice: product.salePrice, // Tính toán lại giá cho chắc
            quantity: item.quantity,
            size: item.size,
            subtotal: (product.price * (100 - product.discountPercentage)/100) * item.quantity,
            }
            products.push(objectProduct)
        }
      }

      // 4. BÂY GIỜ MỚI LƯU ĐƠN HÀNG VÀO DB
      const newOrder = new Orders({
        code: orderCode, // Dùng lại mã đã tạo lúc trước
        userInfo: userInfo,
        products: products,
        note: note,
        paymentMethod: "MOMO",
        voucherCode: voucherCode,
        totalPrice: cart.totalPrice, // Lấy lại tổng tiền từ giỏ hàng hiện tại
        status: "confirmed", // Đã thanh toán thì confirm luôn
        paymentStatus: "paid"
      });

      await newOrder.save();

      // 5. Xóa giỏ hàng
      await Cart.updateOne({ _id: cartId }, { 
        products: [],
        totalQuantity: 0,
        totalPrice: 0 
      });

      // 6. Chuyển hướng về trang thành công
      res.redirect(`/checkout/${newOrder._id}`);

    } else {
      // Nếu có dữ liệu form (đã đóng gói trong extraData)
      if(extraData) {
        // 1. Lưu cái túi dữ liệu này vào Cookie
        // Để nó sống khoảng 10 phút (đủ thời gian khách đọc lỗi ở trang failure)
        res.cookie("data_fill_form", extraData, { maxAge: 10 * 60 * 1000 }); 
      }

      // 2. Chuyển hướng đến trang báo lỗi (Failure)
      res.redirect("/checkout/failure");
    }
  } catch (error) {
    console.log("Lỗi Callback:", error);
    res.redirect("/checkout/failure");
  }
};