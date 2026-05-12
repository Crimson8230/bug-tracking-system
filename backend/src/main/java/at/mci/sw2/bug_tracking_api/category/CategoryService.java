package at.mci.sw2.bug_tracking_api.category;

import org.springframework.stereotype.Service;
import at.mci.sw2.bug_tracking_api.common.AbstractCrudService;

@Service
public class CategoryService extends AbstractCrudService<Category, Long> {

    public CategoryService(CategoryRepository repository) {
        super(repository);
    }

    public Category update(Long id, Category updated) {
        Category existing = getById(id);

        existing.setCategoryName(updated.getCategoryName());

        return repository.save(existing);
    }
}
