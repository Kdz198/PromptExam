package hoangtugio.org.promptexam.Repository;

import hoangtugio.org.promptexam.Model.MatrixConfig;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface MatrixConfigRepository  extends JpaRepository<MatrixConfig, Integer> {
    List<MatrixConfig> findByMatrixId(int id);

    void deleteByMatrixId(int id);
}
