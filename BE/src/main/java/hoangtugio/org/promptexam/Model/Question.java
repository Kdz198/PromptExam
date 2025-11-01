package hoangtugio.org.promptexam.Model;

import org.springframework.data.annotation.CreatedDate;
import org.springframework.data.annotation.Id;
import org.springframework.data.annotation.LastModifiedDate;
import org.springframework.data.mongodb.core.mapping.DBRef;
import org.springframework.data.mongodb.core.mapping.Document;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Document(collection = "question")
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Question {

    @Id
    private int id;

    @DBRef
    private Lesson lesson;

    // Nội dung câu hỏi (có thể chứa Latex/Markdown)
    private String questionText;

    // Các lựa chọn (options) cho câu hỏi trắc nghiệm, lưu dưới dạng JSON
    // Ví dụ: [{"a": "Đáp án A"}, {"b": "Đáp án B"}]
    private String optionsJson;

    private String answerKey;
    // Ví dụ: TracNghiem, TuLuan
    private String questionType;
    // Ví dụ: NhanBiet, ThongHieu 05, VanDung 075, VanDungCao 1
    private String difficulty;
    private Double defaultPoint = 1.0;
    @CreatedDate
    private LocalDateTime createdAt;
    @LastModifiedDate
    private LocalDateTime updatedAt;
}