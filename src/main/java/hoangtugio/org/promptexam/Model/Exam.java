package hoangtugio.org.promptexam.Model;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.hibernate.annotations.CreationTimestamp;
import org.hibernate.annotations.UpdateTimestamp;
import java.time.LocalDateTime;

@Entity
@Data
@NoArgsConstructor
@AllArgsConstructor
public class Exam {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id; // exam_id (PK)

    @Column(name = "exam_name", nullable = false, length = 255)
    private String examName; // Tên đề thi

    @Column(name = "description", columnDefinition = "TEXT")
    private String description; // Mô tả đề thi

    @ManyToOne
    @JoinColumn(name = "matrix_id")
    Matrix matrix; // Ma trận đề thi

    @Column(name = "duration_minutes")
    private Integer durationMinutes; // Thời gian làm bài (Phút)

    @Column(name = "total_marks")
    private Double totalMarks; // Tổng điểm đề thi

    @CreationTimestamp
    private LocalDateTime createdAt;

    @UpdateTimestamp
    private LocalDateTime updatedAt;
}