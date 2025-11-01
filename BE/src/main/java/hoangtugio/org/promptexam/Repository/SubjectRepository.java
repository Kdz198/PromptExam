package hoangtugio.org.promptexam.Repository;

import hoangtugio.org.promptexam.Model.Subject;

import java.util.Optional;

public interface SubjectRepository  extends FlushableMongoRepository<Subject, Integer> {
    Optional<Subject> findByCode(String code);
}
