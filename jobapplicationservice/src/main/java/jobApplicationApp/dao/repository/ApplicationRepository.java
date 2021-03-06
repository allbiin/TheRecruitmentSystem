package jobApplicationApp.dao.repository;

import jobApplicationApp.entity.ApplicationEntity;


import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.CrudRepository;
import org.springframework.data.repository.query.Param;
import org.springframework.transaction.annotation.Transactional;


import java.util.Collection;
import java.util.Date;


@Transactional
public interface ApplicationRepository extends CrudRepository<ApplicationEntity, Integer> {

    @Query(value = "SELECT * FROM application LIMIT 10 OFFSET :startId", nativeQuery = true)
    Collection<ApplicationEntity> get20ApplicationsPageFrom(@Param("startId") int startId);

    @Query(value = "SELECT application.*  from application, availability WHERE application.availability_id=availability.id AND from_date <= :fromDate AND to_date > :fromDate ", nativeQuery = true)
    Collection<ApplicationEntity> getApplicationsThatCanWorkFrom(@Param("fromDate")Date fromDate);

    @Query(value = "SELECT application.*  from application, availability WHERE application.availability_id=availability.id AND to_date >= :toDate AND from_date < :toDate", nativeQuery = true)
    Collection<ApplicationEntity> getApplicationsThatCanWorkTo(@Param("toDate")Date toDate);

}
