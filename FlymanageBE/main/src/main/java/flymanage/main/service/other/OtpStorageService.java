package flymanage.main.service.other;
import java.time.LocalDateTime;
import java.util.Map;
import java.util.concurrent.ConcurrentHashMap;

import org.springframework.stereotype.Service;

@Service
public class OtpStorageService {
    private static final Map<String, OtpDetails> otpStore = new ConcurrentHashMap<>();

    private String cleanEmail(String email) {
        return email.replace("\"", "")
                   .replace("\n", "")
                   .trim();
    }

    public void storeOtp(String email, String otp) {
        email = cleanEmail(email);
   
        LocalDateTime expiryTime = LocalDateTime.now().plusMinutes(1);
        otpStore.put(email, new OtpDetails(otp, expiryTime));
}

    public boolean verifyOtp(String email, String otp) {
        email = cleanEmail(email);
        System.out.println("Verifying OTP for email: [" + email + "]");
        System.out.println("Input OTP: " + otp);
        System.out.println("Current store content: " + otpStore);
        
        OtpDetails details = otpStore.get(email);
      
        if (details != null && details.getOtp().equals(otp) && LocalDateTime.now().isBefore(details.getExpiryTime())) {
            otpStore.remove(email);
            return true;
        }
        return false;
    }

    private static class OtpDetails {
        private String otp;
        private LocalDateTime expiryTime;

        public OtpDetails(String otp, LocalDateTime expiryTime) {
            this.otp = otp;
            this.expiryTime = expiryTime;
        }

        public String getOtp() {
            return otp;
        }

        public LocalDateTime getExpiryTime() {
            return expiryTime;
        }
    }
}