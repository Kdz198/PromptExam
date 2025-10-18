package hoangtugio.org.promptexam.Controller;


import hoangtugio.org.promptexam.Model.Matrix;
import hoangtugio.org.promptexam.Model.MatrixConfig;
import hoangtugio.org.promptexam.Model.MatrixDTO;
import hoangtugio.org.promptexam.Service.MatrixService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping ("/api/matrix")
@CrossOrigin ("*")
public class MatrixController {

    @Autowired
    MatrixService matrixService;



    @PostMapping
    public Matrix createMatrix(@RequestBody MatrixDTO matrixDTO) {
        System.out.println(matrixDTO);
        return matrixService.save( matrixDTO);
    }

    @GetMapping
    public List<Matrix> getAllMatrix() {
        return matrixService.getAllMatrix();
    }

    @GetMapping("/{id}")
    public List<MatrixConfig> getMatrixConfigsByMatrixId(@PathVariable int id) {
        return matrixService.getMatrixConfigsByMatrixId(id);
    }
}
