package flymanage.main;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.web.bind.annotation.RestController;

@RestController
@SpringBootApplication(scanBasePackages = "flymanage.main")
public class MainApplication {
	public static void main(String[] args) {
		SpringApplication.run(MainApplication.class, args);
		
	}

}
