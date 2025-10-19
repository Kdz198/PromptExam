package hoangtugio.org.promptexam.Repository;

import hoangtugio.org.promptexam.Model.Lesson;
import hoangtugio.org.promptexam.Model.Subject;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

public interface LessonRepository extends JpaRepository<Lesson, Integer> {
    List<Lesson> findBySubjectAndGradeIn(Subject subject, List<Integer> grades);
    List<Lesson> findByGradeAndSubject(int grade, Subject subject);
}
