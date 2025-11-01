package hoangtugio.org.promptexam.Model;


import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;
import org.springframework.data.mongodb.core.mapping.Field;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Document(collection = "subject")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class Subject {


    @Id
    private int id;

    private String code;
    @Field
    private String name;

    public Subject(String code, String name) {
        this.code = code;
        this.name = name;
    }
}
