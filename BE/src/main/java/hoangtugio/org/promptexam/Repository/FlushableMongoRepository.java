package hoangtugio.org.promptexam.Repository;

import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.data.repository.NoRepositoryBean;

@NoRepositoryBean
public interface FlushableMongoRepository<T, ID> extends MongoRepository<T, ID> {
    default void flush() {
        // MongoRepository doesn't support flush; provide no-op to keep compatibility with JPA-based codepaths
    }
}
