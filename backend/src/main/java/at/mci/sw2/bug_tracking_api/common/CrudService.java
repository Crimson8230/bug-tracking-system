package at.mci.sw2.bug_tracking_api.common;

import java.util.List;

public interface CrudService<T, ID> {

    T create(T entity);

    List<T> getAll();

    T getById(ID id);

    T update(ID id, T entity);

    void delete(ID id);
}