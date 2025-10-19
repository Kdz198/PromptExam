package hoangtugio.org.promptexam.Service;


import hoangtugio.org.promptexam.Model.Subject;
import hoangtugio.org.promptexam.Repository.SubjectRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class SubjectService {

    @Autowired
    SubjectRepository subjectRepository;

    public Subject save ( Subject subject) {
        return subjectRepository.save(subject);
    }

    public Optional<Subject> findByCode(String code) {
        return subjectRepository.findByCode(code);
    }


    public List<Subject> findAll() {
        return subjectRepository.findAll();
    }
}
