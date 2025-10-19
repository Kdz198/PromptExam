package hoangtugio.org.promptexam.Controller;


import hoangtugio.org.promptexam.Model.Lesson;
import hoangtugio.org.promptexam.Model.Question;
import hoangtugio.org.promptexam.Model.Subject;
import hoangtugio.org.promptexam.Repository.LessonRepository;
import hoangtugio.org.promptexam.Repository.QuestionRepository;
import hoangtugio.org.promptexam.Repository.SubjectRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.ArrayList;
import java.util.List;
import java.util.NoSuchElementException;
import java.util.Optional;

@RestController
public class DumpController {

    @Autowired
    SubjectRepository subjectRepository;
    @Autowired
    LessonRepository lessonRepository;
    @Autowired
    QuestionRepository questionRepository;

    @GetMapping ("/dump")
    public String dump(){
        dumpSubject();
        subjectRepository.flush();
        dumpLesson();
        lessonRepository.flush();
        dumpQuestion();
        return "ok";
    }

    public void dumpSubject ( )
    {
        List<Subject> subjects = new ArrayList<>();
        subjects.add(new Subject("TOAN", "Toán Học"));
        subjects.add(new Subject("LY", "Vật Lý"));
        subjects.add(new Subject("HOA", "Hóa Học"));
        subjects.add(new Subject("VAN", "Ngữ Văn"));
        subjects.add(new Subject("SU", "Lịch Sử"));
        subjects.add(new Subject("DIA", "Địa Lý"));
        subjects.add(new Subject("SINH", "Sinh Học"));
        subjects.add(new Subject("GDCD", "Giáo Dục Công Dân"));
        subjects.add(new Subject("TIN", "Tin Học"));
        subjects.add(new Subject("ANH", "Tiếng Anh"));

        subjectRepository.saveAll(subjects);
    }
    private Subject getSubjectByCode(String code) {
        return subjectRepository.findByCode(code)
                .orElseThrow(() -> new NoSuchElementException("Subject with code " + code + " not found. Run dumpSubject() first."));
    }

