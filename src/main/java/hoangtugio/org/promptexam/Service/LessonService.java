package hoangtugio.org.promptexam.Service;

import hoangtugio.org.promptexam.Model.Lesson;
import hoangtugio.org.promptexam.Repository.LessonRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class LessonService {

    @Autowired
    LessonRepository lessonRepository;
    @Autowired
    SubjectService subjectService;



    public Lesson save(Lesson lesson) {
        lesson.setSubject(subjectService.findByCode( lesson.getSubject().getCode() ).orElse(null) );
        return lessonRepository.save(lesson);
    }

    public Lesson findById(int id) {
        return lessonRepository.findById(id).orElse(null);
    }

    public List<Lesson> findAll() {
        return lessonRepository.findAll();
    }
}
