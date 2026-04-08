package com.eduvault.backend.config;

import com.eduvault.backend.entity.*;
import com.eduvault.backend.repository.*;
import com.eduvault.backend.service.StatsService;
import org.springframework.boot.CommandLineRunner;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

import java.time.LocalDateTime;
import java.util.List;

@Configuration
public class DataLoader {

    @Bean
    CommandLineRunner loadData(StudentRepository studentRepository,
                               AdminRepository adminRepository,
                               DepartmentRepository departmentRepository,
                               ResourceRepository resourceRepository,
                               StatsRepository statsRepository,
                               StatsService statsService,
                               BookmarkRepository bookmarkRepository,
                               DownloadHistoryRepository downloadHistoryRepository) {
        return args -> {

            // ── Students ─────────────────────────────────────────────────────
            if (studentRepository.count() == 0) {
                studentRepository.saveAll(List.of(
                        new Student("STU101", "Lokesh", "2400033174@kluniversity.in", "1234", "LK", "5", true),
                        new Student("STU102", "Pardhu", "2400033051@kluniversity.in", "1234", "AN", "3", true),
                        new Student("STU103", "Harsha", "2400030417@kluniversity.in", "1234", "RV", "7", true)
                ));
            }

            // ── Admins ────────────────────────────────────────────────────────
            if (adminRepository.count() == 0) {
                adminRepository.saveAll(List.of(
                        new Admin("ADM101", "Main Admin", "admin1@kluniversity.in", "admin123", "AD"),
                        new Admin("ADM102", "Library Admin", "admin2@kluniversity.in", "admin123", "LB")
                ));
            }

            // ── Departments ───────────────────────────────────────────────────
            if (departmentRepository.count() == 0) {
                departmentRepository.saveAll(List.of(
                        new Department("D1", "Computer Science"),
                        new Department("D2", "Mathematics"),
                        new Department("D3", "Physics"),
                        new Department("D4", "Mechanical Engineering"),
                        new Department("D5", "Chemistry"),
                        new Department("D6", "Literature")
                ));
            }

            // ── Resources ─────────────────────────────────────────────────────
            if (resourceRepository.count() == 0) {
                String dummyPdf = "https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf";

                Resource r1 = new Resource();
                r1.setId("RES101"); r1.setFileName("Data Structures Complete Notes");
                r1.setSubject("Computer Science"); r1.setSemester("3"); r1.setFileType("PDF");
                r1.setDownloads(24); r1.setUploadDate("2026-02-20"); r1.setUploader("Main Admin");
                r1.setCategory("Computer Science"); r1.setTags(List.of("dsa", "notes", "trees"));
                r1.setStatus("approved"); r1.setDescription("Complete notes for data structures and algorithms.");
                r1.setSize("2.1 MB"); r1.setPages(120); r1.setLanguage("English"); r1.setFileUrl(dummyPdf);

                Resource r2 = new Resource();
                r2.setId("RES102"); r2.setFileName("Engineering Mathematics Unit 1");
                r2.setSubject("Mathematics"); r2.setSemester("1"); r2.setFileType("PDF");
                r2.setDownloads(11); r2.setUploadDate("2026-02-22"); r2.setUploader("Library Admin");
                r2.setCategory("Mathematics"); r2.setTags(List.of("maths", "semester1", "calculus"));
                r2.setStatus("approved"); r2.setDescription("Important unit-wise math material.");
                r2.setSize("1.4 MB"); r2.setPages(58); r2.setLanguage("English"); r2.setFileUrl(dummyPdf);

                Resource r3 = new Resource();
                r3.setId("RES103"); r3.setFileName("Physics Lab Manual");
                r3.setSubject("Physics"); r3.setSemester("2"); r3.setFileType("DOCX");
                r3.setDownloads(3); r3.setUploadDate("2026-02-24"); r3.setUploader("Lokesh");
                r3.setCategory("Physics"); r3.setTags(List.of("lab", "manual", "practical"));
                r3.setStatus("approved"); r3.setDescription("Lab manual for physics practicals.");
                r3.setSize("0.8 MB"); r3.setPages(24); r3.setLanguage("English"); r3.setFileUrl(dummyPdf);

                Resource r4 = new Resource();
                r4.setId("RES104"); r4.setFileName("Object Oriented Programming with Java");
                r4.setSubject("Computer Science"); r4.setSemester("4"); r4.setFileType("PDF");
                r4.setDownloads(18); r4.setUploadDate("2026-02-26"); r4.setUploader("Main Admin");
                r4.setCategory("Computer Science"); r4.setTags(List.of("java", "oop", "classes"));
                r4.setStatus("approved"); r4.setDescription("Complete guide to OOP concepts using Java.");
                r4.setSize("3.2 MB"); r4.setPages(200); r4.setLanguage("English"); r4.setFileUrl(dummyPdf);

                Resource r5 = new Resource();
                r5.setId("RES105"); r5.setFileName("Engineering Mechanics – Statics");
                r5.setSubject("Engineering"); r5.setSemester("2"); r5.setFileType("PDF");
                r5.setDownloads(9); r5.setUploadDate("2026-03-01"); r5.setUploader("Library Admin");
                r5.setCategory("Engineering"); r5.setTags(List.of("statics", "mechanics", "forces"));
                r5.setStatus("approved"); r5.setDescription("Statics and equilibrium principles for engineers.");
                r5.setSize("2.5 MB"); r5.setPages(145); r5.setLanguage("English"); r5.setFileUrl(dummyPdf);

                Resource r6 = new Resource();
                r6.setId("RES106"); r6.setFileName("Organic Chemistry Reactions Guide");
                r6.setSubject("Chemistry"); r6.setSemester("3"); r6.setFileType("PDF");
                r6.setDownloads(7); r6.setUploadDate("2026-03-03"); r6.setUploader("Library Admin");
                r6.setCategory("Chemistry"); r6.setTags(List.of("organic", "reactions", "chemistry"));
                r6.setStatus("approved"); r6.setDescription("Comprehensive guide to organic chemistry reactions.");
                r6.setSize("1.8 MB"); r6.setPages(90); r6.setLanguage("English"); r6.setFileUrl(dummyPdf);

                Resource r7 = new Resource();
                r7.setId("RES107"); r7.setFileName("English Literature – Shakespeare Analysis");
                r7.setSubject("Literature"); r7.setSemester("1"); r7.setFileType("DOCX");
                r7.setDownloads(5); r7.setUploadDate("2026-03-05"); r7.setUploader("Main Admin");
                r7.setCategory("Literature"); r7.setTags(List.of("shakespeare", "analysis", "english"));
                r7.setStatus("approved"); r7.setDescription("In-depth analysis of Shakespeare's major works.");
                r7.setSize("1.1 MB"); r7.setPages(65); r7.setLanguage("English"); r7.setFileUrl(dummyPdf);

                Resource r8 = new Resource();
                r8.setId("RES108"); r8.setFileName("Algorithm Design and Complexity");
                r8.setSubject("Computer Science"); r8.setSemester("5"); r8.setFileType("PPT");
                r8.setDownloads(31); r8.setUploadDate("2026-03-07"); r8.setUploader("Main Admin");
                r8.setCategory("Computer Science"); r8.setTags(List.of("algorithms", "complexity", "big-o"));
                r8.setStatus("approved"); r8.setDescription("Slides covering algorithm design paradigms.");
                r8.setSize("4.0 MB"); r8.setPages(80); r8.setLanguage("English"); r8.setFileUrl(dummyPdf);

                Resource r9 = new Resource();
                r9.setId("RES109"); r9.setFileName("Calculus – Differential Equations");
                r9.setSubject("Mathematics"); r9.setSemester("2"); r9.setFileType("PDF");
                r9.setDownloads(14); r9.setUploadDate("2026-03-08"); r9.setUploader("Library Admin");
                r9.setCategory("Mathematics"); r9.setTags(List.of("calculus", "differential", "equations"));
                r9.setStatus("approved"); r9.setDescription("Integration and differential equations handbook.");
                r9.setSize("2.2 MB"); r9.setPages(110); r9.setLanguage("English"); r9.setFileUrl(dummyPdf);

                Resource r10 = new Resource();
                r10.setId("RES110"); r10.setFileName("Thermodynamics – Engineering Applications");
                r10.setSubject("Engineering"); r10.setSemester("4"); r10.setFileType("PDF");
                r10.setDownloads(6); r10.setUploadDate("2026-03-10"); r10.setUploader("Library Admin");
                r10.setCategory("Engineering"); r10.setTags(List.of("thermodynamics", "heat", "energy"));
                r10.setStatus("approved"); r10.setDescription("Thermodynamics laws and engineering applications.");
                r10.setSize("3.0 MB"); r10.setPages(160); r10.setLanguage("English"); r10.setFileUrl(dummyPdf);

                Resource r11 = new Resource();
                r11.setId("RES111"); r11.setFileName("Quantum Mechanics Basics");
                r11.setSubject("Physics"); r11.setSemester("5"); r11.setFileType("PDF");
                r11.setDownloads(12); r11.setUploadDate("2026-03-12"); r11.setUploader("Main Admin");
                r11.setCategory("Physics"); r11.setTags(List.of("quantum", "wave", "particles"));
                r11.setStatus("approved"); r11.setDescription("Introduction to quantum mechanics and wave phenomena.");
                r11.setSize("2.7 MB"); r11.setPages(135); r11.setLanguage("English"); r11.setFileUrl(dummyPdf);

                Resource r12 = new Resource();
                r12.setId("RES112"); r12.setFileName("Database Management Systems");
                r12.setSubject("Computer Science"); r12.setSemester("4"); r12.setFileType("PPT");
                r12.setDownloads(20); r12.setUploadDate("2026-03-14"); r12.setUploader("Main Admin");
                r12.setCategory("Computer Science"); r12.setTags(List.of("dbms", "sql", "normalization"));
                r12.setStatus("approved"); r12.setDescription("DBMS concepts, SQL queries, and normalization.");
                r12.setSize("3.5 MB"); r12.setPages(95); r12.setLanguage("English"); r12.setFileUrl(dummyPdf);

                resourceRepository.saveAll(List.of(r1, r2, r3, r4, r5, r6, r7, r8, r9, r10, r11, r12));
            }

            // ── Stats ─────────────────────────────────────────────────────────
            if (!statsRepository.existsById(1L)) {
                statsRepository.save(new Stats(1L, 0, 0, 0, 0));
            }
            statsService.recalculateAndSave();

            // ── Sample Download History for STU101 ────────────────────────────
            if (downloadHistoryRepository.count() == 0) {
                Student stu101 = studentRepository.findById("STU101").orElse(null);
                if (stu101 != null) {
                    Resource res101 = resourceRepository.findById("RES101").orElse(null);
                    Resource res102 = resourceRepository.findById("RES102").orElse(null);
                    Resource res104 = resourceRepository.findById("RES104").orElse(null);

                    if (res101 != null) downloadHistoryRepository.save(
                            new DownloadHistory(stu101, res101, LocalDateTime.now().minusDays(5), 3));
                    if (res102 != null) downloadHistoryRepository.save(
                            new DownloadHistory(stu101, res102, LocalDateTime.now().minusDays(2), 1));
                    if (res104 != null) downloadHistoryRepository.save(
                            new DownloadHistory(stu101, res104, LocalDateTime.now().minusHours(3), 2));
                }
            }

            // ── Sample Bookmarks for STU101 ───────────────────────────────────
            if (bookmarkRepository.count() == 0) {
                Student stu101 = studentRepository.findById("STU101").orElse(null);
                if (stu101 != null) {
                    Resource res101 = resourceRepository.findById("RES101").orElse(null);
                    Resource res108 = resourceRepository.findById("RES108").orElse(null);

                    if (res101 != null) bookmarkRepository.save(
                            new Bookmark(stu101, res101, LocalDateTime.now().minusDays(4)));
                    if (res108 != null) bookmarkRepository.save(
                            new Bookmark(stu101, res108, LocalDateTime.now().minusDays(1)));
                }
            }
        };
    }
}