    public void dumpLesson() {
        try {
            // Lấy các Subject từ repository
            Subject math = getSubjectByCode("TOAN");
            Subject phys = getSubjectByCode("LY");
            Subject chem = getSubjectByCode("HOA");
            Subject lit = getSubjectByCode("VAN");
            Subject hist = getSubjectByCode("SU");
            Subject geo = getSubjectByCode("DIA");
            Subject bio = getSubjectByCode("SINH");
            Subject civics = getSubjectByCode("GDCD");
            Subject it = getSubjectByCode("TIN");
            Subject eng = getSubjectByCode("ANH");

            // JSON mẫu cho mục tiêu học tập (dùng chung để đơn giản hóa)
            String objMath = "[{\"key\":\"MATH_OBJ\",\"obj\":\"Hiểu và áp dụng kiến thức cơ bản toán học.\"}]";
            String objPhys = "[{\"key\":\"PHYS_OBJ\",\"obj\":\"Nắm vững khái niệm vật lý.\"}]";
            String objChem = "[{\"key\":\"CHEM_OBJ\",\"obj\":\"Hiểu cấu trúc hóa học.\"}]";
            String objLit = "[{\"key\":\"LIT_OBJ\",\"obj\":\"Phân tích văn học.\"}]";
            String objHist = "[{\"key\":\"HIST_OBJ\",\"obj\":\"Hiểu sự kiện lịch sử.\"}]";
            String objGeo = "[{\"key\":\"GEO_OBJ\",\"obj\":\"Nắm kiến thức địa lý.\"}]";
            String objBio = "[{\"key\":\"BIO_OBJ\",\"obj\":\"Hiểu sinh học cơ bản.\"}]";
            String objCivics = "[{\"key\":\"CIVICS_OBJ\",\"obj\":\"Hiểu giáo dục công dân.\"}]";
            String objIT = "[{\"key\":\"IT_OBJ\",\"obj\":\"Nắm kỹ năng tin học.\"}]";
            String objEng = "[{\"key\":\"ENG_OBJ\",\"obj\":\"Nâng cao kỹ năng tiếng Anh.\"}]";

            // Tạo danh sách để chứa tất cả các Lesson
            List<Lesson> lessons = new ArrayList<>();

            // --- BÀI HỌC LỚP 10 ---
            // Toán 10
            lessons.add(Lesson.builder()
                    .subject(math)
                    .grade(10)
                    .name("Hàm số Bậc hai")
                    .learningObjectivesJson(objMath)
                    .build());
            lessons.add(Lesson.builder()
                    .subject(math)
                    .grade(10)
                    .name("Bất phương trình Bậc nhất")
                    .learningObjectivesJson(objMath)
                    .build());
            lessons.add(Lesson.builder()
                    .subject(math)
                    .grade(10)
                    .name("Hình học Phẳng")
                    .learningObjectivesJson(objMath)
                    .build());
            // Vật Lý 10
            lessons.add(Lesson.builder()
                    .subject(phys)
                    .grade(10)
                    .name("Động lực học chất điểm")
                    .learningObjectivesJson(objPhys)
                    .build());
            lessons.add(Lesson.builder()
                    .subject(phys)
                    .grade(10)
                    .name("Công và Công suất")
                    .learningObjectivesJson(objPhys)
                    .build());
            lessons.add(Lesson.builder()
                    .subject(phys)
                    .grade(10)
                    .name("Nhiệt học cơ bản")
                    .learningObjectivesJson(objPhys)
                    .build());
            // Hóa Học 10
            lessons.add(Lesson.builder()
                    .subject(chem)
                    .grade(10)
                    .name("Cấu tạo nguyên tử")
                    .learningObjectivesJson(objChem)
                    .build());
            lessons.add(Lesson.builder()
                    .subject(chem)
                    .grade(10)
                    .name("Liên kết Hóa học")
                    .learningObjectivesJson(objChem)
                    .build());
            lessons.add(Lesson.builder()
                    .subject(chem)
                    .grade(10)
                    .name("Phản ứng oxi hóa khử")
                    .learningObjectivesJson(objChem)
                    .build());
            // Ngữ Văn 10
            lessons.add(Lesson.builder()
                    .subject(lit)
                    .grade(10)
                    .name("Văn học trung đại")
                    .learningObjectivesJson(objLit)
                    .build());
            lessons.add(Lesson.builder()
                    .subject(lit)
                    .grade(10)
                    .name("Thơ ca Việt Nam")
                    .learningObjectivesJson(objLit)
                    .build());
            lessons.add(Lesson.builder()
                    .subject(lit)
                    .grade(10)
                    .name("Văn nghị luận")
                    .learningObjectivesJson(objLit)
                    .build());
            // Lịch Sử 10
            lessons.add(Lesson.builder()
                    .subject(hist)
                    .grade(10)
                    .name("Lịch sử cổ đại")
                    .learningObjectivesJson(objHist)
                    .build());
            lessons.add(Lesson.builder()
                    .subject(hist)
                    .grade(10)
                    .name("Các nền văn minh")
                    .learningObjectivesJson(objHist)
                    .build());
            lessons.add(Lesson.builder()
                    .subject(hist)
                    .grade(10)
                    .name("Phong kiến Việt Nam")
                    .learningObjectivesJson(objHist)
                    .build());
            // Địa Lý 10
            lessons.add(Lesson.builder()
                    .subject(geo)
                    .grade(10)
                    .name("Địa lý tự nhiên")
                    .learningObjectivesJson(objGeo)
                    .build());
            lessons.add(Lesson.builder()
                    .subject(geo)
                    .grade(10)
                    .name("Bản đồ học")
                    .learningObjectivesJson(objGeo)
                    .build());
            lessons.add(Lesson.builder()
                    .subject(geo)
                    .grade(10)
                    .name("Khí hậu học")
                    .learningObjectivesJson(objGeo)
                    .build());
            // Sinh Học 10
            lessons.add(Lesson.builder()
                    .subject(bio)
                    .grade(10)
                    .name("Tế bào học")
                    .learningObjectivesJson(objBio)
                    .build());
            lessons.add(Lesson.builder()
                    .subject(bio)
                    .grade(10)
                    .name("Vi sinh vật")
                    .learningObjectivesJson(objBio)
                    .build());
            lessons.add(Lesson.builder()
                    .subject(bio)
                    .grade(10)
                    .name("Sinh học cơ thể")
                    .learningObjectivesJson(objBio)
                    .build());
            // Giáo Dục Công Dân 10
            lessons.add(Lesson.builder()
                    .subject(civics)
                    .grade(10)
                    .name("Công dân và pháp luật")
                    .learningObjectivesJson(objCivics)
                    .build());
            lessons.add(Lesson.builder()
                    .subject(civics)
                    .grade(10)
                    .name("Đạo đức công dân")
                    .learningObjectivesJson(objCivics)
                    .build());
            lessons.add(Lesson.builder()
                    .subject(civics)
                    .grade(10)
                    .name("Quyền và nghĩa vụ")
                    .learningObjectivesJson(objCivics)
                    .build());
            // Tin Học 10
            lessons.add(Lesson.builder()
                    .subject(it)
                    .grade(10)
                    .name("Cơ bản về máy tính")
                    .learningObjectivesJson(objIT)
                    .build());
            lessons.add(Lesson.builder()
                    .subject(it)
                    .grade(10)
                    .name("Hệ điều hành")
                    .learningObjectivesJson(objIT)
                    .build());
            lessons.add(Lesson.builder()
                    .subject(it)
                    .grade(10)
                    .name("Lập trình cơ bản")
                    .learningObjectivesJson(objIT)
                    .build());
            // Tiếng Anh 10
            lessons.add(Lesson.builder()
                    .subject(eng)
                    .grade(10)
                    .name("Ngữ pháp cơ bản")
                    .learningObjectivesJson(objEng)
                    .build());
            lessons.add(Lesson.builder()
                    .subject(eng)
                    .grade(10)
                    .name("Từ vựng đời sống")
                    .learningObjectivesJson(objEng)
                    .build());
            lessons.add(Lesson.builder()
                    .subject(eng)
                    .grade(10)
                    .name("Kỹ năng nghe")
                    .learningObjectivesJson(objEng)
                    .build());

            // --- BÀI HỌC LỚP 11 ---
            // Toán 11
            lessons.add(Lesson.builder()
                    .subject(math)
                    .grade(11)
                    .name("Hàm số Lượng giác")
                    .learningObjectivesJson(objMath)
                    .build());
            lessons.add(Lesson.builder()
                    .subject(math)
                    .grade(11)
                    .name("Dãy số và Cấp số")
                    .learningObjectivesJson(objMath)
                    .build());
            lessons.add(Lesson.builder()
                    .subject(math)
                    .grade(11)
                    .name("Xác suất cơ bản")
                    .learningObjectivesJson(objMath)
                    .build());
            // Vật Lý 11
            lessons.add(Lesson.builder()
                    .subject(phys)
                    .grade(11)
                    .name("Dòng điện không đổi")
                    .learningObjectivesJson(objPhys)
                    .build());
            lessons.add(Lesson.builder()
                    .subject(phys)
                    .grade(11)
                    .name("Định luật Faraday")
                    .learningObjectivesJson(objPhys)
                    .build());
            lessons.add(Lesson.builder()
                    .subject(phys)
                    .grade(11)
                    .name("Từ trường")
                    .learningObjectivesJson(objPhys)
                    .build());
            // Hóa Học 11
            lessons.add(Lesson.builder()
                    .subject(chem)
                    .grade(11)
                    .name("Sự Điện li")
                    .learningObjectivesJson(objChem)
                    .build());
            lessons.add(Lesson.builder()
                    .subject(chem)
                    .grade(11)
                    .name("Cacbon và Hợp chất")
                    .learningObjectivesJson(objChem)
                    .build());
            lessons.add(Lesson.builder()
                    .subject(chem)
                    .grade(11)
                    .name("Hóa học hữu cơ")
                    .learningObjectivesJson(objChem)
                    .build());
            // Ngữ Văn 11
            lessons.add(Lesson.builder()
                    .subject(lit)
                    .grade(11)
                    .name("Văn học lãng mạn")
                    .learningObjectivesJson(objLit)
                    .build());
            lessons.add(Lesson.builder()
                    .subject(lit)
                    .grade(11)
                    .name("Thơ mới Việt Nam")
                    .learningObjectivesJson(objLit)
                    .build());
            lessons.add(Lesson.builder()
                    .subject(lit)
                    .grade(11)
                    .name("Văn học hiện thực")
                    .learningObjectivesJson(objLit)
                    .build());
            // Lịch Sử 11
            lessons.add(Lesson.builder()
                    .subject(hist)
                    .grade(11)
                    .name("Cách mạng công nghiệp")
                    .learningObjectivesJson(objHist)
                    .build());
            lessons.add(Lesson.builder()
                    .subject(hist)
                    .grade(11)
                    .name("Chiến tranh thế giới")
                    .learningObjectivesJson(objHist)
                    .build());
            lessons.add(Lesson.builder()
                    .subject(hist)
                    .grade(11)
                    .name("Việt Nam thế kỷ 19")
                    .learningObjectivesJson(objHist)
                    .build());
            // Địa Lý 11
            lessons.add(Lesson.builder()
                    .subject(geo)
                    .grade(11)
                    .name("Địa lý kinh tế")
                    .learningObjectivesJson(objGeo)
                    .build());
            lessons.add(Lesson.builder()
                    .subject(geo)
                    .grade(11)
                    .name("Dân số và lao động")
                    .learningObjectivesJson(objGeo)
                    .build());
            lessons.add(Lesson.builder()
                    .subject(geo)
                    .grade(11)
                    .name("Khu vực hóa")
                    .learningObjectivesJson(objGeo)
                    .build());
            // Sinh Học 11
            lessons.add(Lesson.builder()
                    .subject(bio)
                    .grade(11)
                    .name("Sinh thái học")
                    .learningObjectivesJson(objBio)
                    .build());
            lessons.add(Lesson.builder()
                    .subject(bio)
                    .grade(11)
                    .name("Di truyền học")
                    .learningObjectivesJson(objBio)
                    .build());
            lessons.add(Lesson.builder()
                    .subject(bio)
                    .grade(11)
                    .name("Tiến hóa")
                    .learningObjectivesJson(objBio)
                    .build());
            // Giáo Dục Công Dân 11
            lessons.add(Lesson.builder()
                    .subject(civics)
                    .grade(11)
                    .name("Quyền dân sự")
                    .learningObjectivesJson(objCivics)
                    .build());
            lessons.add(Lesson.builder()
                    .subject(civics)
                    .grade(11)
                    .name("Hôn nhân và gia đình")
                    .learningObjectivesJson(objCivics)
                    .build());
            lessons.add(Lesson.builder()
                    .subject(civics)
                    .grade(11)
                    .name("Pháp luật lao động")
                    .learningObjectivesJson(objCivics)
                    .build());
            // Tin Học 11
            lessons.add(Lesson.builder()
                    .subject(it)
                    .grade(11)
                    .name("Cơ sở dữ liệu")
                    .learningObjectivesJson(objIT)
                    .build());
            lessons.add(Lesson.builder()
                    .subject(it)
                    .grade(11)
                    .name("Lập trình nâng cao")
                    .learningObjectivesJson(objIT)
                    .build());
            lessons.add(Lesson.builder()
                    .subject(it)
                    .grade(11)
                    .name("Mạng máy tính")
                    .learningObjectivesJson(objIT)
                    .build());
            // Tiếng Anh 11
            lessons.add(Lesson.builder()
                    .subject(eng)
                    .grade(11)
                    .name("Kỹ năng viết")
                    .learningObjectivesJson(objEng)
                    .build());
            lessons.add(Lesson.builder()
                    .subject(eng)
                    .grade(11)
                    .name("Từ vựng nâng cao")
                    .learningObjectivesJson(objEng)
                    .build());
            lessons.add(Lesson.builder()
                    .subject(eng)
                    .grade(11)
                    .name("Kỹ năng đọc")
                    .learningObjectivesJson(objEng)
                    .build());

            // --- BÀI HỌC LỚP 12 ---
            // Toán 12
            lessons.add(Lesson.builder()
                    .subject(math)
                    .grade(12)
                    .name("Ứng dụng Đạo hàm")
                    .learningObjectivesJson(objMath)
                    .build());
            lessons.add(Lesson.builder()
                    .subject(math)
                    .grade(12)
                    .name("Tích phân")
                    .learningObjectivesJson(objMath)
                    .build());
            lessons.add(Lesson.builder()
                    .subject(math)
                    .grade(12)
                    .name("Số phức")
                    .learningObjectivesJson(objMath)
                    .build());
            // Vật Lý 12
            lessons.add(Lesson.builder()
                    .subject(phys)
                    .grade(12)
                    .name("Dao động Điều hòa")
                    .learningObjectivesJson(objPhys)
                    .build());
            lessons.add(Lesson.builder()
                    .subject(phys)
                    .grade(12)
                    .name("Sóng Cơ học")
                    .learningObjectivesJson(objPhys)
                    .build());
            lessons.add(Lesson.builder()
                    .subject(phys)
                    .grade(12)
                    .name("Điện xoay chiều")
                    .learningObjectivesJson(objPhys)
                    .build());
            // Hóa Học 12
            lessons.add(Lesson.builder()
                    .subject(chem)
                    .grade(12)
                    .name("Este – Lipit")
                    .learningObjectivesJson(objChem)
                    .build());
            lessons.add(Lesson.builder()
                    .subject(chem)
                    .grade(12)
                    .name("Amin – Amino Axit")
                    .learningObjectivesJson(objChem)
                    .build());
            lessons.add(Lesson.builder()
                    .subject(chem)
                    .grade(12)
                    .name("Polime")
                    .learningObjectivesJson(objChem)
                    .build());
            // Ngữ Văn 12
            lessons.add(Lesson.builder()
                    .subject(lit)
                    .grade(12)
                    .name("Văn học cách mạng")
                    .learningObjectivesJson(objLit)
                    .build());
            lessons.add(Lesson.builder()
                    .subject(lit)
                    .grade(12)
                    .name("Tiểu thuyết Việt Nam")
                    .learningObjectivesJson(objLit)
                    .build());
            lessons.add(Lesson.builder()
                    .subject(lit)
                    .grade(12)
                    .name("Văn nghị luận xã hội")
                    .learningObjectivesJson(objLit)
                    .build());
            // Lịch Sử 12
            lessons.add(Lesson.builder()
                    .subject(hist)
                    .grade(12)
                    .name("Lịch sử Việt Nam 1945-1975")
                    .learningObjectivesJson(objHist)
                    .build());
            lessons.add(Lesson.builder()
                    .subject(hist)
                    .grade(12)
                    .name("Chiến tranh lạnh")
                    .learningObjectivesJson(objHist)
                    .build());
            lessons.add(Lesson.builder()
                    .subject(hist)
                    .grade(12)
                    .name("Phong trào giải phóng dân tộc")
                    .learningObjectivesJson(objHist)
                    .build());
            // Địa Lý 12
            lessons.add(Lesson.builder()
                    .subject(geo)
                    .grade(12)
                    .name("Địa lý Việt Nam")
                    .learningObjectivesJson(objGeo)
                    .build());
            lessons.add(Lesson.builder()
                    .subject(geo)
                    .grade(12)
                    .name("Kinh tế biển")
                    .learningObjectivesJson(objGeo)
                    .build());
            lessons.add(Lesson.builder()
                    .subject(geo)
                    .grade(12)
                    .name("Vấn đề môi trường")
                    .learningObjectivesJson(objGeo)
                    .build());
            // Sinh Học 12
            lessons.add(Lesson.builder()
                    .subject(bio)
                    .grade(12)
                    .name("Di truyền người")
                    .learningObjectivesJson(objBio)
                    .build());
            lessons.add(Lesson.builder()
                    .subject(bio)
                    .grade(12)
                    .name("Ứng dụng sinh học")
                    .learningObjectivesJson(objBio)
                    .build());
            lessons.add(Lesson.builder()
                    .subject(bio)
                    .grade(12)
                    .name("Quần thể sinh vật")
                    .learningObjectivesJson(objBio)
                    .build());
            // Giáo Dục Công Dân 12
            lessons.add(Lesson.builder()
                    .subject(civics)
                    .grade(12)
                    .name("Pháp luật và đời sống")
                    .learningObjectivesJson(objCivics)
                    .build());
            lessons.add(Lesson.builder()
                    .subject(civics)
                    .grade(12)
                    .name("Công dân toàn cầu")
                    .learningObjectivesJson(objCivics)
                    .build());
            lessons.add(Lesson.builder()
                    .subject(civics)
                    .grade(12)
                    .name("Nhà nước pháp quyền")
                    .learningObjectivesJson(objCivics)
                    .build());
            // Tin Học 12
            lessons.add(Lesson.builder()
                    .subject(it)
                    .grade(12)
                    .name("Hệ quản trị cơ sở dữ liệu")
                    .learningObjectivesJson(objIT)
                    .build());
            lessons.add(Lesson.builder()
                    .subject(it)
                    .grade(12)
                    .name("Ứng dụng tin học")
                    .learningObjectivesJson(objIT)
                    .build());
            lessons.add(Lesson.builder()
                    .subject(it)
                    .grade(12)
                    .name("An ninh mạng")
                    .learningObjectivesJson(objIT)
                    .build());
            // Tiếng Anh 12
            lessons.add(Lesson.builder()
                    .subject(eng)
                    .grade(12)
                    .name("Kỹ năng nói")
                    .learningObjectivesJson(objEng)
                    .build());
            lessons.add(Lesson.builder()
                    .subject(eng)
                    .grade(12)
                    .name("Ngữ pháp nâng cao")
                    .learningObjectivesJson(objEng)
                    .build());
            lessons.add(Lesson.builder()
                    .subject(eng)
                    .grade(12)
                    .name("Chuẩn bị thi THPT")
                    .learningObjectivesJson(objEng)
                    .build());

            // Lưu tất cả lessons một lần
            lessonRepository.saveAll(lessons);
            lessonRepository.flush();

            System.out.println("--- Đã đổ dữ liệu mẫu 90 Lesson (10 môn, 3 bài/lớp, lớp 10-12) thành công ---");

        } catch (NoSuchElementException e) {
            System.err.println("LỖI DUMP DATA: " + e.getMessage());
        } catch (Exception e) {
            System.err.println("LỖI DUMP DATA: " + e.getMessage());
            e.printStackTrace();
        }
    }

