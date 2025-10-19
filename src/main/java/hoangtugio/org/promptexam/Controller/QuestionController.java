package hoangtugio.org.promptexam.Controller;


import hoangtugio.org.promptexam.Model.Question;
import hoangtugio.org.promptexam.Repository.QuestionRepository;
import hoangtugio.org.promptexam.Service.QuestionService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/questions")
@CrossOrigin("*")
public class QuestionController {

    @Autowired
    QuestionRepository questionRepository;
    @Autowired
    private QuestionService questionService;

    @PostMapping
   public Question createQuestion( @RequestBody Question question) {

        return questionService.save(question);
    }

    @PutMapping
    public Question updateQuestion( @RequestBody Question question) {

        return questionService.save(question);
    }

    @GetMapping()
    public List<Question> getQuestionsByLessonIdAndGradeId( @RequestParam int gradeId, @RequestParam int lessonId)
    {
        return  questionService.findByLessonIdandGrade(gradeId, lessonId);
    }
    @GetMapping("all")
    public List<Question> getAllQuestions() {
        return questionRepository.findAll();
    }

}
