package hoangtugio.org.promptexam.Model;

import org.springframework.data.annotation.CreatedDate;
import org.springframework.data.annotation.LastModifiedDate;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.DBRef;
import org.springframework.data.mongodb.core.mapping.Document;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;
import java.util.List;

@Document(collection = "exam")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class Exam {

    @Id
    private int id; // exam_id (PK)
    private String examName; // Tên đề thi
    private String description; // Mô tả đề thi
    int subjectId; // Môn học
    int grade; // Lớp học
    @DBRef
    Matrix matrix; // Ma trận đề thi


    @DBRef
    List<Question> questions; // Danh sách câu hỏi trong đề thi

    private int durationMinutes; // Thời gian làm bài (Phút)

    private Double totalMarks; // Tổng điểm đề thi

    @CreatedDate
    private LocalDateTime createdAt;

    @LastModifiedDate
    private LocalDateTime updatedAt;
}