package hoangtugio.org.promptexam.Model;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.hibernate.annotations.CreationTimestamp;
import org.hibernate.annotations.UpdateTimestamp;

import java.time.LocalDateTime;

@Entity
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Question {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private int id;

    @ManyToOne
    @JoinColumn(name = "lesson_id", nullable = false)
    private Lesson lesson;

    // Nội dung câu hỏi (có thể chứa Latex/Markdown)
    @Column(name = "question_text", columnDefinition = "TEXT", nullable = false)
    private String questionText;

    // Các lựa chọn (options) cho câu hỏi trắc nghiệm, lưu dưới dạng JSON
    // Ví dụ: [{"a": "Đáp án A"}, {"b": "Đáp án B"}]
    @Column(name = "options_json", columnDefinition = "TEXT")
    private String optionsJson;

    @Column(name = "answer_key", columnDefinition = "TEXT", nullable = false)
    private String answerKey;
    // Ví dụ: TracNghiem, TuLuan
    private String questionType;
    // Ví dụ: NhanBiet, ThongHieu 05, VanDung 075, VanDungCao 1
    private String difficulty;
    private Double defaultPoint = 1.0;
    @CreationTimestamp
    private LocalDateTime createdAt;
    @UpdateTimestamp
    private LocalDateTime updatedAt;
}