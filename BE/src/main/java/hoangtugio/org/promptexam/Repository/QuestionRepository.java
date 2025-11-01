package hoangtugio.org.promptexam.Repository;

import hoangtugio.org.promptexam.Model.Question;

import java.util.List;

public interface QuestionRepository extends FlushableMongoRepository<Question, Integer> {
    List<Question> findByLessonId(int lessonId);
}
