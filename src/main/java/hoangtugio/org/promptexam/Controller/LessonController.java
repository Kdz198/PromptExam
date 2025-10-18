package hoangtugio.org.promptexam.Controller;


import hoangtugio.org.promptexam.Model.Lesson;
import hoangtugio.org.promptexam.Service.LessonService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("api/lesson")
@CrossOrigin("*")
public class LessonController {
    @Autowired
    LessonService lessonService;

    @GetMapping
    public List<Lesson> getAllLessons() {
        return lessonService.findAll();
    }

    @PostMapping
    public Lesson createLesson(@RequestBody Lesson lesson) {
        return lessonService.save(lesson);
    }
}
