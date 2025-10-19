package hoangtugio.org.promptexam.Controller;


import hoangtugio.org.promptexam.Model.Exam;
import hoangtugio.org.promptexam.Service.ExamService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping ("/api/exam")
@CrossOrigin("*")
public class ExamController {

    @Autowired
    ExamService examService;


    @GetMapping
    public List<Exam> getAllExams() {
        return examService.getAllExams();
    }

    @PostMapping
    public Exam createExam( @RequestBody Exam exam) {
        return examService.createExam(exam);
    }
}
