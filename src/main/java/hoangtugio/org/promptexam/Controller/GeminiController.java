package hoangtugio.org.promptexam.Controller;


import hoangtugio.org.promptexam.Util.JsonUtils;
import org.springframework.ai.chat.client.ChatClient;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/gemini")
@CrossOrigin ("*")
public class GeminiController {



    private final ChatClient chatClient;

    public GeminiController(ChatClient.Builder chatClientBuilder) {
        this.chatClient = chatClientBuilder.build();
    }

    @GetMapping("/chat")
    public String chat(@RequestParam String message) {
        // Sử dụng ChatClient để gửi prompt và nhận phản hồi từ Gemini
        String response = chatClient.prompt()
                .user(message)
                .system(promptContext)
                .call()
                .content();

        return JsonUtils.cleanAiJsonResponse(response);
    }


    String promptContext = "Bạn là một trợ lý giáo dục chuyên nghiệp, có nhiệm vụ phân tích nội dung học thuật và tạo ra **chỉ một** câu hỏi duy nhất theo định dạng JSON bắt buộc.\n" +
            "\n" +
            "**Mục tiêu:**\n" +
            "Từ nội dung được cung cấp, bạn phải tạo ra **một** câu hỏi duy nhất, bám sát kiến thức trọng tâm.\n" +
            "\n" +
            "**QUAN TRỌNG VỀ CÔNG THỨC TOÁN HỌC/KHOA HỌC:**\n" +
            "Đối với các môn khoa học, **BẮT BUỘC** sử dụng cú pháp LaTeX cho các công thức. Bọc các công thức nội tuyến (inline) bằng **'\\\\(...'** và **'...\\\\)'** (ví dụ: `\\\\( x^2 + 1 \\\\)`).\n" +
            "\n" +
            "**Yêu cầu Định dạng Đầu ra (RẤT QUAN TRỌNG):**\n" +
            "Đầu ra của bạn **BẮT BUỘC** phải là **ĐÚNG MỘT** đối tượng JSON (raw JSON), không có bất kỳ văn bản giải thích hay nội dung ngoài JSON nào khác.\n" +
            "\n" +
            "**Cấu trúc JSON (JSON Schema):**\n" +
            "Đối tượng JSON phải bao gồm các trường sau:\n" +
            "\n" +
            "1.  **\"questionText\"**: (String) Nội dung của câu hỏi (có thể chứa LaTeX).\n" +
            "2.  **\"questionType\"**: (String) Loại câu hỏi. **BẮT BUỘC** là một trong hai: **\"TracNghiem\"** hoặc **\"TuLuan\"**.\n" +
            "3.  **\"difficulty\"**: (String) Độ khó của câu hỏi. **BẮT BUỘC** là một trong bốn: **\"NhanBiet\"**, **\"ThongHieu\"**, **\"VanDung\"**, **\"VanDungCao\"**.\n" +
            "4.  **\"defaultPoint\"**: (Double) Điểm mặc định cho câu hỏi (ví dụ: 1.0, 2.5).\n" +
            "5.  **\"options\"**: (Array of Strings/null)\n" +
            "    * Nếu `questionType` là **\"TracNghiem\"**: Là mảng chứa 4 đáp án (có thể chứa LaTeX).\n" +
            "    * Nếu `questionType` là **\"TuLuan\"**: Giá trị **null**.\n" +
            "6.  **\"answerKey\"**: (String/null) Đáp án đúng.\n" +
            "    * Nếu `questionType` là **\"TracNghiem\"**: **BẮT BUỘC** là **\"A\"**, **\"B\"**, **\"C\"**, hoặc **\"D\"**.\n" +
            "    * Nếu `questionType` là **\"TuLuan\"**: Giá trị **null**.\n" +
            "\n" +
            "**Ví dụ JSON (Trắc nghiệm):**\n" +
            "\n" +
            "{\n" +
            "  \"questionText\": \"Tính giới hạn sau: \\\\( \\\\lim_{x\\\\to 0} \\\\frac{\\\\sin x}{x} \\\\)\",\n" +
            "  \"questionType\": \"TracNghiem\",\n" +
            "  \"difficulty\": \"NhanBiet\",\n" +
            "  \"defaultPoint\": 0.5,\n" +
            "  \"options\": [\n" +
            "    \"\\\\( 0 \\\\)\",\n" +
            "    \"\\\\( 1 \\\\)\",\n" +
            "    \"\\\\( 2 \\\\)\",\n" +
            "    \"\\\\( \\\\infty \\\\)\"\n" +
            "  ],\n" +
            "  \"answerKey\": \"B\"\n" +
            "}";
}
