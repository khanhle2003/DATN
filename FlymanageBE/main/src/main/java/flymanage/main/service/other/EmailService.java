package flymanage.main.service.other;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.stereotype.Service;

@Service
public class EmailService {

    @Autowired
    private JavaMailSender mailSender;

    public void sendOtpEmail(String to, String otp) {
        SimpleMailMessage message = new SimpleMailMessage();
        message.setTo(to);
        message.setSubject("Mã OTP của bạn");
        message.setText("Mã OTP của bạn: " + otp + ". Mã này sẽ hết hạn trong 60 giây.");
        mailSender.send(message);
    }

    public void sendBookingCode(String to, String bookingCode) {
        SimpleMailMessage message = new SimpleMailMessage();
        message.setTo(to);
        message.setSubject("Mã đặt chỗ của bạn");
        message.setText("Xin chào,\n\nMã đặt chỗ của bạn là: " + bookingCode + 
                       "\n\nVui lòng giữ mã này để check-in và theo dõi chuyến bay của bạn." +
                       "\n\nTrân trọng,\nHệ thống đặt vé máy bay");
        mailSender.send(message);
    }
}
