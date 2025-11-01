package hoangtugio.org.promptexam.Repository;

import hoangtugio.org.promptexam.Model.MatrixConfig;
import org.springframework.data.mongodb.repository.MongoRepository;

import java.util.List;

public interface MatrixConfigRepository  extends MongoRepository<MatrixConfig, Integer> {
    List<MatrixConfig> findByMatrixId(int id);

    void deleteByMatrixId(int id);
}