    public void dumpQuestion() {
        try {
            // Lấy các Subject từ repository
            Subject math = getSubjectByCode("TOAN");
            Subject phys = getSubjectByCode("LY");

            // Lấy các Lesson của Toán và Vật Lý từ repository
            List<Lesson> mathLessons = lessonRepository.findBySubjectAndGradeIn(math, List.of(10, 11, 12));
            List<Lesson> physLessons = lessonRepository.findBySubjectAndGradeIn(phys, List.of(10, 11, 12));

            // Kiểm tra xem có Lesson nào không
            if (mathLessons.isEmpty() || physLessons.isEmpty()) {
                throw new NoSuchElementException("No lessons found for Toán or Vật Lý. Run dumpLesson() first.");
            }

            // Tạo danh sách để chứa tất cả các Question
            List<Question> questions = new ArrayList<>();

            // JSON mẫu cho options (4 lựa chọn cho câu hỏi trắc nghiệm)
            String mathOptionsJson = "[{\"a\": \"A\"}, {\"b\": \"B\"}, {\"c\": \"C\"}, {\"d\": \"D\"}]";
            String physOptionsJson = "[{\"a\": \"A\"}, {\"b\": \"B\"}, {\"c\": \"C\"}, {\"d\": \"D\"}]";

            // --- Câu hỏi cho Toán ---
            for (Lesson lesson : mathLessons) {
                switch (lesson.getName()) {
                    case "Hàm số Bậc hai":
                        questions.add(Question.builder()
                                .lesson(lesson)
                                .questionText("Tìm nghiệm của phương trình bậc hai: \\( x^2 - 4x + 3 = 0 \\)")
                                .optionsJson(mathOptionsJson)
                                .answerKey("c")
                                .questionType("TracNghiem")
                                .difficulty("NhanBiet")
                                .defaultPoint(1.0)
                                .build());
                        questions.add(Question.builder()
                                .lesson(lesson)
                                .questionText("Tìm đỉnh của parabol: \\( y = x^2 - 2x + 1 \\)")
                                .optionsJson(mathOptionsJson)
                                .answerKey("a")
                                .questionType("TracNghiem")
                                .difficulty("ThongHieu")
                                .defaultPoint(1.0)
                                .build());
                        break;
                    case "Bất phương trình Bậc nhất":
                        questions.add(Question.builder()
                                .lesson(lesson)
                                .questionText("Giải bất phương trình: \\( 2x - 3 > 5 \\)")
                                .optionsJson(mathOptionsJson)
                                .answerKey("b")
                                .questionType("TracNghiem")
                                .difficulty("NhanBiet")
                                .defaultPoint(1.0)
                                .build());
                        questions.add(Question.builder()
                                .lesson(lesson)
                                .questionText("Tìm tập nghiệm của: \\( 3x + 1 \\leq 7 \\)")
                                .optionsJson(mathOptionsJson)
                                .answerKey("d")
                                .questionType("TracNghiem")
                                .difficulty("ThongHieu")
                                .defaultPoint(1.0)
                                .build());
                        break;
                    case "Hình học Phẳng":
                        questions.add(Question.builder()
                                .lesson(lesson)
                                .questionText("Tính diện tích tam giác có cạnh 3, 4, 5.")
                                .optionsJson(mathOptionsJson)
                                .answerKey("c")
                                .questionType("TracNghiem")
                                .difficulty("NhanBiet")
                                .defaultPoint(1.0)
                                .build());
                        questions.add(Question.builder()
                                .lesson(lesson)
                                .questionText("Tìm góc giữa hai đường thẳng trong mặt phẳng.")
                                .optionsJson(mathOptionsJson)
                                .answerKey("a")
                                .questionType("TracNghiem")
                                .difficulty("ThongHieu")
                                .defaultPoint(1.0)
                                .build());
                        break;
                    case "Hàm số Lượng giác":
                        questions.add(Question.builder()
                                .lesson(lesson)
                                .questionText("Tìm giá trị của \\( \\sin(30^\\circ) \\).")
                                .optionsJson(mathOptionsJson)
                                .answerKey("b")
                                .questionType("TracNghiem")
                                .difficulty("NhanBiet")
                                .defaultPoint(1.0)
                                .build());
                        questions.add(Question.builder()
                                .lesson(lesson)
                                .questionText("Giải phương trình: \\( \\cos(x) = 0.5 \\).")
                                .optionsJson(mathOptionsJson)
                                .answerKey("d")
                                .questionType("TracNghiem")
                                .difficulty("ThongHieu")
                                .defaultPoint(1.0)
                                .build());
                        break;
                    case "Dãy số và Cấp số":
                        questions.add(Question.builder()
                                .lesson(lesson)
                                .questionText("Tìm số hạng thứ 5 của dãy số cộng: 2, 5, 8, ...")
                                .optionsJson(mathOptionsJson)
                                .answerKey("c")
                                .questionType("TracNghiem")
                                .difficulty("NhanBiet")
                                .defaultPoint(1.0)
                                .build());
                        questions.add(Question.builder()
                                .lesson(lesson)
                                .questionText("Tính tổng 10 số hạng đầu của cấp số nhân.")
                                .optionsJson(mathOptionsJson)
                                .answerKey("a")
                                .questionType("TracNghiem")
                                .difficulty("ThongHieu")
                                .defaultPoint(1.0)
                                .build());
                        break;
                    case "Xác suất cơ bản":
                        questions.add(Question.builder()
                                .lesson(lesson)
                                .questionText("Tính xác suất tung đồng xu được mặt sấp.")
                                .optionsJson(mathOptionsJson)
                                .answerKey("b")
                                .questionType("TracNghiem")
                                .difficulty("NhanBiet")
                                .defaultPoint(1.0)
                                .build());
                        questions.add(Question.builder()
                                .lesson(lesson)
                                .questionText("Tính xác suất chọn 1 viên bi đỏ từ túi 10 bi.")
                                .optionsJson(mathOptionsJson)
                                .answerKey("d")
                                .questionType("TracNghiem")
                                .difficulty("ThongHieu")
                                .defaultPoint(1.0)
                                .build());
                        break;
                    case "Ứng dụng Đạo hàm":
                        questions.add(Question.builder()
                                .lesson(lesson)
                                .questionText("Tìm đạo hàm của hàm số \\( y = x^3 - 3x \\).")
                                .optionsJson(mathOptionsJson)
                                .answerKey("c")
                                .questionType("TracNghiem")
                                .difficulty("NhanBiet")
                                .defaultPoint(1.0)
                                .build());
                        questions.add(Question.builder()
                                .lesson(lesson)
                                .questionText("Tìm điểm cực trị của hàm số \\( y = x^2 - 4x + 3 \\).")
                                .optionsJson(mathOptionsJson)
                                .answerKey("a")
                                .questionType("TracNghiem")
                                .difficulty("ThongHieu")
                                .defaultPoint(1.0)
                                .build());
                        break;
                    case "Tích phân":
                        questions.add(Question.builder()
                                .lesson(lesson)
                                .questionText("Tính tích phân: \\( \\int x^2 dx \\).")
                                .optionsJson(mathOptionsJson)
                                .answerKey("b")
                                .questionType("TracNghiem")
                                .difficulty("NhanBiet")
                                .defaultPoint(1.0)
                                .build());
                        questions.add(Question.builder()
                                .lesson(lesson)
                                .questionText("Tính diện tích hình phẳng giới hạn bởi \\( y = x^2 \\) và trục Ox.")
                                .optionsJson(mathOptionsJson)
                                .answerKey("d")
                                .questionType("TracNghiem")
                                .difficulty("ThongHieu")
                                .defaultPoint(1.0)
                                .build());
                        break;
                    case "Số phức":
                        questions.add(Question.builder()
                                .lesson(lesson)
                                .questionText("Tìm mô-đun của số phức \\( z = 3 + 4i \\).")
                                .optionsJson(mathOptionsJson)
                                .answerKey("c")
                                .questionType("TracNghiem")
                                .difficulty("NhanBiet")
                                .defaultPoint(1.0)
                                .build());
                        questions.add(Question.builder()
                                .lesson(lesson)
                                .questionText("Tính tổng hai số phức \\( z_1 = 1 + i \\), \\( z_2 = 2 - i \\).")
                                .optionsJson(mathOptionsJson)
                                .answerKey("a")
                                .questionType("TracNghiem")
                                .difficulty("ThongHieu")
                                .defaultPoint(1.0)
                                .build());
                        break;
                }
            }

            // --- Câu hỏi cho Vật Lý ---
            for (Lesson lesson : physLessons) {
                switch (lesson.getName()) {
                    case "Động lực học chất điểm":
                        questions.add(Question.builder()
                                .lesson(lesson)
                                .questionText("Tính gia tốc của vật theo định luật II Newton: \\( F = ma \\).")
                                .optionsJson(physOptionsJson)
                                .answerKey("c")
                                .questionType("TracNghiem")
                                .difficulty("NhanBiet")
                                .defaultPoint(1.0)
                                .build());
                        questions.add(Question.builder()
                                .lesson(lesson)
                                .questionText("Tìm lực tác dụng lên vật có khối lượng 2kg, gia tốc 3m/s².")
                                .optionsJson(physOptionsJson)
                                .answerKey("a")
                                .questionType("TracNghiem")
                                .difficulty("ThongHieu")
                                .defaultPoint(1.0)
                                .build());
                        break;
                    case "Công và Công suất":
                        questions.add(Question.builder()
                                .lesson(lesson)
                                .questionText("Công thức tính công là gì?")
                                .optionsJson(physOptionsJson)
                                .answerKey("b")
                                .questionType("TracNghiem")
                                .difficulty("NhanBiet")
                                .defaultPoint(1.0)
                                .build());
                        questions.add(Question.builder()
                                .lesson(lesson)
                                .questionText("Tính công suất của động cơ làm công 1000J trong 5s.")
                                .optionsJson(physOptionsJson)
                                .answerKey("d")
                                .questionType("TracNghiem")
                                .difficulty("ThongHieu")
                                .defaultPoint(1.0)
                                .build());
                        break;
                    case "Nhiệt học cơ bản":
                        questions.add(Question.builder()
                                .lesson(lesson)
                                .questionText("Nhiệt lượng được tính theo công thức nào?")
                                .optionsJson(physOptionsJson)
                                .answerKey("c")
                                .questionType("TracNghiem")
                                .difficulty("NhanBiet")
                                .defaultPoint(1.0)
                                .build());
                        questions.add(Question.builder()
                                .lesson(lesson)
                                .questionText("Tính nhiệt lượng cần thiết để đun nóng 1kg nước từ 20°C lên 80°C.")
                                .optionsJson(physOptionsJson)
                                .answerKey("a")
                                .questionType("TracNghiem")
                                .difficulty("ThongHieu")
                                .defaultPoint(1.0)
                                .build());
                        break;
                    case "Dòng điện không đổi":
                        questions.add(Question.builder()
                                .lesson(lesson)
                                .questionText("Định luật Ohm có công thức nào?")
                                .optionsJson(physOptionsJson)
                                .answerKey("b")
                                .questionType("TracNghiem")
                                .difficulty("NhanBiet")
                                .defaultPoint(1.0)
                                .build());
                        questions.add(Question.builder()
                                .lesson(lesson)
                                .questionText("Tính điện trở của dây dẫn có I = 2A, U = 12V.")
                                .optionsJson(physOptionsJson)
                                .answerKey("d")
                                .questionType("TracNghiem")
                                .difficulty("ThongHieu")
                                .defaultPoint(1.0)
                                .build());
                        break;
                    case "Định luật Faraday":
                        questions.add(Question.builder()
                                .lesson(lesson)
                                .questionText("Suất điện động cảm ứng được tính thế nào?")
                                .optionsJson(physOptionsJson)
                                .answerKey("c")
                                .questionType("TracNghiem")
                                .difficulty("NhanBiet")
                                .defaultPoint(1.0)
                                .build());
                        questions.add(Question.builder()
                                .lesson(lesson)
                                .questionText("Tìm suất điện động cảm ứng trong mạch có từ thông thay đổi.")
                                .optionsJson(physOptionsJson)
                                .answerKey("a")
                                .questionType("TracNghiem")
                                .difficulty("ThongHieu")
                                .defaultPoint(1.0)
                                .build());
                        break;
                    case "Từ trường":
                        questions.add(Question.builder()
                                .lesson(lesson)
                                .questionText("Lực từ tác dụng lên dây dẫn có dòng điện là gì?")
                                .optionsJson(physOptionsJson)
                                .answerKey("b")
                                .questionType("TracNghiem")
                                .difficulty("NhanBiet")
                                .defaultPoint(1.0)
                                .build());
                        questions.add(Question.builder()
                                .lesson(lesson)
                                .questionText("Tính lực từ tác dụng lên dây dẫn dài 1m, I = 5A, B = 0.2T.")
                                .optionsJson(physOptionsJson)
                                .answerKey("d")
                                .questionType("TracNghiem")
                                .difficulty("ThongHieu")
                                .defaultPoint(1.0)
                                .build());
                        break;
                    case "Dao động Điều hòa":
                        questions.add(Question.builder()
                                .lesson(lesson)
                                .questionText("Chu kỳ dao động điều hòa được tính thế nào?")
                                .optionsJson(physOptionsJson)
                                .answerKey("c")
                                .questionType("TracNghiem")
                                .difficulty("NhanBiet")
                                .defaultPoint(1.0)
                                .build());
                        questions.add(Question.builder()
                                .lesson(lesson)
                                .questionText("Tính tần số dao động của con lắc lò xo với k = 100N/m, m = 1kg.")
                                .optionsJson(physOptionsJson)
                                .answerKey("a")
                                .questionType("TracNghiem")
                                .difficulty("ThongHieu")
                                .defaultPoint(1.0)
                                .build());
                        break;
                    case "Sóng Cơ học":
                        questions.add(Question.builder()
                                .lesson(lesson)
                                .questionText("Tốc độ truyền sóng phụ thuộc vào yếu tố nào?")
                                .optionsJson(physOptionsJson)
                                .answerKey("b")
                                .questionType("TracNghiem")
                                .difficulty("NhanBiet")
                                .defaultPoint(1.0)
                                .build());
                        questions.add(Question.builder()
                                .lesson(lesson)
                                .questionText("Tính bước sóng của sóng có tần số 50Hz, tốc độ 340m/s.")
                                .optionsJson(physOptionsJson)
                                .answerKey("d")
                                .questionType("TracNghiem")
                                .difficulty("ThongHieu")
                                .defaultPoint(1.0)
                                .build());
                        break;
                    case "Điện xoay chiều":
                        questions.add(Question.builder()
                                .lesson(lesson)
                                .questionText("Công thức tính điện áp hiệu dụng là gì?")
                                .optionsJson(physOptionsJson)
                                .answerKey("c")
                                .questionType("TracNghiem")
                                .difficulty("NhanBiet")
                                .defaultPoint(1.0)
                                .build());
                        questions.add(Question.builder()
                                .lesson(lesson)
                                .questionText("Tính công suất tiêu thụ của mạch điện xoay chiều.")
                                .optionsJson(physOptionsJson)
                                .answerKey("a")
                                .questionType("TracNghiem")
                                .difficulty("ThongHieu")
                                .defaultPoint(1.0)
                                .build());
                        break;
                }
            }

            // Lưu tất cả questions một lần
            questionRepository.saveAll(questions);
            questionRepository.flush();

            System.out.println("--- Đã đổ dữ liệu mẫu 36 Question (2 môn, 3 bài/lớp, 2 câu hỏi/bài, lớp 10-12) thành công ---");

        } catch (NoSuchElementException e) {
            System.err.println("LỖI DUMP DATA: " + e.getMessage());
        } catch (Exception e) {
            System.err.println("LỖI DUMP DATA: " + e.getMessage());
            e.printStackTrace();
        }
    }



}
