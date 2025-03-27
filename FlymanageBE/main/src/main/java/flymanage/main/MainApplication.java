package flymanage.main;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@SpringBootApplication(scanBasePackages = "flymanage.main")
public class MainApplication {
	@GetMapping("/hello")
	public String hello(){
		return "heelo";
	}
	public static void main(String[] args) {
		SpringApplication.run(MainApplication.class, args);
		
	}

}
