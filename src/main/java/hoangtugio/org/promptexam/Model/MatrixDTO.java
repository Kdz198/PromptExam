package hoangtugio.org.promptexam.Model;


import jakarta.persistence.Column;
import lombok.Data;

import java.util.Map;

@Data
public class MatrixDTO {

    private String matrixName; // Tên Ma trận (VD: Ma trận chuẩn 45 phút)
    int totalQuestions; // Tổng số câu hỏi
    int subjectId; // Môn học áp dụng ma trận
    int grade ; // Lớp áp dụng ma trận
    private String description; // Mô tả Ma trận
    Map<String, Integer> difficultyQuestionCountMap; // Bản đồ độ khó và số câu hỏi yêu cầu
}
