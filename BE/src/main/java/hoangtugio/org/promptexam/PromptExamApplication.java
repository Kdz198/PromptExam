package hoangtugio.org.promptexam;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.data.mongodb.config.EnableMongoAuditing;

@SpringBootApplication
@EnableMongoAuditing
public class PromptExamApplication {

	public static void main(String[] args) {
		SpringApplication.run(PromptExamApplication.class, args);
	}

}
