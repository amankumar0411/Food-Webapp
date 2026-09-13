package com.aman;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import java.io.File;
import java.nio.file.Files;
import java.util.List;

@SpringBootApplication
public class FoodAppApplication {

	public static void main(String[] args) {
		loadDotEnv();
		SpringApplication.run(FoodAppApplication.class, args);
	}

	private static void loadDotEnv() {
		File envFile = new File(".env");
		if (!envFile.exists()) {
			envFile = new File("backend/FoodApp/.env");
		}
		if (envFile.exists()) {
			try {
				List<String> lines = Files.readAllLines(envFile.toPath());
				for (String line : lines) {
					line = line.trim();
					if (line.isEmpty() || line.startsWith("#") || !line.contains("=")) {
						continue;
					}
					int eqIdx = line.indexOf('=');
					String key = line.substring(0, eqIdx).trim();
					String value = line.substring(eqIdx + 1).trim();
					if (System.getProperty(key) == null && System.getenv(key) == null) {
						System.setProperty(key, value);
					}
				}
				System.out.println(">>> Loaded local environment variables from " + envFile.getAbsolutePath());
			} catch (Exception e) {
				System.err.println("Notice: Could not load .env file: " + e.getMessage());
			}
		}
	}

}
