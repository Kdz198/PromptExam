package hoangtugio.org.promptexam.Model;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.hibernate.annotations.CreationTimestamp;
import org.hibernate.annotations.UpdateTimestamp;

import java.time.LocalDateTime;

@Entity
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Lesson {
    @Id
            @GeneratedValue (strategy = GenerationType.IDENTITY)
    int id;
    @ManyToOne
    @JoinColumn(name = "subject_id")
    Subject subject;
    int grade;
    String name;
    @Column( columnDefinition = "TEXT")
    private String learningObjectivesJson;
    @CreationTimestamp
    LocalDateTime createdAt;
    @UpdateTimestamp
    LocalDateTime updatedAt;


}
