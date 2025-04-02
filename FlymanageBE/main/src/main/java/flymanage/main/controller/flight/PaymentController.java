package flymanage.main.controller.flight;

import java.util.List;
import java.util.Map;
import java.text.SimpleDateFormat;
import java.util.Calendar;
import java.util.Date;
import java.util.stream.Collectors;

import java.util.TreeMap;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import flymanage.main.controller.dto.flight.*;
import flymanage.main.model.flight.Payment;
import flymanage.main.service.flight.PaymentService;
import flymanage.main.util.VNPayUtil;
import jakarta.servlet.http.HttpServletRequest;

@RestController
@RequestMapping("/api/payments")
public class PaymentController {
    
    private final PaymentService paymentService;

    @Autowired
    public PaymentController(PaymentService paymentService) {
        this.paymentService = paymentService;
    }

    @GetMapping("/vnpay-payment")
    public ResponseEntity<String> createVNPayPayment(
            @RequestParam double amount,
            @RequestParam List<Integer> bookingIds,
            @RequestParam(required = false) Long timestamp,
            HttpServletRequest request) {
        try {

            if (bookingIds == null || bookingIds.isEmpty() || bookingIds.contains(null)) {
                return ResponseEntity.badRequest().body("Invalid booking IDs");
            }
            
            String vnpUrl = "https://sandbox.vnpayment.vn/paymentv2/vpcpay.html";
            String vnpTmnCode = "DY22LRAP";
            String vnpHashSecret = "HKHD4R8TTD9ZM5GDSD9WVP12WLXNNVTD";

            String vnp_CreateDate = new SimpleDateFormat("yyyyMMddHHmmss").format(new Date());
            Calendar calendar = Calendar.getInstance();
            calendar.add(Calendar.MINUTE, 15);
            String vnp_ExpireDate = new SimpleDateFormat("yyyyMMddHHmmss").format(calendar.getTime());
    
            Payment payment = new Payment();
            payment.generateTransactionCode();
            String vnp_TxnRef = payment.getTransactionCode();
            
            if (timestamp != null) {
                vnp_TxnRef = vnp_TxnRef + "_" + timestamp;
            }

            Map<String, String> vnpParams = new TreeMap<>();
            vnpParams.put("vnp_Amount", String.valueOf((int) (amount * 100)));
            vnpParams.put("vnp_Command", "pay");
            vnpParams.put("vnp_CreateDate", vnp_CreateDate);
            vnpParams.put("vnp_CurrCode", "VND");
            vnpParams.put("vnp_ExpireDate", vnp_ExpireDate);
            vnpParams.put("vnp_IpAddr", VNPayUtil.getIpAddress(request));
            vnpParams.put("vnp_Locale", "vn");
            
            String bookingInfo = String.join(",", bookingIds.stream()
                    .map(String::valueOf)
                    .collect(Collectors.toList()));
            vnpParams.put("vnp_OrderInfo", "Thanh toan cac don hang: " + bookingInfo);
            
            vnpParams.put("vnp_OrderType", "billpayment");
            vnpParams.put("vnp_ReturnUrl", "http://localhost:4200/client/thanh-toan");
            vnpParams.put("vnp_TmnCode", vnpTmnCode);
            vnpParams.put("vnp_TxnRef", vnp_TxnRef);
            vnpParams.put("vnp_Version", "2.1.0");

            String queryUrl = VNPayUtil.getPaymentURL(vnpParams, true);
            String vnpSecureHash = VNPayUtil.hmacSHA512(vnpHashSecret, queryUrl);
            String paymentUrl = vnpUrl + "?" + queryUrl + "&vnp_SecureHash=" + vnpSecureHash;

            return ResponseEntity.ok(paymentUrl);
        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.badRequest().body("Error creating payment URL");
        }
    }

    @PostMapping
    public ResponseEntity<PaymentDTO> createPayment(@RequestBody PaymentCreateDTO dto) {
        return ResponseEntity.ok(paymentService.createPayment(dto));
    }

    @GetMapping
    public ResponseEntity<List<PaymentDTO>> getAllPayments() {
        return ResponseEntity.ok(paymentService.getAllPayments());
    }

    @GetMapping("/{id}")
    public ResponseEntity<PaymentDTO> getPayment(@PathVariable Integer id) {
        return ResponseEntity.ok(paymentService.getPayment(id));
    }

    @PutMapping("/{id}")
    public ResponseEntity<PaymentDTO> updatePayment(@PathVariable Integer id, 
                                                  @RequestBody PaymentCreateDTO dto) {
        return ResponseEntity.ok(paymentService.updatePayment(id, dto));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deletePayment(@PathVariable Integer id) {
        paymentService.deletePayment(id);
        return ResponseEntity.ok().build();
    }

    @PostMapping("/update-booking-status")
    public ResponseEntity<?> updateBookingStatus(@RequestBody Map<String, Object> request) {
        try {
            @SuppressWarnings("unchecked")
            List<Integer> bookingIds = (List<Integer>) request.get("bookingIds");
            Integer status = (Integer) request.get("status");
            
      
            if (bookingIds == null || bookingIds.isEmpty() || bookingIds.contains(null)) {
                return ResponseEntity.badRequest().body(Map.of("success", false, "message", "Danh sách ID đơn hàng không hợp lệ"));
            }
            
      
            if (status == null) {
                return ResponseEntity.badRequest().body(Map.of("success", false, "message", "Trạng thái không hợp lệ"));
            }

            paymentService.updateBookingStatus(bookingIds, status);
            
            return ResponseEntity.ok(Map.of("success", true, "message", "Cập nhật trạng thái đơn hàng thành công"));
        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.badRequest().body(Map.of("success", false, "message", "Lỗi khi cập nhật trạng thái đơn hàng: " + e.getMessage()));
        }
    }
}
