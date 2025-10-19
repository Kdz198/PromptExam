package hoangtugio.org.promptexam.Model;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.hibernate.annotations.CreationTimestamp;
import org.hibernate.annotations.UpdateTimestamp;
import java.time.LocalDateTime;
import java.util.List;

@Entity
@Data
@NoArgsConstructor
@AllArgsConstructor
public class Exam {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private int id; // exam_id (PK)
    private String examName; // Tên đề thi
    private String description; // Mô tả đề thi
    int subjectId; // Môn học
    int grade; // Lớp học
    @ManyToOne
    @JoinColumn(name = "matrix_id")
    Matrix matrix; // Ma trận đề thi


    @ManyToMany(cascade = {CascadeType.MERGE})
    @JoinTable(
            name = "exam_question", // Tên bảng trung gian
            joinColumns = @JoinColumn(name = "exam_id"), // Khóa ngoại của Exam
            inverseJoinColumns = @JoinColumn(name = "question_id") // Khóa ngoại của Question
    )
    List<Question> questions; // Danh sách câu hỏi trong đề thi

    private int durationMinutes; // Thời gian làm bài (Phút)

    private Double totalMarks; // Tổng điểm đề thi

    @CreationTimestamp
    private LocalDateTime createdAt;

    @UpdateTimestamp
    private LocalDateTime updatedAt;
}