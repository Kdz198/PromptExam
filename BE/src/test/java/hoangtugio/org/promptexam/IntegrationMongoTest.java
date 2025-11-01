package hoangtugio.org.promptexam;

import hoangtugio.org.promptexam.Model.Lesson;
import hoangtugio.org.promptexam.Model.Question;
import hoangtugio.org.promptexam.Model.Subject;
import hoangtugio.org.promptexam.Repository.LessonRepository;
import hoangtugio.org.promptexam.Repository.QuestionRepository;
import hoangtugio.org.promptexam.Repository.SubjectRepository;
import org.junit.jupiter.api.AfterEach;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.data.mongo.DataMongoTest;

import java.util.List;

import static org.assertj.core.api.Assertions.assertThat;

@DataMongoTest
public class IntegrationMongoTest {

    @Autowired
    SubjectRepository subjectRepository;

    @Autowired
    LessonRepository lessonRepository;

    @Autowired
    QuestionRepository questionRepository;

    @AfterEach
    void clean() {
        questionRepository.deleteAll();
        lessonRepository.deleteAll();
        subjectRepository.deleteAll();
    }

    @Test
    void subjectLessonQuestion_crud_flow() {
        Subject s = new Subject("TEST", "Test Subject");
        subjectRepository.save(s);

        List<Subject> subjects = subjectRepository.findAll();
        assertThat(subjects).hasSize(1);
        Subject saved = subjects.get(0);
        assertThat(saved.getCode()).isEqualTo("TEST");

        Lesson l = Lesson.builder()
                .subject(saved)
                .grade(9)
                .name("Test Lesson")
                .build();
        lessonRepository.save(l);

        List<Lesson> lessons = lessonRepository.findAll();
        assertThat(lessons).hasSize(1);
        Lesson savedLesson = lessons.get(0);
        assertThat(savedLesson.getSubject().getCode()).isEqualTo("TEST");

        Question q = Question.builder()
                .lesson(savedLesson)
                .questionText("Sample?")
                .optionsJson("[]")
                .answerKey("a")
                .questionType("TracNghiem")
                .difficulty("NhanBiet")
                .build();
        questionRepository.save(q);

        List<Question> questions = questionRepository.findAll();
        assertThat(questions).hasSize(1);
        assertThat(questions.get(0).getLesson().getName()).isEqualTo("Test Lesson");
    }
}

