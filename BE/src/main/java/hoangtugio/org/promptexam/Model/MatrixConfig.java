package hoangtugio.org.promptexam.Model;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Entity
@Data
@AllArgsConstructor
@NoArgsConstructor
public class MatrixConfig {

    @Id
    @GeneratedValue (strategy = GenerationType.IDENTITY)
    int id;
    @ManyToOne
    @JoinColumn(name = "matrix_id")
    Matrix matrix;
    String difficulty;
    int require_count;
    


}
