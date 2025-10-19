package hoangtugio.org.promptexam.Util;

import org.springframework.stereotype.Component;

@Component
public class JsonUtils {
    private static final String JSON_START_TAG = "```json";
    private static final String JSON_END_TAG = "```";

    public static String cleanAiJsonResponse(String rawAiResponse) {
        if (rawAiResponse == null) {
            return null;
        }

        String cleaned = rawAiResponse.trim();

        // 1. Loại bỏ thẻ bắt đầu "```json"
        if (cleaned.startsWith(JSON_START_TAG)) {
            cleaned = cleaned.substring(JSON_START_TAG.length()).trim();
        }

        // 2. Loại bỏ thẻ kết thúc "```"
        if (cleaned.endsWith(JSON_END_TAG)) {
            int endIndex = cleaned.lastIndexOf(JSON_END_TAG);
            if (endIndex > 0) {
                cleaned = cleaned.substring(0, endIndex).trim();
            }
        }

        return cleaned;
    }
}