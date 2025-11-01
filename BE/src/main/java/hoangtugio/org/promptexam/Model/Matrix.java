package hoangtugio.org.promptexam.Model;

import org.springframework.data.annotation.CreatedDate;
import org.springframework.data.annotation.Id;
import org.springframework.data.annotation.LastModifiedDate;
import org.springframework.data.mongodb.core.mapping.Document;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Document(collection = "matrix")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class Matrix {

    @Id
    private int id; // matrix_id (PK)

    private String matrixName; // Tên Ma trận (VD: Ma trận chuẩn 45 phút)

    private String description; // Mô tả Ma trận

    int totalQuestions; // Tổng số câu hỏi

    int subjectId; // Môn học áp dụng ma trận
    int grade; // Lớp áp dụng ma trận
    @CreatedDate
    private LocalDateTime createdAt;
    @LastModifiedDate
    private LocalDateTime updatedAt;
}