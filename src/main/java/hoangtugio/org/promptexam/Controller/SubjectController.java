package hoangtugio.org.promptexam.Controller;


import hoangtugio.org.promptexam.Model.Subject;
import hoangtugio.org.promptexam.Service.SubjectService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("api/subject")
@CrossOrigin ("*")
public class SubjectController {

    @Autowired
    SubjectService subjectService;


    @GetMapping
    public List<Subject> getAllSubjects() {
        return subjectService.findAll();
    }

    @PostMapping
    public Subject createSubject( @RequestBody Subject subject) {
        System.out.println( "Received subject: " + subject);
        return subjectService.save(subject);
    }
}
