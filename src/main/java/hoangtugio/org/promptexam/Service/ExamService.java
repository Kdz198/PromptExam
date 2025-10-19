package hoangtugio.org.promptexam.Service;


import hoangtugio.org.promptexam.Model.Exam;
import hoangtugio.org.promptexam.Model.Matrix;
import hoangtugio.org.promptexam.Repository.ExamRepository;
import hoangtugio.org.promptexam.Repository.MatrixRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.web.bind.annotation.RequestBody;

import java.util.List;

@Service
public class ExamService {

    @Autowired
    ExamRepository examRepository;
    @Autowired
    MatrixRepository matrixRepository;


    public Exam createExam( Exam exam) {
        System.out.println("Creating exam: " + exam);
        exam.setMatrix( matrixRepository.findById(exam.getMatrix().getId()).orElse(null));
        return examRepository.save(exam);
    }


    public List< Exam> getAllExams() {
        return examRepository.findAll();
    }
}
