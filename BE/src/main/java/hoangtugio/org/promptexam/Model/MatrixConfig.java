package hoangtugio.org.promptexam.Model;

import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.DBRef;
import org.springframework.data.mongodb.core.mapping.Document;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Document(collection = "matrix_config")
@Data
@AllArgsConstructor
@NoArgsConstructor
public class MatrixConfig {

    @Id
    int id;
    @DBRef
    Matrix matrix;
    String difficulty;
    int require_count;



}
