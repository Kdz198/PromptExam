package hoangtugio.org.promptexam.Repository;

import hoangtugio.org.promptexam.Model.Subject;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface SubjectRepository  extends JpaRepository<Subject, Integer> {
    Optional<Subject> findByCode(String code);
}
