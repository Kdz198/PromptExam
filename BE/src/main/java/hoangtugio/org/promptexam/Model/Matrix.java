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
@Table(name = "matrix")
public class Matrix {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private int id; // matrix_id (PK)

    @Column(name = "matrix_name", nullable = false, length = 255)
    private String matrixName; // Tên Ma trận (VD: Ma trận chuẩn 45 phút)

    @Column(name = "description", columnDefinition = "TEXT")
    private String description; // Mô tả Ma trận

    int totalQuestions; // Tổng số câu hỏi

    int subjectId; // Môn học áp dụng ma trận
    int grade; // Lớp áp dụng ma trận
    @CreationTimestamp
    private LocalDateTime createdAt;
    @UpdateTimestamp
    private LocalDateTime updatedAt;
}