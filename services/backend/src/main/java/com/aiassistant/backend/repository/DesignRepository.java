// DesignRepository.java
package com.aiassistant.backend.repository;

import com.aiassistant.backend.model.Design;
import com.aiassistant.backend.model.User;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface DesignRepository extends JpaRepository<Design, Long> {
    List<Design> findByUser(User user);
}
