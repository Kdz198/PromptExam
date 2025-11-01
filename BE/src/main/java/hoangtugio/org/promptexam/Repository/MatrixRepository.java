package hoangtugio.org.promptexam.Repository;

import hoangtugio.org.promptexam.Model.Matrix;
import org.springframework.data.mongodb.repository.MongoRepository;

public interface MatrixRepository extends MongoRepository<Matrix, Integer> {
}
