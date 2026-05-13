package at.mci.sw2.bug_tracking_api.category;

import org.springframework.stereotype.Service;
import at.mci.sw2.bug_tracking_api.common.AbstractCrudService;
import at.mci.sw2.bug_tracking_api.category.dto.CategoryCreateRequest;
import at.mci.sw2.bug_tracking_api.category.dto.CategoryResponse;
import at.mci.sw2.bug_tracking_api.category.dto.CategoryUpdateRequest;

import java.util.List;

@Service
public class CategoryService extends AbstractCrudService<Category, Long> {

    private final CategoryRepository categoryRepository;

    public CategoryService(CategoryRepository repository) {
        super(repository);
        this.categoryRepository = repository;
    }

    public CategoryResponse create(CategoryCreateRequest request) {
        Category category = new Category();
        category.setCategoryName(request.categoryName());

        return toResponse(categoryRepository.save(category));
    }

    public List<CategoryResponse> getAllCategories() {
        return categoryRepository.findAll().stream()
                .map(this::toResponse)
                .toList();
    }

    public CategoryResponse getCategoryById(Long id) {
        return toResponse(getById(id));
    }

    public CategoryResponse update(Long id, CategoryUpdateRequest request) {
        Category existing = getById(id);
        existing.setCategoryName(request.categoryName());

        return toResponse(categoryRepository.save(existing));
    }

    @Override
    public Category update(Long id, Category updated) {
        Category existing = getById(id);

        existing.setCategoryName(updated.getCategoryName());

        return repository.save(existing);
    }

    private CategoryResponse toResponse(Category category) {
        return new CategoryResponse(category.getCategoryId(), category.getCategoryName());
    }
}
