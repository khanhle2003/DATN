package flymanage.main.service.other;

import java.security.SecureRandom;
import org.springframework.stereotype.Service;
@Service
public class OtpService {
    private static final int OTP_LENGTH = 6;
    private SecureRandom random = new SecureRandom();

    public String generateOtp() {
        int otp = 100000 + random.nextInt(900000); 
        return String.valueOf(otp);
    }
}