package flymanage.main.controller.other;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import flymanage.main.service.flight.PersonService;
import flymanage.main.service.other.EmailService;
import flymanage.main.service.other.OtpService;
import flymanage.main.service.other.OtpStorageService;

import java.util.Map;
import java.util.Random;

@RestController
@RequestMapping("/api/auth")
public class sendOtpController {

    @Autowired
    private OtpService otpService;

    @Autowired
    private EmailService emailService;

    @Autowired
    private OtpStorageService otpStorageService;

    @Autowired
    private PersonService personService;

    @PostMapping("/send-otp")
    public ResponseEntity<String> sendOtp(@RequestBody String email) {
        try {
            String otp = otpService.generateOtp();
            otpStorageService.storeOtp(email, otp);
            emailService.sendOtpEmail(email, otp);
            return ResponseEntity.ok("OTP sent to your email.");
        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                               .body("Failed to send OTP: " + e.getMessage());
        }
    }

    @PostMapping("/verify-otp")
    public ResponseEntity<String> verifyOtp(@RequestBody Map<String, String> request) {
        String email = request.get("email");
        String otp = request.get("otp");
        
        boolean isValid = otpStorageService.verifyOtp(email, otp);
        if (isValid) {
            return ResponseEntity.ok("OTP verified successfully.");
        } else {
            return ResponseEntity.status(400).body("Invalid or expired OTP.");
        }
    }

    @PostMapping("/forgot-password")
    public ResponseEntity<String> forgotPassword(@RequestBody String email) {
        try {
            email = email.replace("\"", "");
            
            if (!personService.existsByEmail(email)) {
                return ResponseEntity.status(HttpStatus.NOT_FOUND)
                                   .body("Email không tồn tại trong hệ thống.");
            }
            
            String otp = otpService.generateOtp();
            otpStorageService.storeOtp(email, otp);
            emailService.sendOtpEmail(email, otp);
            return ResponseEntity.ok("Mã OTP đã được gửi đến email của bạn.");
        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                               .body("Lỗi khi gửi OTP: " + e.getMessage());
        }
    }

    @PostMapping("/reset-password")
    public ResponseEntity<String> resetPassword(@RequestBody Map<String, String> request) {
        String email = request.get("email");
        String otp = request.get("otp");
        
        boolean isValid = otpStorageService.verifyOtp(email, otp);
        if (isValid) {
            try {
                String newPassword = generateRandomPassword();
                
                personService.updatePassword(email, newPassword);
                
                emailService.sendNewPasswordEmail(email, newPassword);
                
                return ResponseEntity.ok("Mật khẩu mới đã được gửi đến email của bạn.");
            } catch (Exception e) {
                e.printStackTrace();
                return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                                   .body("Lỗi khi đặt lại mật khẩu: " + e.getMessage());
            }
        } else {
            return ResponseEntity.status(400).body("Mã OTP không hợp lệ hoặc đã hết hạn.");
        }
    }

    private String generateRandomPassword() {
        String chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
        StringBuilder sb = new StringBuilder();
        Random random = new Random();
        for (int i = 0; i < 6; i++) {
            int index = random.nextInt(chars.length());
            sb.append(chars.charAt(index));
        }
        return sb.toString();
    }
}