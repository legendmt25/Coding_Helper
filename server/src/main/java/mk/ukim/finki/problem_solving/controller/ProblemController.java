package mk.ukim.finki.problem_solving.controller;

import lombok.AllArgsConstructor;
import mk.ukim.finki.problem_solving.model.object.Category;
import mk.ukim.finki.problem_solving.model.queries.ProblemByLikesQuery;
import mk.ukim.finki.problem_solving.model.enums.Difficulty;
import mk.ukim.finki.problem_solving.model.object.Problem;
import mk.ukim.finki.problem_solving.model.input.ProblemInput;
import mk.ukim.finki.problem_solving.model.reqBody.LikeProblemReqBody;
import mk.ukim.finki.problem_solving.model.reqBody.ProblemsByCategoriesReqBody;
import mk.ukim.finki.problem_solving.service.ProblemService;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.util.List;

@RestController
@RequestMapping("/api")
@AllArgsConstructor
public class ProblemController {
    private final ProblemService problemService;

    @GetMapping("/problems")
    List<Problem> getAllProblems() {
        return this.problemService.findAll();
    }

    @GetMapping("/problem/{id}")
    ProblemByLikesQuery getProblem(@PathVariable Long id) {
        var problem = this.problemService.findById(id);
        return new ProblemByLikesQuery(problem, (long) problem.getLikedBy().size());
    }

    //@PreAuthorize("hasAnyAuthority('ADMIN', 'MODERATOR')")
    @PostMapping("/problem/create")
    Problem create(@RequestPart MultipartFile starterCode, @RequestPart MultipartFile runnerCode, @RequestParam("testCases") MultipartFile[] testCases, @RequestParam String title, @RequestParam Category category, @RequestParam String markdown, @RequestParam Difficulty difficulty) throws IOException {
        var problemInput = new ProblemInput(category, title, difficulty, markdown, starterCode, runnerCode, testCases);
        return this.problemService.create(problemInput);
    }

    @PostMapping("/problem/{id}/like")
    boolean likeToggle(@PathVariable Long id, @RequestBody LikeProblemReqBody body) {
        return this.problemService.likeToggle(id, body.getUserEmail());
    }

    @PostMapping("/problem/{id}/is_liked")
    boolean isLikedBy(@PathVariable Long id, @RequestBody LikeProblemReqBody body) {
        return this.problemService.isLikedBy(id, body.getUserEmail());
    }

    @PostMapping("/problems")
    List<Problem> getAllProblemsByCategories(@RequestBody ProblemsByCategoriesReqBody body) {
        return this.problemService.findAllLByCategories(body.getCategories());
    }

    //@PreAuthorize("hasAuthority('ADMIN')")
    @DeleteMapping("/problem/{id}/delete")
    boolean deleteWithSubmissions(@PathVariable Long id) {
        return this.problemService.delete(id);
    }

    //@PreAuthorize("hasAnyAuthority('ADMIN', 'MODERATOR')")
    @PostMapping("/problem/{id}/edit")
    Problem edit(@PathVariable Long id, @RequestBody ProblemInput problemInput) {
        return this.problemService.update(id, problemInput);
    }

    @GetMapping("/problems/top10")
    List<ProblemByLikesQuery> getTop10() {
        return this.problemService.findTop10ByOrderByLikes();
    }

}
