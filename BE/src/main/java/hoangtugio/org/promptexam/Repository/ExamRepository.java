package hoangtugio.org.promptexam.Repository;

import hoangtugio.org.promptexam.Model.Exam;
import org.springframework.data.mongodb.repository.MongoRepository;

public interface ExamRepository extends MongoRepository<Exam, Integer> {
}
