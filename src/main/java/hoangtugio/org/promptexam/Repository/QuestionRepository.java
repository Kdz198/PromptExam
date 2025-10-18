package hoangtugio.org.promptexam.Repository;

import hoangtugio.org.promptexam.Model.Question;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface QuestionRepository extends JpaRepository<Question, Integer> {
    List<Question> findByLessonId(int lessonId);
}
