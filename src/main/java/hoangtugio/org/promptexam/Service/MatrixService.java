package hoangtugio.org.promptexam.Service;


import hoangtugio.org.promptexam.Model.Matrix;
import hoangtugio.org.promptexam.Model.MatrixConfig;
import hoangtugio.org.promptexam.Model.MatrixDTO;
import hoangtugio.org.promptexam.Repository.MatrixConfigRepository;
import hoangtugio.org.promptexam.Repository.MatrixRepository;
import jakarta.transaction.Transactional;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Map;

@Service
public class MatrixService {


    @Autowired
    MatrixRepository matrixRepository;

    @Autowired
    MatrixConfigRepository matrixConfigRepository;


    @Transactional
    public Matrix save(MatrixDTO matrixDTO) {


        Matrix matrix= new Matrix();
        matrix.setMatrixName( matrixDTO.getMatrixName());
        matrix.setDescription(matrixDTO.getDescription());
        matrix.setTotalQuestions( matrixDTO.getTotalQuestions());
        matrix.setSubjectId( matrixDTO.getSubjectId());
        matrix.setGrade( matrixDTO.getGrade());
        Matrix savedMatrix= matrixRepository.save(matrix);

// 2. Lấy Map cấu hình từ DTO
        Map<String, Integer> configMap = matrixDTO.getDifficultyQuestionCountMap();

        // 3. Duyệt qua Map configs (nếu có)
        if (configMap != null && !configMap.isEmpty()) {

            // Dùng .entrySet() để lấy cả key (difficulty) và value (count)
            for (Map.Entry<String, Integer> configEntry : configMap.entrySet()) {

                String difficulty = configEntry.getKey();
                int requireCount = configEntry.getValue();

                // 4. Tạo và lưu từng đối tượng MatrixConfig (con)
                MatrixConfig matrixConfig = new MatrixConfig();
                matrixConfig.setDifficulty(difficulty);
                matrixConfig.setRequire_count(requireCount);

                // Liên kết MatrixConfig với Matrix cha đã được lưu
                matrixConfig.setMatrix(savedMatrix);

                // Lưu config
                matrixConfigRepository.save(matrixConfig);
            }
        }

        return matrixRepository.save(matrix);
    }

    public List<Matrix> getAllMatrix() {

        return matrixRepository.findAll();
    }


    public List<MatrixConfig> getMatrixConfigsByMatrixId(int id) {

        return matrixConfigRepository.findByMatrixId(id);

    }
}
