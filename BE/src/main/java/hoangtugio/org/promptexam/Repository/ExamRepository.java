package hoangtugio.org.promptexam.Repository;

import hoangtugio.org.promptexam.Model.Exam;
import org.springframework.data.jpa.repository.JpaRepository;

public interface ExamRepository extends JpaRepository<Exam, Integer> {
}
