package com.library.service;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.*;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;

@Service
public class EmailService {

    @Value("${brevo.api.key}")
    private String apiKey;

    @Value("${brevo.sender.email}")
    private String senderEmail;

    @Value("${brevo.sender.name}")
    private String senderName;

    private final RestTemplate restTemplate = new RestTemplate();

    public void sendEmail(String toEmail, String subject, String body) {

        String url = "https://api.brevo.com/v3/smtp/email";

        HttpHeaders headers = new HttpHeaders();
        headers.setContentType(MediaType.APPLICATION_JSON);
        headers.set("api-key", apiKey);

        String payload = """
        {
          "sender": {
            "name": "%s",
            "email": "%s"
          },
          "to": [
            { "email": "%s" }
          ],
          "subject": "%s",
          "htmlContent": "%s"
        }
        """.formatted(
                senderName,
                senderEmail,
                toEmail,
                subject,
                body.replace("\n", "<br>")
        );

        restTemplate.postForEntity(url, new HttpEntity<>(payload, headers), String.class);

        System.out.println("✅ Mail sent successfully to " + toEmail);
    }
}
