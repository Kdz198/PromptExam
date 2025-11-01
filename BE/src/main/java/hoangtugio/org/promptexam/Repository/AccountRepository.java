package hoangtugio.org.promptexam.Repository;

import hoangtugio.org.promptexam.Model.Account;
import org.springframework.data.mongodb.repository.MongoRepository;


public interface AccountRepository extends MongoRepository<Account, String> {

}
