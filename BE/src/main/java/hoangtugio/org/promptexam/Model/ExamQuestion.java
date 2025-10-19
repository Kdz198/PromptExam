package hoangtugio.org.promptexam.Model;


import jakarta.persistence.Entity;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.NoArgsConstructor;

@Entity
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class ExamQuestion {

    @Id
    int id;
    @ManyToOne
    @JoinColumn(name = "exam_id")
    Exam exam;
    @ManyToOne
    @JoinColumn(name = "question_id")
    Question question;


}
