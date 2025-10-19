package hoangtugio.org.promptexam.Model;


import lombok.Data;

import java.util.List;

@Data
public class ExamDTO {

    private int id;
    private String examName;
    private String description;

    int matrixId;

    private int durationMinutes;

    private Double totalMarks;

    List<Integer> questionIds;
}
