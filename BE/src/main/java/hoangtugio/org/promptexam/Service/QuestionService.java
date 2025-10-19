package hoangtugio.org.promptexam.Service;


import hoangtugio.org.promptexam.Model.Question;
import hoangtugio.org.promptexam.Repository.LessonRepository;
import hoangtugio.org.promptexam.Repository.QuestionRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.List;

@Service
public class QuestionService {

    @Autowired
    QuestionRepository questionRepository;
    @Autowired
    LessonRepository lessonRepository;

    public Question save( Question question) {

        question.setLesson( lessonRepository.findById(question.getLesson().getId()).orElse(null));
        System.out.println(question.getLesson());
        return questionRepository.save(question);
    }

    public Question findById(int id) {
        return questionRepository.findById(id).orElse(null);
    }

    public List< Question> findByLessonIdandGrade(int grade,int lessonId) {

        List<Question> questionALl= questionRepository.findByLessonId(lessonId);
        List<Question> questionByGrade= new ArrayList<>();
        for ( Question question: questionALl) {
            System.out.println(question);
            if (question.getLesson().getGrade()== grade) {
                questionByGrade.add(question);

            }
        }


        return questionByGrade;
    }


}
